const Stripe = require('stripe');
const stripe = Stripe(process.env.OLIVIAS_CARDS_STRIPE_PRIVATE);
const crypto = require('crypto');
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'https://56c57ce9b15f4db6b408a0bfa96b27e1@o423520.ingest.sentry.io/5353905' });

const PRICE_PER_BOX = 3150;

const TEST_PRODUCTS = {
	boxes: [
		{key: 'kids', id: 'prod_Hebk4B3VMCASHd'},
		{key: 'all1', id: 'prod_Hebk6QjXfXExWk'},
		{key: 'all2', id: 'prod_Hebk4QczC39Sfj'},
		{key: 'holiday', id: 'prod_HebkQSrvISjmz2'},
		{key: 'thanksblanks', id: 'prod_Hebksi217YsgPL'},
	],
	donation: 'prod_Hebk95CW1iYelq',
	shipping: 'prod_HebugZoE7nAXuG'
};

const LIVE_PRODUCTS = {
	boxes: [
		{key: 'kids', id: 'prod_HbKHeiE4PjFYi3'},
		{key: 'all1', id: 'prod_Hea1vpUDvs3nTs'},
		{key: 'all2', id: 'prod_Hea1fQYwRzxNd9'},
		{key: 'holiday', id: 'prod_Hea11YJIFABdH4'},
		{key: 'thanksblanks', id: 'prod_Hea2RUVmAm1h4x'},
	],
	donation: 'prod_HeietdWvbmmHtE',
	shipping: 'prod_HeifC4c5z7cAsJ'
};

const PRODUCTS = process.env.NODE_ENV === 'production' ? LIVE_PRODUCTS : TEST_PRODUCTS;

module.exports.handler = async function(event, context) {
	try {
		const payload = JSON.parse(event.body);

		console.log('payload', payload);
		console.log('products', PRODUCTS);

		const address = {
			country: 'US',
			line1: payload.address,
			city: payload.city,
			state: payload.state,
			postal_code: payload.zip
		};

		const customer = await stripe.customers.create({
			name: payload.name,
			email: payload.email,
			//address,
			shipping: {
				name: payload.name,
				address
			},
		});

		console.log('customer', customer);

		let boxCount = 0;
		await Promise.all(PRODUCTS.boxes.map(async box => {
			const quantity = payload.boxes[box.key];
			boxCount += quantity;

			if (quantity > 0) {
				await stripe.invoiceItems.create({
					customer: customer.id,
					currency: 'usd',
					price_data: {
						currency: 'usd',
						product: box.id,
						unit_amount: PRICE_PER_BOX
					},
					quantity
				});
			}
		}));

		const donation = parseInt(payload.donation.replace(/[^\d]/g, ''), 10);
		if (donation > 0) {
			await stripe.invoiceItems.create({
				customer: customer.id,
				currency: 'usd',
				price_data: {
					currency: 'usd',
					product: PRODUCTS.donation,
					unit_amount: donation
				}
			});
		}

		if (boxCount > 0) {
			const hash = crypto.createHash('sha512');
			hash.update(payload.coupon);
			if (hash.digest('hex') === process.env.GATSBY_OLIVIAS_CARDS_FREE_DELIVERY_HASH) {
				await stripe.invoiceItems.create({
					customer: customer.id,
					currency: 'usd',
					description: 'Local Delivery',
					price_data: {
						currency: 'usd',
						product: PRODUCTS.shipping,
						unit_amount: 0
					}
				});
			} else {
				const item = await stripe.invoiceItems.create({
					customer: customer.id,
					currency: 'usd',
					quantity: 1,
					price_data: {
						currency: 'usd',
						product: PRODUCTS.shipping,
						unit_amount: 500 * boxCount
					}
				});
			}
		}

		const invoice = await stripe.invoices.create({
			customer: customer.id,
			auto_advance: false
		});

		console.log('invoice', invoice);

		const card = await stripe.customers.createSource(customer.id, {
			source: payload.token
		});

		console.log('card', card);

		await stripe.invoices.pay(invoice.id);

		const finalInvoice = await stripe.invoices.retrieve(invoice.id);

		console.log('finalInvoice', finalInvoice);

		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				amount: finalInvoice.total
			})
		};
	} catch (err) {
		Sentry.captureException(err);

		console.error('error', err);
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
}

// Now you are ready to access this API from anywhere in your Gatsby app! For example, in any event handler or lifecycle method, insert:
// fetch("/.netlify/functions/hello")
//    .then(response => response.json())
//    .then(console.log)
// For more info see: https://www.gatsbyjs.org/blog/2018-12-17-turning-the-static-dynamic/#static-dynamic-is-a-spectrum
