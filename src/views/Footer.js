import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class Topbar extends Component {
    
    render() {
            
        return (
                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-3 col-md-3">
                                <h3>About Tie-in </h3>
                                <ul className="list-unstyled fotr-menu">
                                    <li><Link to="/about-us"> About Us</Link></li>
                                    <li><Link to="/edit-profile"> Account</Link></li>
                                    <li><Link to="/contact-us"> Contact Us</Link></li>
                                    <li><Link to="/faqs"> FAqs</Link></li>
                                </ul>
                            </div>
                        <div className="col-sm-3 col-md-3">
                            <h3>Quick Links </h3>
                            <div className="fotr-media-item">
                                <ul className="list-unstyled fotr-menu">
                                    <li><Link to="/privacy-policy"> Privacy Policy</Link></li>
                                    <li><Link to="/privacy"> Privacy</Link></li>
                                    <li><Link to="/request-for-data-deletion"> Data Deletion</Link></li>
                                    <li><Link to="/manage-notification-timing"> Manage Notification</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-sm-3 col-md-3">
                            <h3>Activity </h3>
                            <div className="fotr-media-item">
                                <ul className="list-unstyled fotr-menu">
                                    <li><Link to="/profiles-you-visited">Profiles you visited</Link></li>
                                    <li><a href="#"> Time on App</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-sm-3 col-md-3">
                            <h3>Settings</h3>
                            <div className="fotr-media-item">
                                <ul className="list-unstyled fotr-menu">
                                    <li><Link to="/followers"> Follow and Invite Friends</Link></li>
                                    <li><a href="#"> Security</a></li>
                                    <li><Link to="wallet"> Payments or Wallet</Link></li>
                                    <li><Link to="/contact-us"> Help</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="cpyrgt-wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-3 col-md-3"><div className="list-inline hdr-social-link">
                                <ul className="list-inline">
                                    <li><a className="fb" href="#"><i className="fa fa-facebook"></i> </a> </li>
                                    <li><a className="tw" href="#"><i className="fa fa-twitter"></i> </a> </li>
                                    <li><a className="linkdn" href="#"><i className="fa fa-linkedin-square"></i> </a> </li>
                                    <li><a className="" href="#"><i className="fa fa-instagram"></i> </a> </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-sm-9 col-md-9"><p>Copyrights © 2021   Tie-In</p> <p> <span className="space"></span> Powered By : <a href="https://www.b2cinfosolutions.com/" target="_blank"> B2C Info Solutions</a></p>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
        )
    }
}