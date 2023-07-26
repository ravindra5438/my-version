import React, { Component } from 'react';
import Constant from './Constant';
import Axios from 'axios';
import $ from 'jquery';

export default class Contact extends Component {
    state = {
        name: '',
        mobile: '',
        email: '',
        message: ''
    }

    handleChange = (e) => {
       this.setState({ [e.target.id]: e.target.value });
    }

    /* API integration of save user contact details */

    saveUserContact = async (e) => {
        e.preventDefault();
        try {
            let requestData = {
                name: this.state.name,
                email: this.state.email,
                mobile: this.state.mobile,
                message: this.state.message
            }

            let getRes = await this.formValidation(requestData);
            if(getRes == false) {
                return false;
            }
            else {
                let response = await Axios.post(Constant.apiBasePath + 'user/storeContactDetails', requestData);
                let data = response.data;
                if(data.status == Constant.statusSuccess) {
                    $('.alert').removeClass('d-none');
                    $('.alert').addClass('alert-success');
                    $('#ErrorMessage').text(data.message);
                    setTimeout(() => window.location.reload(), 3000);
                }
                else {
                    $('.alert').removeClass('d-none');
                    $('.alert').addClass('alert-danger');
                    $('#ErrorMessage').text(data.message);
                    return false;
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    formValidation = async (requestData) => {
        if(requestData.name === ''){
            $('#nameError').show();
            $('#nameError').text('name is required');
            $('#nameError').css('color', 'red');
            return false;
        }
        else if(requestData.email === ''){
            $('#emailError').show();
            $('#emailError').text('email is required');
            $('#emailError').css('color', 'red');
            return false;
        }
        else if(requestData.mobile === ''){
            $('#mobileError').show();
            $('#mobileError').text('mobile is required');
            $('#mobileError').css('color', 'red');
            return false;
        }
        else if(requestData.message === ''){
            $('#messageError').show();
            $('#messageError').text('message is required');
            $('#messageError').css('color', 'red');
            return false;
        }
        else {
            return true;
        }
    }
    
    render() {
        return (
            <>
                <div className="col-sm-8 col-md-9 col-lg-9">
                    <div className="dashoard-box contactuspage">
                        <h4>Any query send us</h4>
                        <div className="row">
                        <div className="col-md-7">
                            <div className="alert d-none">
                                <span id="ErrorMessage"></span>
                            </div>
                            <form onSubmit={this.saveUserContact}>
                                <p id="gen-message"></p>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input type="text" id="name" onChange={this.handleChange} className="form-ctrl form-control" placeholder="Type Name"/>
                                            <p id="nameError"></p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-6">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" id="email" onChange={this.handleChange} className="form-ctrl form-control" placeholder="Type email id"/>
                                            <p id="emailError"></p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-6">
                                        <div className="form-group">
                                            <label>Mobile No.</label>
                                            <input type="number" id="mobile" onChange={this.handleChange} className="form-ctrl form-control" placeholder="Type Mobile No."/>
                                            <p id="mobileError"></p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea rows="6" id="message" onChange={this.handleChange} className="form-ctrl form-control"></textarea>
                                    <p id="messageError"></p>
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary btn-save">Submit</button>
                                </div> 
                            </form>
                        </div>
                        <div className="col-md-5">
                            <div className="contact-info">
                                <div className="contactusmailbox d-block d-sm-none">
                                    <img src="/images/icon-headset.png" />
                                    <div className="contactusmailboxtext">
                                        <strong>Call us</strong>
                                        <span><a href="#">+44 8749654785</a></span>
                                    </div>
                                </div>
                                <div className="contactusmailbox d-block d-sm-none">
                                <img src="/images/icon-feather-mail.png" />
                                    <div className="contactusmailboxtext">
                                        <strong>Mail us</strong>
                                        <span><a href="#">info@tie-in.com</a></span>
                                    </div>
                                </div>
                                
                                <div className="d-none d-sm-block">
                                    <h3>Tie-in</h3>
                                <h4><a href="#">info@tie-in.com</a></h4>
                                <h4><a href="">+44 8749654785</a></h4>
                
                                <div className="address-info">
                                    <h5>Address</h5>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                </div>
                                <div className="list-inline hdr-social-link">
                                    <h5>Follow Us</h5>
                                    <ul className="list-inline">
                                        <li><a className="fb" href="#"><i className="fa fa-facebook"></i> </a> </li>
                                        <li><a className="tw" href="#"><i className="fa fa-twitter"></i> </a> </li>
                                        <li><a className="linkdn" href="#"><i className="fa fa-linkedin-square"></i> </a> </li>
                                        <li><a className="" href="#"><i className="fa fa-instagram"></i> </a> </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </>
        )
    }
}