import React, {useState} from 'react';
import { Helmet } from 'react-helmet';
import Img from "gatsby-image"
import _ from 'lodash'
import { graphql, Link } from 'gatsby'

import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
  injectStripe
} from '@stripe/react-stripe-js';
import Cards from 'react-credit-cards';
import sha512 from 'js-sha512';
import * as Yup from 'yup';
import * as cardValidator from 'card-validator';
import * as Sentry from '@sentry/browser';
//import { OLIVIAS_CARDS_STRIPE_PUBLIC } from "gatsby-env-variables"
//window.sha512 = sha512;

import './style.sass'

Sentry.init({ dsn: 'https://56c57ce9b15f4db6b408a0bfa96b27e1@o423520.ingest.sentry.io/5353905' });

const stripePromise = loadStripe(process.env.GATSBY_OLIVIAS_CARDS_STRIPE_PUBLIC);

const PRICE_PER_BOX = 3150;
const FREE_DELIVERY_CODE = process.env.GATSBY_OLIVIAS_CARDS_FREE_DELIVERY_HASH;

const BOXES = [
	{
		image: '92579501_2699594073596802_1619589243418443776_o',
		title: 'Kids Birthday Box',
		key: 'kids',
		description: '30 Hand Crafted and Printed cards designed especially for kids'
	},
	{
		image: '92696975_2699594150263461_3946356646103482368_o',
		title: 'All Occasion Box #1',
		key: 'all1',
		description: '11 Birthday, 1 Belated Birthday, 4 Blank, 2 New 	Baby, 1 New Home, 1 Anniversary, 1 Good Luck, 3 Congratulations, 1 Engagement, 1 Wedding, 3 Sympathy, 1 Thank you'
	},
	{
		image: '92818158_2699594126930130_5674995173591875584_o',
		title: 'All Occasion Box #2',
		key: 'all2',
		description: '13 Birthday, 2 Blank, 1 New Baby, 2 New Home, 1 Anniversary, 2 Congratulations, 1	Engagement, 2 Get Well, 2 Thinking of you, 4 Thank you'
	},
	{
		image: '92626572_2699594050263471_1142092865556447232_o',
		title: 'Holiday Box',
		key: 'holiday',
		description: '2 New Year’s , 4 Valentine’s Day, 2 St. Patrick’s Day, 4 Easter, 2 Mother’s Day, 2 Father’s Day, 2 July 4th, 2 Grandparent’s Day, 2 Halloween, 2 Thanksgiving, 2 Hanukkah, 24 Christmas & Holidays'
	},
	{
		image: '98009957_2736816583207884_8606884993966276608_o',
		title: 'Thanks & Blanks',
		key: 'thanksblanks',
		description: '15 Thanks, 15 Blanks'
	},
];

BOXES.forEach(box => {
	// box.count = 0;


});

function recordEvent(category, action) {
	if (window.ga) {
		window.ga('send', 'event', category, action, 'Olivias Cards');
	}
}

function getFile(name, files) {
	//console.log('getFile', name, files);
	const node = files.edges.find(f => {
		//console.log('comparing', name, f.node.name);
		const match = name === f.node.name;
		//console.log('match', match);
		return match;
	}).node;
	//console.log('file', name, node);
	return node;
}

function PlusIcon() {
	return <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-plus-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fillRule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
		<path fillRule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
		<path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
	</svg>;
}

function MinusIcon() {
	return <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-dash-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
		<path fillRule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/>
	</svg>;
}

function AddToCart() {
	return <div className="add-to-cart">
		<MinusIcon />
		<p className="count-in-cart">0</p>
		<PlusIcon />
	</div>;
}

