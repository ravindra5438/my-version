import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class PageNotFound extends Component {
    
    render() {
       
        return (
            <div className="col-sm-6 col-md-5 col-lg-5 error-page">
                <div className="white-box">
                    <img src="images/404.png" className='img-class'/>
                    <h4 className="text-center">Page not found</h4>
                </div>
            </div>      
        )
    }
}