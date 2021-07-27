import * as React from "react"
import { Link, graphql } from "gatsby"
import {ThemeProvider} from "styled-components";

import  {useDarkMode} from "../styles/useDarkMode";
import { GlobalStyles, lightTheme, darkTheme } from "../styles/globalStyles";
import Toggle from "../components/toggle";
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  const [theme, toggleTheme, mountedComponent] = useDarkMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;
  
  if(!mountedComponent) return <div/>

  if (posts.length === 0) {
    return (
        <Layout location={location} title={siteTitle}>
            <SEO title="所有的博客" />
            <p>Deathdealer暂时隐藏了所有的文档</p>
        </Layout>
    );
  }

  return (
    <ThemeProvider theme={themeMode}>
      <GlobalStyles/>
      <Layout location={location} title={siteTitle}>
          <SEO title="所有的博客" />
          <Bio /><Toggle theme={theme} toggleTheme={toggleTheme} />
          <ol style={{ listStyle: `none` }}>
              {posts.map((post) => {
                  const title = post.frontmatter.title || post.fields.slug;

                  return (
                      <li key={post.fields.slug}>
                          <article
                              className="post-list-item"
                              itemScope
                              itemType="http://schema.org/Article"
                          >
                              <header>
                                  <h2>
                                      <Link
                                          to={post.fields.slug}
                                          itemProp="url"
                                      >
                                          <span itemProp="headline">
                                              {title}
                                          </span>
                                      </Link>
                                  </h2>
                                  <small>{post.frontmatter.date}</small>
                              </header>
                              <section>
                                  <p
                                      dangerouslySetInnerHTML={{
                                          __html:
                                              post.frontmatter.description ||
                                              post.excerpt,
                                      }}
                                      itemProp="description"
                                  />
                              </section>
                          </article>
                      </li>
                  );
              })}
          </ol>
      </Layout>
    </ThemeProvider>
  );
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY/MM/DD HH:mm:ss")
          title
          description
        }
      }
    }
  }
`
