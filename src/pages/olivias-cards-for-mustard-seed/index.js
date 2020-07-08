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
} from '@stripe/react-stripe-js';
import Cards from 'react-credit-cards';
import sha512 from 'js-sha512';
//window.sha512 = sha512;

import './style.sass'

const TEST_STRIPE_KEY = 'pk_test_51H1gNHKfzXCgcPcVsgq44OyTHMAtY2pGJ9j08uYN3Xs7K6RIZUGVNLm8coyoc3NMHzB6Cmuuby9lzNYO14AMq7sP00dMmtHiWh';
const LIVE_STRIPE_KEY = 'pk_live_51H1gNHKfzXCgcPcVMSDt4gpCRR2Nm9my4JMzyKs5K3ZUWovlzvEQpWeRso5eCu9ABiFhZnGQ7B18Njfebi3iKMrG00AsdJIKic';

const PRICE_PER_BOX = 3150;
const FREE_DELIVERY_CODE = '4a3968bef4c928978ed7581d6304fdd039f36905bccd297e33a770728e66dbdc5528d2df4a6d442a39f13e6a9cc1267ae3a0595603bde68ad6d927088847b239';

const BOXES = [
	{
		image: '92579501_2699594073596802_1619589243418443776_o',
		title: 'Kids Box',
		key: 'kids',
		description: '30 Hand Crafted and Printed cards designed especially for kids'
	},
	{
		image: '92696975_2699594150263461_3946356646103482368_o',
		title: 'All Occassion Box #1',
		key: 'all1',
		description: '11 Birthday, 1 Belated Birthday, 4 Blank, 2 New 	Baby, 1 New Home, 1 Anniversary, 1 Good Luck, 3 Congratulations, 1 Engagement, 1 Wedding, 3 Sympathy, 1 Thank you'
	},
	{
		image: '92818158_2699594126930130_5674995173591875584_o',
		title: 'All Occassion Box #2',
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

const stripePromise = loadStripe(TEST_STRIPE_KEY);

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

function Header({params}) {
	console.log('Header params', params);
	const BASE_PATH = params.uri;
	console.log('BASE_PATH', BASE_PATH);

	let HEADERS = [
		['Mustard Seed School', '']
	];
	HEADERS = HEADERS.concat(BOXES.map(box => ([box.title, box.key])));
	HEADERS = HEADERS.concat([
		['Cart', 'cart']
	]);

	console.log('HEADERS', HEADERS);

	return <div className="box-shadow sticky-top">
		<nav className="navbar navbar-expand-lg navbar-light nav-underline border-bottom" id="navbar">
			<div className="container">
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav nav">
						{HEADERS.map(l => {
							return <li key={l[1] || 'home'} className="nav-item">
								<a href={`#${l[1]}`} className="nav-link">{l[0]}</a>
							</li>;
						})}
					</ul>
				</div>
			</div>
		</nav>
	</div>;
}

function BoxDetails({count, details}) {
	return <div className={`box-details ${details.key}`}>
		<div className="container">
			<div className="row text-center" style={{marginBottom: 0}}>
				<div className="col">
					<h2 id={details.key} className="box-title text-center">{details.title}</h2>
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
			const count = box.getCount();

			return count * PRICE_PER_BOX;
		}
	});

	function setDonation(value) {
		const REGEX = /(^\d+(\.\d{0,2})?)/;
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

		const boxCount = BOXES.reduce((total, box) => total + box.getCount(), 0);
		console.log('getBoxCount', boxCount);

		if (boxCount == 0) {
			return 0;
		} else if (boxCount < 3) {
			return 1000;
		}

		return 1000 + (boxCount-2)*400;
	}

	function getSubtotal() {
		let subtotal = 0;

		console.log('cart', cart);

		BOXES.forEach(box => subtotal += box.getSubtotal());

		const [donationDollars, donationCents] = cart.donation.split('.');
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

	return <>
		<Helmet>
			<title>Olivia's Cards for Mustard Seed School</title>
			<bodyAttributes data-spy="scroll" data-target="#navbar" data-offset="0" />
{/*}
			<script
			  src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
			  integrity="sha256-4+XzXVhsDmqanXGHaHvgh1gMQKX40OUvDEBTu8JcmNs="
			  crossorigin="anonymous"></script>
			<script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" />
*/}
		</Helmet>

		<Header params={params} className='sticky-top' />

		<div data-spy="scroll" data-target="navbar" data-offset="0">
			<div className="container">
				<h1 style={{marginTop: '1em', marginBottom: '1em'}}>Olivias Cards for Mustard Seed</h1>

				<div className="row justify-content-center">
					<div className="col-8">
						<blockquote className="blockquote" style={{fontSize: '1em'}}>
							<p className="lead" style={{fontSize: '1em'}}>Do you know someone who needs a smile? Me too. With COVID cases on the rise, this seems like the perfect time to deliver a socially distant hug via a card!</p>

							<p className="lead" style={{fontSize: '1em'}}>For $31.50 you will receive 30 or more high quality hand-crafted cards in a beautiful storage box. Adorable AND functional AND to help children in our community? Yes please!</p>

							<p><strong>$13 of each box sold will go towards meeting the needs of Mustard Seed classes.</strong></p>

							<p style={{display: 'none'}}>All you need to do is use the link below to select which box(es) you’d like to purchase. If you live locally, I will deliver your purchase to your door. Talk about full service! If you live further away, I can ship your cards without the decorative box.</p>

						</blockquote>
					</div>
				</div>

				<div className="row">
					<div className="col-md-6">
						<h2>Mustard Seed School</h2>

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

			<div className="container">
				<div className="row">
					<div className="col">
					</div>
				</div>

				<div className="row">
					<div className="col-md-6">
						<h3 id="cart" className="text-center">Cart</h3>

						{BOXES.map((box, iteration) => {
							return <div key={box.key} className={`form-group row`} style={{marginBottom: 0}}>
								<div className="col-sm-2">
									<input type="number" className="form-control" id={`box${box.key}`} value={box.getCount()} onChange={(e) => box.setCount(e.target.value)} />
								</div>
								<label htmlFor={`box${box.key}`} className="col-sm-6 col-form-label">{box.title}</label>
								<div className="col-sm-3 col-form-label">${formatPrice(box.getSubtotal())}</div>

							</div>;
						})}

						<div className="form-group row" style={{marginTop: '2em'}}>
							<label htmlFor="donation" className="col-sm-5 col-form-label offset-sm-2">Donate to Mustard School</label>

							<div className="col-sm-3 input-group">
								<div className="input-group-prepend">
									<span className="input-group-text">$</span>
								</div>
								<input id="donation" type="text" className="form-control" style={{textAlign: 'right'}} value={cart.donation} onChange={e => setDonation(e.target.value)} />
							</div>
						</div>

						<div className="form-group row">
							<label htmlFor="coupon" className="col-sm-4 col-form-label offset-sm-2">Coupon Code</label>

							<div className="col-sm-4 input-group">
								<input id="coupon" type="text" className="form-control" value={cart.coupon} onChange={e => setCoupon(e.target.value)} />
							</div>
						</div>

						<div className="row">
							<div className="col-sm-3 offset-sm-5">Shipping</div>
							<div className="col-sm-3">${formatPrice(getShipping())}</div>
						</div>

						<div className="row">
							<div className="col-sm-3 offset-sm-5">Total</div>
							<div className="col-sm-3">${formatPrice(getSubtotal())}</div>
						</div>
					</div>

					<div className="col">
						<h3 id="checkout" className="text-center">Checkout</h3>

						<form>
						<div className="form-row">
							<div className="col-12">
								<input type="text" className="form-control" placeholder="Name" />
							</div>
						</div>

						<div className="form-row">
							<div className="col-12">
								<input type="email" className="form-control" placeholder="Email" />
							</div>
						</div>

							<div className="form-row">
								<div className="col-12">
									<input type="text" className="form-control" placeholder="Address" />
								</div>
							</div>

						  <div className="form-row">
						    <div className="col-7">
						      <input type="text" className="form-control" placeholder="City" />
						    </div>
						    <div className="col">
						      <input type="text" className="form-control" placeholder="State" />
						    </div>
						    <div className="col">
						      <input type="text" className="form-control" placeholder="Zip" />
						    </div>
						  </div>

						  <div className="form-row" style={{marginTop: '2em'}}>
						  	<div className="col-8">
								<input type="text" className="form-control" placeholder="Credit Card Number" />
							</div>

							<div className="col">
								<input type="text" className="form-control" placeholder="Expiration" />
							</div>

							<div className="col">
								<input type="text" className="form-control" placeholder="CVV" />
							</div>
						  </div>

						  <div className="row">
						  	<div className="col">
							<Cards
	  cvc={''}
	  expiry={''}
	  focused={false}
	  name={''}
	  number={'4242424242424242'}
	/>
							</div>
						  </div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</>;
}

function DefaultOutput(props) {
	return Page(props);
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
