require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.OLIVIAS_CARDS_STRIPE_PRIVATE);
const util = require('util');

const BOX_PRICE = 3150;
const PRODUCTS = [
	{key: 'kids', name: 'Kids Birthday Cards', amount: BOX_PRICE},
	{key: 'all1', name: 'All Occasions Cards #1', amount: BOX_PRICE},
	{key: 'all2', name: 'All Occasions Cards #2', amount: BOX_PRICE},
	{key: 'holiday', name: 'Holiday Cards', amount: BOX_PRICE},
	{key: 'thanksblanks', name: 'Thanks & Blanks Cards', amount: BOX_PRICE},
	{key: 'donation', name: 'Donate to Mustard Seed School', amount: 1},
	{key: 'shipping', name: 'Shipping', amount: 1000}
];

async function deleteAllResources() {
	// delete all skus
	const skus = await stripe.skus.list();
	await Promise.all(skus.data.map(({id}) => stripe.skus.del(id)));

	// delete all products
	const products = await stripe.products.list();
	await Promise.all(products.data.map(({id}) => stripe.products.del(id)));
}

async function createResources() {
	await Promise.all(PRODUCTS.map(async product => {
		const stripeProduct = await stripe.products.create({
			name: product.name,
			type: 'good',
		});

		product.product = stripeProduct.id;

		const stripeSku = await stripe.skus.create({
			currency: 'usd',
			inventory: {
				type: 'infinite'
			},
			price: product.amount,
			product: stripeProduct.id
		});

		product.sku = stripeSku.id;
	}));
}

(async function () {
	try {
		//console.log('deleting resources');
		//await deleteAllResources();

		console.log('creating resources');
		await createResources();

		console.log('');

		const OUTPUT = {};
		PRODUCTS.forEach(p => {
			OUTPUT[p.key] = p.sku;
		});

		console.log(util.inspect(OUTPUT));
	} catch (err) {
		console.error(err);
	}
})();
