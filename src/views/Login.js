import {Link} from "react-router-dom";
import React, {useContext, useState, useEffect} from "react";
import { loginUser, authGoogle, authFacebook } from "./utilities/Authentication";
import Context from "../Context";
import Constant, {statusFailure, statusSuccess} from "./Constant";
import {useHistory} from "react-router";
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

import Axios from "axios";
import $ from "jquery";
import FacebookLogin from "react-facebook-login";

import {getTokenDetails} from "./utilities/CommonFunction";
import { getCountries } from "./utilities/ApiCalls";


export default function Login() {
    const [formstate, setState] = useState({
        emailMobile: '',
        password: '',
        rememberMe: 0,
        countryCode: '91'
    });
    const history = useHistory();

    const [errorState, setErrorState] = useState(null);

    const {state, dispatch} = useContext(Context);
    const [showPassword, setShowPassword] = useState(false);
    const [allCountryCodes, setAllCountryCodes] = useState([]);


    function showHidePassword (e) {
        e.preventDefault()
        setShowPassword(!showPassword)
    }


    // handele change
    function handleChange(e) {
        if(e.target.name === 'rememberMe') {
            setState({
                ...formstate,
                [e.target.name]: parseInt(e.target.value)
            })
        }
        else {
            setState({
                ...formstate,
                [e.target.name]: e.target.value
            })
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        loginUser(formstate).then((response) => {
            console.log('Login Check',response)
            if (response.status == statusSuccess) {
                dispatch({type: 'login', payload: response.data.token});
                history.push('/');
            } else {
                setErrorState(response.message)
            }
        })
    }

    const responseGoogle =  (response) => {
        console.log('Google login ', response);
        let tokenId = response.credential;
        let metaData = { 'token': tokenId };
        authGoogle(metaData).then((response) => {
            console.log('Google Check', response);
            if (response.status !== statusFailure) {
                if(response.message === 'User already exist') {
                    dispatch({type: 'login', payload: response.data.token});
                    history.push('/');
                }
                else{
                    dispatch({type: 'login', payload: response.data.token});
                    history.push('/update-profile');
                }
            } else {
                // setErrorState(response.message)
            }
        })
    }

    const responseFacebook = (response) => {
        console.log('Facebook login ', response);
        let { name, email, mobile, picture, accessToken } = response;
        let metaData = { 'name': name, 'email': (email) ? email : '', 'mobile': (mobile) ? mobile : '', 'picture': (picture) ? picture : '', 'token': accessToken };
        authFacebook(metaData).then((response) => {
            console.log('Facebook Check', response);
            if (response.status !== statusFailure) {
                if(response.message === 'User already exist') {
                    dispatch({type: 'login', payload: response.data.token});
                    history.push('/');
                }
                else{
                    dispatch({type: 'login', payload: response.data.token});
                    history.push('/update-profile');
                }
            } else {
                // setErrorState(response.message)
            }
        })
    }

    useEffect(() => {
        getCountries().then(response => {
            if (response.status === Constant.statusSuccess) {
                setAllCountryCodes(response.data);
            } 
            else {
                setErrorState(response.message);
            }
        });
    }, []);

    let countryCodeOptions = [];
    if(allCountryCodes.length > 0) {
        countryCodeOptions = allCountryCodes.map((item, index) => {
            return <option key={index} value={item.phonecode}>{item.phonecode}</option>
        });
    }

    return <>
        <section className="login_page">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 order_2">
                    <Link className="login-logo" to={'/'}>
                        <img src="/images/logo.png" alt="logo"/>
                    </Link>
                        <div className="left_content">
                        <h2>Bring <span className="text-red">Stories</span> to <div className="text-red sliderCurveText">Life</div></h2>
                            <p>Start for free and get attractive contests from the community</p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 p-0 order_1">
                        <div className="login_page_content">
                            <h1><img src="/images/story.png" alt=""/> <span>Story telling</span></h1>
                            <h2>Welcome back</h2>
                            <p>Welcome back! Please enter your details.</p>
                            
                            <div className="login_button">
                                <div className="">
                                    <GoogleOAuthProvider 
                                        clientId="451080537233-a0gdg7j86p0valvd0vbs161ebeqgq0lt.apps.googleusercontent.com"
                                        >
                                    <GoogleLogin
                                    render={(renderProps) => (
                                        <button
                                        type="button"
                                        className=""
                                        onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}
                                        >
                                        <FcGoogle className="" /> Sign in with google
                                        </button>
                                    )}
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                    cookiePolicy="single_host_origin"
                                    />
                                    </GoogleOAuthProvider>
                                </div>

                                <FacebookLogin
                                    appId="141808665260060"
                                    callback={responseFacebook}
                                    render={renderProps => (
                                        <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn"><img src="/images/google.png" alt=""/> Log in with Google</button>
                                    )}
                                />

                            </div>
                            <div className="or text-center">
                                <h2>or</h2>

                                {errorState ? <p className={'text-danger error-msg-text'}> {errorState}</p> : ''}
                            </div>
                            <div className="form">
                                <form onSubmit={handleSubmit} onChange={handleChange}  >
                                    <div className="row">
                                        <div className="f_class">
                                            <div className="col-lg-2 col-md-2 col-2 p-0">
                                                <div className="countory_code">
                                                    <select name="countryCode" value={formstate.countryCode}>
                                                        { countryCodeOptions }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-10 col-md-10 col-10 p-0">
                                                <input type="text"
                                                       className="border_none form-control"
                                                       placeholder="Mobile Number" name="emailMobile" value={formstate.emailMobile}/>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <input type={showPassword ? 'text' : 'password'} name="password" id="myInput"
                                                   className="form-control"
                                                   placeholder="Password" value={formstate.password}  />
                                            <button className="password_show" type="button" onClick={showHidePassword} >
                                                <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} aria-hidden="true"></i></button>
                                        </div>
                                    </div>
                                    <div className="checkbox">
                                        <input type="checkbox" name="rememberMe" className="form-check-input"
                                               id="exampleCheck1" value="0"/>
                                        <label className="form-check-label" htmlFor="exampleCheck1">Remember
                                            me</label> <Link to="/forgot">Forgot Password</Link>
                                    </div>

                                    <div className="login_btn text-center ">
                                        <button type="submit" className="btn">Log in</button>
                                        <p className="mt-1">Don’t have an account? <Link to="/register"> Sign up for
                                            free</Link></p>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </>

}