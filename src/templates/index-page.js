import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'

import Layout from '../components/Layout'
import Features from '../components/Features'
import BlogRoll from '../components/BlogRoll'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

import _ from 'lodash';

//import '../../styles/style.scss'

function PostDeckCard({post}) {
	console.log('PostDeckCard', post);

	return <div className={`card ${post.frontmatter.featuredpost?'featuredpost':''}`}>
    {/*}<img className="card-img-top" src="..." alt="Card image cap" />*/}
	<Link to={post.fields.slug}>
		<PreviewCompatibleImage
		  imageInfo={{
			image: post.frontmatter.featuredimage,
			alt: `featured image thumbnail for post ${post.frontmatter.title}`,
		  }}
		/>
	</Link>

    <div className="card-body">
	<small className="text-muted">{post.frontmatter.date}</small>

      <h5 className="card-title"><Link href={post.fields.slug} style={{color:'inherit'}}>{post.frontmatter.title}</Link></h5>

      <p className="card-text">{post.frontmatter.description}</p>
	  <Link to={post.fields.slug}>Continue reading</Link>
    </div>

  </div>
}

function PostDeck({posts}) {
	console.log('PostDeck', posts);

	return <div className="row postdeck">
		{posts.map(post => <div className="col-12 col-md-4 align-items-stretch">
			<PostDeckCard post={post.node} />
		</div>)}
	</div>;
}

function Hero() {
	return <section id="hero" className="jumbotron">
		<h1 className="title" style={{width: '100%', marginBottom: 0}}>
			Hi, my name is <span className="text-color-primary">Matt</span>
			<br />
			and I like to automate <em>everything</em>

			<div style={{position: 'relative', fontSize: '1em'}}>
				<FontAwesomeIcon icon={faArrowDown} class="hero-arrow" style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					margin: '0 auto',
				}} />
			</div>
		</h1>
	</section>;
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

	{/*console.log('entries', Object.entries(posts))*/}

	<div className="container py-5">
		<div className="row">
			<div className="col">
				<h2>Recent Posts</h2>
			</div>
		</div>

		{_.chunk(posts.edges, 3).map((chunk, index) => {
			console.log('chunk', chunk, index);
			return <PostDeck key={index} posts={chunk} />;
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

  return (
    <Layout hero=<Hero />>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        mainpitch={frontmatter.mainpitch}
        description={frontmatter.description}
        intro={frontmatter.intro}
		posts={data.recent_posts}

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

	recent_posts: allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}, limit: 9, filter: {fields: {type: {eq: "post"}}, frontmatter: {draft: {ne: true}}}) {
    ...Posts
}
  }
`
