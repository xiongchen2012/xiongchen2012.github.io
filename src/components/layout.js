import * as React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

const Layout = ({ location, title, children }) => {
    const rootPath = `${__PATH_PREFIX__}/`;
    const isRootPath = location.pathname === rootPath;
    let header;

    if (isRootPath) {
        header = (
            <div style={{ display: 'inline-flex' }}>
                <StaticImage
                    className='w-16 h-16 rounded-full mx-auto'
                    src='../images/profile-pic.jpg'
                    alt=''
                />
                <h3
                    className='main-heading'
                    style={{ display: 'inline-block', padding: 8 }}
                >
                    <Link to='/'>{title}</Link>
                </h3>
            </div>
        );
    } else {
        header = (
            <Link className='header-link-home' to='/'>
                {title}
            </Link>
        );
    }

    return (
        <div className='global-wrapper' data-is-root-path={isRootPath}>
            <header className='global-header'>{header}</header>
            <main>{children}</main>
        </div>
    );
};

export default Layout;
