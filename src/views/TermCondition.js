import React, { Component } from 'react';
import Axios from 'axios';
import Constant from './Constant';
import { Link } from 'react-router-dom';
import Layout from "../Layout/Layout";

export default class TermCondition extends Component {
    state = {
        TermCondition: {},
        ERROR: false
    }

    /* API integration for get term condition data */

    getTermConditionData = () => {
        try {
            Axios.post(Constant.apiBasePath + 'searchChildCMSByTitle', { 'title': 'terms & conditions'}).then(response => {
                const {data} = response;
                if (data.status === Constant.statusSuccess) {
                    this.setState({ TermCondition: data.data, ERROR: false });
                }
                else {
                    this.setState({ TermCondition: '', ERROR: false });
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
        this.getTermConditionData();
    }
    
    render() {
        const { TermCondition } = this.state;
            
        return (
            <Layout>
                <section className="about_section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                                <div className="heading_title mt-30">
                                    <h1>Term & Condition</h1>
                                </div>
                                <hr/>
                                <div className="about_info">
                                    <p>{TermCondition.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>   
           
        )
    }
}
