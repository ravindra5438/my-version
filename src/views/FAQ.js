import Layout from "../Layout/Layout";
import React, { Component } from 'react';
import Axios from 'axios';
import Constant from '../views/Constant';

export default class Feedback extends Component {
    state = {
        FAQs: [],
        ERROR: true
    }

    /* API integration for get question answer data */

    getFAQs = () => {
        try {
            Axios.post(Constant.apiBasePath + 'question-answer').then(response => {
                const {data} = response;
                if (data.status === Constant.statusSuccess) {
                    this.setState({ FAQs: data.data, ERROR: false });
                }
                else {
                    this.setState({ FAQs: [], ERROR: false });
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
        this.getFAQs();
    }
    
    render() {
        const { FAQs } = this.state;
        let FAQsList = '';
        if(FAQs.length > 0) {
            FAQsList = FAQs.map(el => {
                let dataTarget = "#collapse" + el._id;
                let collapseId = "collapse" + el._id;

                return  <div className="accordion-item">
                        <h2 className="accordion-header" id="1">
                        <button className="accordion-button" type="button" data-toggle="collapse" data-target={dataTarget} aria-expanded="false" aria-controls={collapseId}>
                        {el.question}
                        </button>
                        </h2>
                        <div id={collapseId} className="accordion-collapse collapse" aria-labelledby="1" data-parent="#accordionExample">
                        <div className="accordion-body">
                            <p>{el.answer}</p>
                        </div>
                        </div>
                    </div>
            })
        }        
   
        return (
                
                <Layout>
                    <section className="inrpage-faq">
                <div className="container">
                    
                    <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className="heading_title mt-30">
                        <h1>Faq's</h1>
                    </div>
                            <hr/>
                            <div className="faq-panel">
                                
                                <div className="accordion" id="accordionExample">
                                {FAQsList}
                            </div>
                        </div>
                    </div>
                    </div>
                    </section>
                </Layout>
                
        )
    }
}