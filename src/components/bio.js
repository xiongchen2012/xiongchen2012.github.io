/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

const Bio = () => {
    const data = useStaticQuery(graphql`
        query BioQuery {
            site {
                siteMetadata {
                    author {
                        name
                        summary
                    }
                    social {
                        twitter
                        github
                    }
                }
            }
        }
    `);

    // Set these values by editing "siteMetadata" in gatsby-config.js
    const author = data.site.siteMetadata?.author;
    const social = data.site.siteMetadata?.social;

    return (
        <div className='bio'>
            {author?.name && (
                <figure className='md:flex bg-gray-100 rounded-xl p-8 md:p-0'>
                    <div className='pt-6 md:p-8 text-center md:text-left space-y-4'>
                        <blockquote>
                            <p className='text-lg font-semibold'>
                                deathdealer的技术博客，好记性不如烂笔头，在这里记录下学习过程中值得记录的一切！
                            </p>
                        </blockquote>
                        <figcaption className='font-small'>
                            <div className='text-gray-500'>
                                <a
                                    href={`https://twitter.com/${
                                        social?.twitter || ``
                                    }`}
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    Twitter
                                </a>
                                <a
                                    style={{ paddingLeft: 6 }}
                                    href={`https://github.com/${
                                        social?.github || ``
                                    }`}
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    Github
                                </a>
                            </div>
                        </figcaption>
                    </div>
                </figure>
            )}
        </div>
    );
};

export default Bio;
