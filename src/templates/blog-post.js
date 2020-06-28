import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import { Helmet } from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage';


export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet,
  featuredimage
}) => {
  const PostContent = contentComponent || Content

  return (
    <div className="container">
      {helmet || ''}
      <div className="row">
	  	<div className="column">
			<Link href="/">Back</Link>
		</div>
	</div>

	<div className="row">
        <div className="column">
			<PreviewCompatibleImage
			  imageInfo={{
				image: featuredimage,
				alt: `featured image thumbnail for post ${title}`,
			  }}
			/>
		</div>
	</div>

	<div className="row">
		<div className="column col-md-8 offset-md-2">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            <p>{description}</p>
            <PostContent content={content} />
            {tags && tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                  {tags.map((tag) => (
                      <Link to={`/tags/${kebabCase(tag)}/`} className="badge badge-primary" style={{marginRight: '1rem'}}>{tag}</Link>
                  ))}
              </div>
            ) : null}
          </div>
      </div>
    </div>
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
		featuredimage={post.frontmatter.featuredimage}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
		featuredimage {
          childImageSharp {
            fluid(maxWidth: 1140, maxHeight: 400, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