function Header({params, boxCount}) {
	console.log('Header params', params);
	const BASE_PATH = params.uri;
	console.log('BASE_PATH', BASE_PATH);

	let HEADERS = [
		['Mustard Seed School', 'school']
	];
	HEADERS = HEADERS.concat(BOXES.map(box => ([box.title, box.key])));
	HEADERS = HEADERS.concat([
		['Cart', 'cart', boxCount]
	]);

	let SMALL_HEADERS = [
		['Mustard Seed School', 'school'],
		['Boxes', BOXES[0].key],
		['Cart', 'cart', boxCount]
	];

	console.log('HEADERS', HEADERS);

	return <div className="box-shadow sticky-top">
		<div className="d-none d-lg-block">
			<nav className="navbar navbar-expand navbar-light nav-underline border-bottom">
				<div className="container">
					<div className="collapse navbar-collapse">
						<ul className="navbar-nav nav justify-content-center">
							{HEADERS.map(l => {
								let innerSpan = '';
								if (l[2]) {
									innerSpan = <span className="badge badge-pill">{l[2]}</span>
								}

								return <li key={l[1] || 'home'} className="nav-item">
									<a href={`#${l[1]}`} className="nav-link">{l[0]}{innerSpan}</a>
								</li>;
							})}
						</ul>
					</div>
				</div>
			</nav>
		</div>

		<div className="d-block d-lg-none">
			<nav className="navbar navbar-expand navbar-light nav-underline border-bottom">
				<div className="container">
					<div className="collapse navbar-collapse">
						<ul className="navbar-nav nav justify-content-center">
							{SMALL_HEADERS.map(l => {
								let innerSpan = '';
								if (l[2]) {
									innerSpan = <span className="badge badge-pill">{l[2]}</span>
								}

								return <li key={l[1] || 'home'} className="nav-item">
									<a href={`#${l[1]}`} className="nav-link">{l[0]}{innerSpan}</a>
								</li>;
							})}
						</ul>
					</div>
				</div>
			</nav>
		</div>
	</div>;
}

function BoxDetails({count, details}) {
	return <div className={`box-details ${details.key}`}>
		<div className="container">
			<div className="row text-center" style={{marginBottom: 0}}>
				<div className="col">
					<h3 id={details.key} className="box-title text-center">{details.title}</h3>
				</div>
			</div>
{/*}
			<div className="row">
				<div className="col text-center">
					<AddToCart />
				</div>
			</div>
*/}
			<div className="row">
				<div className="col">
					<p className="box-description">{details.description}</p>
				</div>
			</div>

			<div className="row" style={{paddingBottom: '1em'}}>
				<div className="col">
					<Img fluid={details.images[0].fluid} className="d-block w-100 rounded" alt={details.title} style={{marginLeft:'auto', marginRight: 'auto'}} />
				</div>
			</div>
		</div>
	</div>;
}

function formatPrice(cents) {
	const str = ('' + cents).padStart(3, '0');
	return `${str.slice(0, -2)}.${str.slice(-2)}`
}

const NAME_VALIDATION = Yup.string().required();
const EMAIL_VALIDATION = Yup.string().email().required();
const ADDRESS_VALIDATION = Yup.string().required();
const CITY_VALIDATION = Yup.string().required();
const STATE_VALIDATION = Yup.string().required();
const ZIP_VALIDATION = Yup.string().required().min(5).max(10);

const CHECKOUT_VALIDATION = Yup.object({
	name: NAME_VALIDATION,
	email: EMAIL_VALIDATION,
	address: ADDRESS_VALIDATION,
	city: CITY_VALIDATION,
	state: STATE_VALIDATION,
	zip: ZIP_VALIDATION,
	cc: Yup.boolean().oneOf([true])
});

