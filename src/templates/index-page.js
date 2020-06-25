import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'

import Layout from '../components/Layout'
import Features from '../components/Features'
import BlogRoll from '../components/BlogRoll'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage';

//import '../../styles/style.scss'

function PostDeckCard({post}) {
	console.log('PostDeckCard', post);

	return <div>
    {/*}<img className="card-img-top" src="..." alt="Card image cap" />*/}
	<PreviewCompatibleImage
	  imageInfo={{
		image: post.frontmatter.featuredimage,
		alt: `featured image thumbnail for post ${post.frontmatter.title}`,
	  }}
	/>
    <div className="card-body">
	<small className="text-muted">{post.frontmatter.date}</small>

      <h5 className="card-title">{post.frontmatter.title}</h5>

      <p className="card-text">{post.frontmatter.description}</p>
	  <Link href={post.fields.slug}>Continue reading</Link>
    </div>

  </div>
}

function PostDeck({posts}) {
	console.log('PostDeck', posts);

	return <div className="row">
		{posts.map(post => <div className="col-4 align-items-stretch">
			<PostDeckCard post={post.node} />
		</div>)}
	</div>;
}

function PostCategory({name, posts}) {
	console.log('PostCategory', name, posts);

	return <>
		<div className="row">
			<div className="col">
				<h2>#{name}</h2>
			</div>
		</div>

		<PostDeck posts={posts.edges} />
	</>;
}

export const IndexPageTemplate = ({
  image,
  title,
  heading,
  subheading,
  mainpitch,
  description,
  intro,
  posts
}) => (<>
	<section id="hero" className="jumbotron">
		<h1 className="title">
			Hi, my name is <span className="text-color-primary">Matt</span>
			<br />
			and I like to automate <em>everything</em>
		</h1>
	</section>

	<nav className="navbar sticky-top navbar-expand-lg bg-dark navbar-dark">
	{/*}<a class="navbar-brand" href="#">Navbar w/ text</a>*/}
		<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
			<span className="navbar-toggler-icon"></span>
		</button>
		<div className="collapse navbar-collapse" id="navbarText">
			<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
				<li className="nav-item active">
					<a className="nav-link" href="#home-automation">#Home Automation <span className="sr-only">(current)</span></a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#engineering">#Software Engineering</a>
				</li>
			</ul>
		</div>
	</nav>

	{/*console.log('entries', Object.entries(posts))*/}

	<div className="container">
		{Object.entries(posts).map(([key, value]) => {
			console.log('loop', key, value);
			return <div className="row" style={{marginTop: '2rem', marginBottom: '2rem'}}>
				<div className="col">
					<PostCategory key={key} name={key} posts={value} />
				</div>
			</div>;
		})}
	</div>
</>)

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  mainpitch: PropTypes.object,
  description: PropTypes.string,
  intro: PropTypes.shape({
    blurbs: PropTypes.array,
  }),
}

const IndexPage = ({ data }) => {
	console.log('IndexPage', data);

  const { frontmatter } = data.index;
  const recentPosts = data.recent_posts;
  const homeAutomation = data.home_automation;

  console.log('home automation', homeAutomation);

  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        mainpitch={frontmatter.mainpitch}
        description={frontmatter.description}
        intro={frontmatter.intro}
		posts={{
			'Recent Posts': recentPosts,
			'Home Automation': homeAutomation
		}}
      />
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default IndexPage

export const pageQuery = graphql`
fragment Posts on MarkdownRemarkConnection {
  edges {
    node {
      excerpt(pruneLength: 400)
      id
      fields {
        slug
      }
      frontmatter {
        title
        templateKey
        date(formatString: "MMMM DD, YYYY")
		tags
        description
        featuredpost
        featuredimage {
          childImageSharp {
            fluid(maxWidth: 400, maxHeight: 300, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
}

  query IndexPageTemplate {
    index: markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
      }
    }

	recent_posts: allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}, limit: 3, filter: {fields: {type: {eq: "post"}}, frontmatter: {draft: {ne: true}}}) {
    ...Posts
  }

	home_automation: allMarkdownRemark(
		sort: { order: DESC, fields: [frontmatter___date] }
		limit: 3
		filter: { fields: { type: { eq: "post" } }, frontmatter: {tags: {in: "home automation"}} }
	  ) {
		...Posts
	  }

  }
`
