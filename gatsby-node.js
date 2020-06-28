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
				draft
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
	  if (!edge.node.frontmatter.draft) {
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
		});
	}
    })

    // Tag pages:
    let tags = []
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach((edge) => {
		console.log('tags', edge.node.frontmatter);
		if (!edge.node.frontmatter.draft) {
      if (_.get(edge, `node.frontmatter.tags`)) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
  }
    })
    // Eliminate duplicate tags
    tags = _.uniq(tags)
	console.log('all tags', tags);

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
		const PREFIX = '/posts/';

		console.log('computing slug from', slug);
		const dateString = slug.slice(PREFIX.length+0, PREFIX.length+10);
		const title = slug.slice(PREFIX.length+11);
		console.log('dateString', dateString);
		console.log('title', title);

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
