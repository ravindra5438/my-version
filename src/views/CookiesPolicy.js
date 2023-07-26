import React, { Component } from 'react';
import Axios from 'axios';
import Constant from './Constant';
import { Link } from 'react-router-dom';
import Layout from "../Layout/Layout";

export default class CookiePolicy extends Component {
    state = {
        CookiePolicy: {},
        ERROR: false
    }

    /* API integration for get term condition data */

    getCookiePolicyData = () => {
        try {
            Axios.post(Constant.apiBasePath + 'searchChildCMSByTitle', { 'title': 'cookie & policy'}).then(response => {
                const {data} = response;
                if (data.status === Constant.statusSuccess) {
                    this.setState({ CookiePolicy: data.data, ERROR: false });
                }
                else {
                    this.setState({ CookiePolicy: {}, ERROR: false });
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        catch(error) {
            console.log(error);
        }
    }
   

    componentDidMount() {
        this.getCookiePolicyData();
    }
    
    render() {
        const { CookiePolicy } = this.state;
            
        return (
            <Layout>
                <section className="about_section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                                <div className="heading_title mt-30">
                                    <h1>Cookie Policy</h1>
                                </div>
                                <hr/>
                                <div className="about_info">
                                    <p>{CookiePolicy.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>   
           
        )
    }
}