function Page(params) {
	//console.log('Page', params);

	function getImage(name) {
		//console.log('getImage', name, params.data);
		const node = getFile(name, params.data.files);
		//console.log('getFluidImage', name, node);
		return node.image;
	}

	let initialState = {
		donation: '',
		coupon: '',
	};
	BOXES.forEach(box => initialState[box.key] = 0);

	const [cart, setCart] = useState(initialState);
	const [step, setStepData] = useState(false);	// false is cart, true is checkout
	const [info, setInfo] = useState({
		name: '',
		email: '',
		address: '',
		city: '',
		state: '',
		zip: '',
		cc: false
	});
	const [isCheckoutValid, setCheckoutValid] = useState(false);
	const [isProcessing, setProcessing] = useState(false);
	const [doneState, setDoneState] = useState([false, 0]);
	const [isError, setError] = useState(false);
	const [isReady, setReady] = useState(false);

	stripePromise.then(() => setReady(true));

	const stripe = useStripe();
	const elements = useElements();

	console.log('cart', cart);

	BOXES.forEach((box, iteration) => {
		box.images = [getImage(box.image)];

		box.getCount = function () {
			return cart[box.key];
		};

		box.setCount = function (count) {
			count = parseInt(count, 10);
			count = Math.max(count, 0);

			const newCart = Object.assign({}, cart, {
				[box.key]: count
			});

			console.log('setCount', box.key, count, newCart);
			setCart(newCart);
		};

		box.getSubtotal = function () {
			const count = box.getCount() || 0;

			return count * PRICE_PER_BOX;
		}
	});

	function getTotalBoxCount() {
		return BOXES.reduce((total, box) => total + box.getCount(), 0);
	}

	function setDonation(value) {
		const REGEX = /(^[\d,]+(\.\d{0,2})?)/;
		const match = REGEX.exec(value);
		console.log('setDonation', match);
		value = match ? match[1] : '';
		setCart(Object.assign({}, cart, {
			donation: value
		}));
	}

	function setCoupon(value) {
		setCart(Object.assign({}, cart, {
			coupon: value
		}));
	}

	function getShipping() {
		if (sha512(cart.coupon) === FREE_DELIVERY_CODE) {
			return 0;
		}

		const boxCount = getTotalBoxCount();
		console.log('getBoxCount', boxCount);

		if (boxCount == 0) {
			return 0;
		}

		return boxCount*500;
	}

	function getSubtotal() {
		let subtotal = 0;

		console.log('cart', cart);

		BOXES.forEach(box => subtotal += box.getSubtotal());

		const [donationDollars, donationCents] = cart.donation.replace(/[^\d\.]/g, '').split('.');
		console.log('donationParts', donationDollars, donationCents);
		if (donationDollars) {
			subtotal += parseInt(donationDollars, 10) * 100;
		}
		if (donationCents) {
			subtotal += parseInt(donationCents.padEnd(2, '0'), 10);
		}
		//subtotal += parseInt(cart.donation.replace('.', '').padEnd(3, '0'), 10);
		console.log('subtotal', subtotal);

		subtotal += getShipping();

		return subtotal;
	}

	function setInfoValue(key, value) {
		const update = {
			...info,
			[key]: value
		};

		console.log('info', update);
		setInfo(update);

		const isValid = CHECKOUT_VALIDATION.isValidSync(update);
		console.log('isValid', isValid);
		setCheckoutValid(isValid);
	}

	function setStep(value) {

		if (value) {
			// "Proceed to checkout"

			recordEvent('cart', 'finalize');
			//ga('send', 'event', 'cart', 'finalize', 'Olivias Cards');
		} else {
			// "Back to cart"
			recordEvent('cart', 'return');
			//ga('send', 'event', 'cart', 'edit', 'Olivias Cards');
		}

		setInfoValue('cc', false);
		setStepData(value);
	}

	function doCheckout(e) {
		console.log('checkout', e);

		recordEvent('cart', 'checkout');
		//ga('send', 'event', 'cart', 'checkout', 'Olivias Cards');

		setProcessing(true);
		setError(false);

		try {
			const element = elements.getElement(CardElement);
			console.log('card', element);

			stripe.createToken(element)
			.then((res) => {
				console.log('token', res);

				if (res.error) {
					throw new Error(res.error);
				}

				const {token} = res;
				const tokenId = token.id;

				const payload = {
					token: tokenId,
					boxes: {},
					donation: formatPrice(cart.donation),
					coupon: cart.coupon,
					name: info['name'],
					email: info['email'],
					address: info['address'],
					city: info['city'],
					state: info['state'],
					zip: info['zip'],
				};

				BOXES.forEach(box => {
					payload.boxes[box.key] = box.getCount();
				});

				console.log('posting payload', payload);

				return fetch('/.netlify/functions/olivias-cards', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(payload)
				});
			})
			.then(res => {
				console.log('response', res);
				return res.json();
			})
			.then(data => {
				console.log('response data', data);

				if (!data.success) {
					throw data;
				}

				setDoneState([true, data.amount]);
				setCart(BOXES.map(() => 0));
			})
			.catch(err => {
				console.error('promise error', err);

				if (typeof(err) === 'string') {
					Sentry.captureMessage(err);
				} else {
					Sentry.captureException(err);
				}

				let error = true;
				if (err.code && err.code === 'card_error') {
					error = err.message;
				} else if (err.rawType && err.rawType === 'card_error') {
					error = err.raw.message;
				}

				console.error('setting error', error);
				setError(error);

				recordEvent('checkout', 'error');
				//ga('send', 'event', 'checkout', 'error', 'Olivias Cards');
			})
			.then(() => {
				setProcessing(false);
				recordEvent('checkout', 'complete');
				//ga('send', 'event', 'checkout', 'complete', 'Olivias Cards');
			});
		} catch (err) {
			if (typeof(err) === 'string') {
				Sentry.captureMessage(err);
			} else {
				Sentry.captureException(err);
			}

			console.error('doCheckout error', err);

			setProcessing(false);
			setError(true);
			recordEvent('checkout', 'error');
			//ga('send', 'event', 'checkout', 'error', 'Olivias Cards');
		}
	}

	let footer = '';
	if (!isReady) {
		footer = <div style={{background: '#eee'}}>
			<div className="container">
				<div className="row" style={{paddingTop: '2em'}}>
					<div className="col-8 offset-2">
						<div className="alert alert-info" role="alert">
							<h4 className="alter-heading">Loading order form</h4>

							<p>If the form is not loading, please try to reload the page. If that doesn't resolve the issue, contact us at oliviascards@mcurcio.com for help.</p>
						</div>
					</div>
				</div>
			</div>
		</div>;
	} else {
		if (doneState[0]) {
			footer = <div style={{background: '#eee'}}>
				<div className="container">
					<div className="row" style={{paddingTop: '2em'}}>
						<div className="col-8 offset-2">
							<div className="alert alert-success" role="alert">
								<h4 className="alert-heading">Order complete!</h4>

								<p>Your card was charged <strong>${formatPrice(doneState[1])}</strong>. If you have any questions, please send an email to oliviascards@mcurcio.com</p>
							</div>
						</div>
					</div>
				</div>
			</div>;
		} else {
			if (step === false) {
				footer = <div style={{background: '#eee'}}>
							<div className="container">
								<div className="row">
									<div className="col">
										<h2 id="cart" className="text-center">Cart</h2>
									</div>
								</div>

								<div className="row">
									<div className="col-12 col-lg-6 offset-lg-3 rounded" style={{background: '#fff', padding: '3em', marginBottom: '3em'}}>




										{BOXES.map((box, iteration) => {
											return <div key={box.key} className={`form-group row`} style={{marginBottom: 0}}>
												<label htmlFor={`box${box.key}`} className="col-6 col-form-label">{box.title}</label>
												<div className="col-3">
													<input type="number" className="form-control" id={`box${box.key}`} value={box.getCount()} onChange={(e) => box.setCount(e.target.value)} />
												</div>
												<div className="col-form-label col-3" style={{textAlign: 'right'}}>${formatPrice(box.getSubtotal())}</div>

											</div>;
										})}

										<div className="row" style={{marginTop: '2em', marginBottom: '0.5em'}}>
											<div className="col-sm-8 text-right">Shipping* ($5/box)</div>
											<div className="col-sm-4" style={{textAlign: 'right'}}>${formatPrice(getShipping())}</div>
										</div>
										<div className="form-group row" style={{marginBottom: 0}}>
											<label htmlFor="coupon" className="col-sm-4 col-form-label offset-sm-4 text-right">Shipping Code</label>

											<div className="col-sm-4 input-group" style={{textAlign: 'right'}}>
												<input id="coupon" type="text" className="form-control" value={cart.coupon} onChange={e => setCoupon(e.target.value)} />
											</div>
										</div>
										<div className="row">
											<div className="col text-right text-muted" style={{fontSize: '0.7em'}}>
												<p style={{marginBottom: 0}}>* Cards will be shipped without decorative boxes</p>
												<p style={{marginBottom: 0}}>Sorry, we can't compete with Amazon delivery prices!</p>
											</div>
										</div>

										<div className="form-group row" style={{marginTop: '2em'}}>
											<label htmlFor="donation" className="col-md-8 col-form-label text-right">Donate to Mustard Seed School</label>

											<div className="col-md-4 input-group">
												<div className="input-group-prepend">
													<span className="input-group-text">$</span>
												</div>
												<input id="donation" type="text" className="form-control" style={{textAlign: 'right'}} value={cart.donation} onChange={e => setDonation(e.target.value)} />
											</div>
										</div>

										<div className="row">
											<div className="col-sm-3 offset-sm-5 text-right">Total</div>
											<div className="col-sm-4 text-right">${formatPrice(getSubtotal())}</div>
										</div>

										<div className="row">
											<div className="col">
												<button type="button" className="btn btn-primary btn-block" onClick={() => setStep(true)} disabled={getSubtotal()===0}>Proceed to Checkout</button>
											</div>
										</div>
									</div>
								</div>
							</div>
				</div>;
			} else {
				const validateClassName = (VALIDATION, key) => {
					const value = info[key];
					if (value.trim().length !== 0) {
						return VALIDATION.isValidSync(value) ? 'is-valid' : 'is-invalid';
					}
				}

				footer = <div style={{background: '#eee'}}>
					<div className="container">
						<div className="row">
							<div className="col">
								<h2 id="cart" className="text-center">Checkout</h2>
							</div>
						</div>

						<div className="row">
							<div className="col-12 col-lg-6 offset-lg-3 rounded" style={{background: '#fff', padding: '3em', marginBottom: '3em'}}>



							<div className="form-row">
								<h3 style={{paddingTop: 0}}>Contact Info</h3>
							</div>



							<div className="form-row" style={{marginBottom: '0.5em'}}>
								<div className="col-12">
									<input type="text" className={`form-control ${validateClassName(NAME_VALIDATION, 'name')}`} placeholder="Name *" value={info['name']} onChange={(e) => setInfoValue('name', e.target.value)} onFocus={e => setInfoValue('focus', 'name')}  />
								</div>
							</div>

							<div className="form-row">
								<div className="col-12">
									<input type="email" className={`form-control ${validateClassName(EMAIL_VALIDATION, 'email')}`} placeholder="Email *" value={info['email']} onChange={(e) => setInfoValue('email', e.target.value)} />
								</div>
							</div>

		<div className="form-row" style={{marginTop: '0em'}}>
			<h3>Shipping Info</h3>
		</div>



			<div className="form-row" style={{marginBottom: '0.5em'}}>
				<div className="col-12">
					<input type="text" className={`form-control ${validateClassName(ADDRESS_VALIDATION, 'address')}`} placeholder="Address *" value={info['address']} onChange={(e) => setInfoValue('address', e.target.value)} />
				</div>
			</div>

		  <div className="form-row">
			<div className="col-7">
			  <input type="text" className={`form-control ${validateClassName(CITY_VALIDATION, 'city')}`} placeholder="City *" value={info['city']} onChange={(e) => setInfoValue('city', e.target.value)} />
			</div>
			<div className="col">
			  <input type="text" className={`form-control ${validateClassName(STATE_VALIDATION, 'state')}`} placeholder="State *" value={info['state']} onChange={(e) => setInfoValue('state', e.target.value)} />
			</div>
			<div className="col">
			  <input type="text" className={`form-control ${validateClassName(ZIP_VALIDATION, 'zip')}`} placeholder="Zip *" value={info['zip']} onChange={(e) => setInfoValue('zip', e.target.value)} />
			</div>
		  </div>

			<div className="form-row" style={{marginTop: '0em'}}>
				<h3>Payment</h3>
			</div>

		  <div className="form-row">
		  	<div className="col">
					<CardElement className="form-control" onChange={e => setInfoValue('cc', e.complete)} options={{
						hidePostalCode: true,
						classes: {
							base: 'form-control',
							complete: 'is-valid',
							invalid: 'is-invalid',
						},
						style: {
							base: {
								display: 'block',
								width: '100%',
								height: '38px',
								padding: '6px 12px',
								fontSize: '16px',
								fontWeight: 400,
								lineHeight: '24px',
								color: '#495057',
								backgroundColor: '#fff',
								backgroundClip: 'padding-box',
								border: '1px solid #ced4da',
								borderRadius: '4px',
								transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
							},

						}
					}} />
			</div>
		  </div>

		<button type="button" className="btn btn-primary btn-block" disabled={!isCheckoutValid || isProcessing} onClick={doCheckout} style={{marginTop: '2em'}}>Checkout &mdash; ${formatPrice(getSubtotal())}</button>
		<button type="button" className="btn btn-link" onClick={() => setStep(false)}>Review Cart</button>

			{isProcessing ?	<div className="alert alert-primary" role="alert">
				Please wait, your order is being processed <div className="spinner-border" role="status" style={{width: '1em', height: '1em'}}>
	  <span className="sr-only">Loading...</span>
	</div>
			</div> : ''}

			{isError ?	<div className="alert alert-danger" role="alert">
				<p>{(typeof(isError)==='string') ? <p>{isError}</p> : 'Something went wrong'}</p>

				<p>If you are unable to complete checkout, please contact us at oliviascards@mcurcio.com</p>

			</div> : ''}

							</div>
						</div>
					</div>
				</div>;
			}
		}
	} // isReady

	const buildings = getImage("buildings");
	//console.log("buildings", buildings);

	return <>
		<Helmet>
			<title>Olivia's Cards for Mustard Seed School</title>
			<bodyAttributes data-spy="scroll" data-target="#navbar" data-offset="0" className="cards-for-mustard-seed" />
{/*
			<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
			<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
			<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
*/}

			<meta property="og:type" content="website" />
			<meta property="og:title" content="Olivias Cards for Mustard Seed School" />
			<meta property="og:url" content="https://mcurcio.com/olivias-cards-for-mustard-seed/" />
			<meta property="og:description" content="Fundraiser supporting Mustard Seed School for homeless children" />
			<meta property="og:image" content={`https://mcurcio.com${buildings.fluid.src}`} />



		</Helmet>

		<Header params={params} boxCount={getTotalBoxCount()} className='sticky-top' />

		<div data-spy="scroll" data-target="navbar" data-offset="0">
			<div className="container">
				<div className="row">
				<div className="col col-md-8 offset-md-2">
				<blockquote className="blockquote" style={{marginTop: '3em'}}>
					<p className="mb-0" style={{marginTop: '1em'}}>Our daughter, Olivia, would have been 5 years old on August 11, 2020 and entering kindergarten for the first time this year.</p>

					<p className="mb-0" style={{marginTop: '1em'}}>Thank you for being a part of creating a legacy for our Olivia. As her parents, it is our desire to transform pain and loss into a legacy of love &mdash; love that hopes, love that perseveres.</p>

					<p className="mb-0" style={{marginTop: '1em'}}>If you are not able to purchase a card box at this time, please <a href="#cart">consider a donation</a>. Every dollar will contribute to bringing hope and resources for homeless children and their families to persevere.</p>

					<p style={{marginTop: '1em', fontSize: '1em'}}>If you have any questions, please send an email to oliviascards@mcurcio.com</p>

					<p style={{marginTop: '1em', fontSize: '1em'}}>Ordering will close on August 2, and boxes will ship mid-August.</p>

					<footer className="blockquote-footer" style={{marginTop: '1em'}}>With deepest gratitude, <cite title="Celeste & Matt Curcio">Celeste &amp; Matt Curcio</cite></footer>
				</blockquote>
				</div>
				</div>

				<h1 style={{marginTop: '1em', marginBottom: '1em'}}>Olivia's Cards for Mustard Seed</h1>

				<div className="row justify-content-center">
					<div className="col-md-8">
						<blockquote className="blockquote" style={{fontSize: '1em'}}>
							<p className="lead" style={{fontSize: '1em'}}>Do you know someone who needs a smile? Me too. With COVID cases on the rise, this seems like the perfect time to deliver a socially distant hug via a card!</p>

							<p className="lead" style={{fontSize: '1em'}}>For ${formatPrice(PRICE_PER_BOX)} you will receive 30 or more high quality hand-crafted or printed cards in a beautiful storage box. Adorable AND functional AND to help children in our community? Yes please!</p>

							<p>At least <strong>$13 of each box sold will go towards meeting the needs of Mustard Seed classes</strong>.</p>

							<p style={{display: 'none'}}>All you need to do is use the link below to select which box(es) you’d like to purchase. If you live locally, I will deliver your purchase to your door. Talk about full service! If you live further away, I can ship your cards without the decorative box.</p>

						</blockquote>
					</div>
				</div>

				<div className="row">
					<div className="col-md-6">
						<h2 id="school">Mustard Seed School</h2>

						<p><a href='http://www.sacloaves.org/programs/mustardseedschool'>Mustard Seed</a> is a free, private school for children 3-15 years old which provides a safe, nurturing and structured environment, a positive learning experience, happy memories, survival resources of food, clothing and shelter referrals, medical and dental screenings, immunization updates, counseling for children and their parents, and assistance entering or reentering public schools.</p>

						<p>Mustard Seed School was established in 1989 to help meet the needs of homeless children. Many school age children do not attend school because of their homelessness; some lack immunizations, birth certificates, or other documents, some are in transit, and almost all lack a support system. In spite of their situations these children are eager to learn and to be accepted.</p>

						<p>Learn more about Mustard Seed School at the <a href='http://www.sacloaves.org/programs/mustardseedschool'>Loaves and Fishes site</a>, or visit their <a href='http://a.co/hEnKC9i'>Amazon wish list</a> for a list of items they need.</p>
					</div>

					<div className="col-md-6">
						<Img fluid={getImage("mustardballoon").fluid} className="rounded" />
					</div>
				</div>

				<div className="row">
					<div className="col">
						<h2 className="text-center">Card Collections</h2>
					</div>
				</div>
			</div>

			{BOXES.map((box, iteration) => {
				return <BoxDetails key={box.key} count={iteration} details={box} />
			})}

			{footer}
		</div>
	</>;
}

function DefaultOutput(props) {
	return <Elements stripe={stripePromise}>
		<Page {...props} />
	</Elements>
}

export default DefaultOutput;

export const query = graphql`
query MyQuery {
  files: allFile(filter: {absolutePath: {glob: "**/olivias-cards-for-mustard-seed/**"}}) {
    edges {
      node {
        name
        image: childImageSharp {
          fluid(quality: 100 maxWidth: 2000) {
            ...GatsbyImageSharpFluid
			...GatsbyImageSharpFluidLimitPresentationSize
          }
        }
      }
    }
  }
}
`
