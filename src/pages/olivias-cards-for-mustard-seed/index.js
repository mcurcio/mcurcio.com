import React from 'react';
import { Helmet } from 'react-helmet';
import Img from "gatsby-image"
import _ from 'lodash'
import { graphql, Link } from 'gatsby'
//import { Router } from "@reach/router"

//import '../../../vendor/bootstrap/bootstrap.scss';
import './style.sass'

function getFile(name, files) {
	console.log('getFile', name, files);
	const node = files.edges.find(f => {
		console.log('comparing', name, f.node.name);
		const match = name === f.node.name;
		console.log('match', match);
		return match;
	}).node;
	console.log('file', name, node);
	return node;
}

const FONT = 'Raleway';

const CSS = ``;
/*
body {
	font-family: '${FONT}';
}

h1, h2, h3 {
	font-family: 'Amatic SC', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

h1 {
	text-align: center;
	font-size: 4em;
}

.row {
	margin-bottom: 2em;
}
`;
*/
function Header({params}) {
	console.log('Header params', params);
	const BASE_PATH = params.uri;
	console.log('BASE_PATH', BASE_PATH);

	return <div className="box-shadow sticky-top">
		<nav className="navbar navbar-expand-lg navbar-light bg-light nav-underline">
			<div className="container">
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						{[
							['Mustard Seed School', ''],
							['All Occasions 1', 'boxall1'],
							['All Occasions 2', 'boxall2'],
							['Holiday', 'boxholiday'],
							['Thanks & Blanks', 'boxthanks'],
							['Kids Birthday', 'boxkids']
						].map(l => {
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

function BoxDetails({count, title, image, description}) {
	return <div className="box-details">
		<div className="container">
			<div className="row text-center">
				<div className="col">
					<h2 className="box-title text-center">{title}</h2>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<p className="box-description">{description}</p>
				</div>
			</div>

			<div className="row" style={{paddingBottom: '1em'}}>
				<div className="col"><Img fluid={image.fluid} className="d-block w-100" alt={title} style={{marginLeft:'auto', marginRight: 'auto'}} /></div>
			</div>
		</div>
	</div>;
}

function Page(params) {
	console.log('Page', params);

	function getImage(name) {
		console.log('getImage', name, params.data);
		const node = getFile(name, params.data.files);
		console.log('getFluidImage', name, node);
		return node.image;
	}

	return <>
		<Helmet>
			<title>Olivias Cards for Mustard Seed School</title>
		</Helmet>

		<Header params={params} className='sticky-top' />

		<div className="container">
			<h1 style={{marginTop: '1em', marginBottom: '1em'}}>Olivias Cards for Mustard Seed</h1>

			<div className="row justify-content-center">
				<div className="col-8">
					<blockquote className="blockquote" style={{fontSize: '1em'}}>
						<p className="lead" style={{fontSize: '1em'}}>Do you know someone who needs a smile? Me too. With COVID cases on the rise, this seems like the perfect time to deliver a socially distant hug via a card!</p>

						<p className="lead" style={{fontSize: '1em'}}>For $31.50 you will receive 30 or more high quality hand-crafted cards in a beautiful storage box. Adorable AND functional AND to help children in our community? Yes please!</p>
					</blockquote>
				</div>
			</div>

			<div className="row">
				<div className="col-md-6">
					<h2>Mustard Seed School</h2>

					<p><Link href='http://www.sacloaves.org/programs/mustardseedschool'>Mustard Seed</Link> is a free, private school for children 3-15 years old which provides a safe, nurturing and structured environment, a positive learning experience, happy memories, survival resources of food, clothing and shelter referrals, medical and dental screenings, immunization updates, counseling for children and their parents, and assistance entering or reentering public schools.</p>

					<p>Mustard Seed School was established in 1989 to help meet the needs of homeless children. Many school age children do not attend school because of their homelessness; some lack immunizations, birth certificates, or other documents, some are in transit, and almost all lack a support system. In spite of their situations these children are eager to learn and to be accepted.</p>

					<p>Learn more about Mustard Seed School at the <Link href='http://www.sacloaves.org/programs/mustardseedschool'>Loaves and Fishes site</Link>, or visit their <Link href='http://a.co/hEnKC9i'>Amazon wish list</Link> for a list of items they need.</p>
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
		</div> {/*container*/}

		{[
			['92579501_2699594073596802_1619589243418443776_o', 'Kids Box', '30 Hand Crafted and Printed cards designed especially for kids'],
			['92696975_2699594150263461_3946356646103482368_o', 'All Occassion Box #1', '11 Birthday, 1 Belated Birthday, 4 Blank, 2 New 	Baby, 1 New Home, 1 Anniversary, 1 Good Luck, 3 Congratulations, 1 Engagement, 1 Wedding, 3 Sympathy, 1 Thank you'],
			['92818158_2699594126930130_5674995173591875584_o', 'All Occassion Box #2', '13 Birthday, 2 Blank, 1 New Baby, 2 New Home, 1 Anniversary, 2 Congratulations, 1	Engagement, 2 Get Well, 2 Thinking of you, 4 Thank you'],
			['92626572_2699594050263471_1142092865556447232_o', 'Holiday Box', '2 New Year’s , 4 Valentine’s Day, 2 St. Patrick’s Day, 4 Easter, 2 Mother’s Day, 2 Father’s Day, 2 July 4th, 2 Grandparent’s Day, 2 Halloween, 2 Thanksgiving, 2 Hanukkah, 24 Christmas & Holidays'],
			['98009957_2736816583207884_8606884993966276608_o', 'Thanks & Blanks', '15 Thanks, 15 Blanks']
		].map(([image, title, description], iteration) => {
			return <BoxDetails count={iteration} title={title} image={getImage(image)} description={description} />
		})}

		<div className="container">
			<div className="row">
				<div className="col">
					<p>$13 of each box sold will go towards meeting the needs of Mustard Seed classes.</p>

					<p>All you need to do is use the link below to select which box(es) you’d like to purchase. If you live locally, I will deliver your purchase to your door. Talk about full service! If you live further away, I can ship your cards without the decorative box.</p>
				</div>
			</div>
		</div>
	</>;
}

export default Page;

/*
export default ({data}) => {
	console.log('page data', data);

	const files = data.files.edges;

	const overviewImage = _.find(files, ['node.name', 'overview']).node.image.fluid;
	console.log('overviewImage', overviewImage);

	return <>
		<Helmet>
			<title>Olivias Cards for Mustard Seed School</title>

			<link href='https://fonts.googleapis.com/css?family=Amatic+SC' rel='stylesheet' type='text/css' />

			<style type="text/css">
				{CSS}
			</style>
		</Helmet>

		<div className="box-shadow">
			<nav className="navbar navbar-expand-lg navbar-light bg-light nav-underline">
				<div className="container">
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>

					<div class="collapse navbar-collapse" id="navbarNav">
						<ul class="navbar-nav">
							<li class="nav-item active">
								<Link href='#' className="nav-link">Mustard Seed School</Link>
							</li>

							{[
								'All Occasions 1',
								'All Occasions 2',
								'Holiday',
								'Thanks & Blanks',
								'Kids Birthday'
							].map(l => {
								return <li class="nav-item">
									<Link href='#' className="nav-link">{l}</Link>
								</li>;
							})}
						</ul>
					</div>
				</div>
			</nav>
		</div>

		<div className="container">
			<h1 style={{font: 'Amatic SC'}}>All Cards</h1>

			<Img fluid={overviewImage} />

		</div>
	</>;
}
*/
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
