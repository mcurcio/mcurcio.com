const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

const POSTS_DIR = path.join(__dirname, 'src', 'pages', 'posts');

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((edge) => {
      const id = edge.node.id
	  console.log('*'.repeat(40) + ' page', edge.node.fields.slug)
      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey || 'blog-post')}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
		  slug: edge.node.fields.slug
        },
      })
    })

    // Tag pages:
    let tags = []
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach((edge) => {
      if (_.get(edge, `node.frontmatter.tags`)) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
    })
    // Eliminate duplicate tags
    tags = _.uniq(tags)

    // Make tag pages
    tags.forEach((tag) => {
      const tagPath = `/tags/${_.kebabCase(tag)}/`

      createPage({
        path: tagPath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
	  //console.log('node', node);

    let slug = createFilePath({ node, getNode, trailingSlash: false })

	if (node.fileAbsolutePath.startsWith(POSTS_DIR)) {
		const dateString = slug.slice(1, 11);
		const title = slug.slice(12);

		slug = `/${dateString.slice(0, 4)}/${dateString.slice(5, 7)}/${title}`;

		//const date = Date.parse(node.frontmatter.date);

		createNodeField({
			name: 'type',
			node,
			value: 'post'
		});
	}

	console.log('*'.repeat(40) + ' slug: ' + slug);
    createNodeField({
      name: `slug`,
      node,
      value: slug
    })
  }
}
