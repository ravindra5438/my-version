import React, { Component } from 'react';
import Axios from 'axios';
import Constant from './Constant';
import Layout from "../Layout/Layout";

export default class PrivacyPolicy extends Component {
    state = {
        PrivacyPolicy: {},
        ERROR: false
    }

    /* API integration for get privacy policy data */

    getPrivacyPolicyData = () => {
        try {
            Axios.post(Constant.apiBasePath + 'searchChildCMSByTitle', { 'title': 'privacy policy'}).then(response => {
                const {data} = response;
                if (data.status === Constant.statusSuccess) {
                    this.setState({ PrivacyPolicy: data.data, ERROR: false });
                }
                else {
                    this.setState({ PrivacyPolicy: '', ERROR: false });
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
        this.getPrivacyPolicyData();
    }
    
    render() {
        const { PrivacyPolicy } = this.state;
            
        return (
            <Layout>
                <section className="about_section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                                <div className="heading_title mt-30">
                                    <h1>Privacy & Policy</h1>
                                </div>
                                <hr/>
                                <div className="about_info">
                                    <p>{PrivacyPolicy.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>   
        )
    }
}
