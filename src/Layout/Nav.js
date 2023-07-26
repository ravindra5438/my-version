import { Link } from 'react-router-dom';
import React from "react";
import {useLocation} from "react-router";


export default function Nav() {
    const location = useLocation();

    return (
        <div className="navbar-area">
            <div className="mobile-nav">
                <Link className="navbar-brand" to={'/'}>
                    <img src="/images/logo.png" alt="logo"/>
                </Link>
            </div>
            <div className="main-nav">
                <div className="container">
                    <nav className="navbar navbar-expand-md navbar-light">
                        <Link className="navbar-brand" to={'/'}>
                            <img src="/images/logo.png" alt="logo"/>
                        </Link>
                        <div className="collapse navbar-collapse mean-menu" id="navbarSupportedContent">
                            <ul className="navbar-nav">
                                <li className="nav-item"><Link to={'/'} className={location.pathname == '/' ? 'nav-link active' : 'nav-link' }>Home</Link></li>
                                <li className="nav-item"><Link to={'/stories'} className={location.pathname == '/stories' ? 'nav-link active' : 'nav-link' }>Stories</Link></li>
                                <li className="nav-item"><Link to={'/poems'} className={location.pathname == '/poems' ? 'nav-link active' : 'nav-link' }>Poems</Link></li>
                                <li className="nav-item"><Link to="#" className={location.pathname == '/audios' ? 'nav-link active' : 'nav-link' }>Audios</Link></li>
                                <li className="nav-item"><Link to="#" className={location.pathname == '/videos' ? 'nav-link active' : 'nav-link' }>Videos</Link></li>
                                {/* <li className="nav-item"><Link to="#" className={location.pathname == '/movies' ? 'nav-link active' : 'nav-link' }>Movies</Link></li> */}
                                <li className="nav-item"><Link to={`/plans`} className={location.pathname == '/plans' ? 'nav-link active' : 'nav-link' }>Membership Plans</Link></li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
                                        More <span className='icofont-rounded-down'></span>
                                    </a>
                                    <div className="dropdown-menu">
                                    <Link className="dropdown-item"  to={'/about-us'}>About Us</Link>
                                    {/* <Link className="dropdown-item"  to={'/who-we-are'}>Who we are</Link> */}
                                    <Link className="dropdown-item"  to={'/what-we-do'}>What we do</Link>
                                    <Link className="dropdown-item"  to={'/our-partner'}>Our Partner</Link>
                                    <Link className="dropdown-item"  to={'/our-vision'}>Our Vision & Mission</Link>
                                    </div>
                                </li>
                            </ul>
                            <div className="user_icon">
                                <a data-toggle="modal" data-target="#search-modal" href="#"><i
                                    className="icofont-search"></i> </a>
                                <div className="user">
                                    <Link to={'/login'} className=" btn bg_l_blue" >Login</Link>
                                    <Link to={'/register'} className=" btn bg_l_blue ml-2" >Register</Link>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}