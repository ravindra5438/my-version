import {Link} from "react-router-dom";
import {useContext, useState, useEffect} from "react";
import axios from "axios";
import Constant, {statusFailure, userExist} from "./Constant";
import $ from 'jquery';
import { firebase, auth } from './Firebase';
import {useHistory} from "react-router";
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from "react-facebook-login";
import Context from "../Context";
import { sendOtpApi, authGoogle, authFacebook } from "./utilities/Authentication";
import { getCountries } from "./utilities/ApiCalls";


export default function Register() {
    // Inputs

	const [mobile, setMobile] = useState("");
	const [otp1, setOtp1] = useState("");
	const [otp2, setOtp2] = useState("");
	const [otp3, setOtp3] = useState("");
	const [otp4, setOtp4] = useState("");
	const [otp5, setOtp5] = useState("");
	const [otp6, setOtp6] = useState("");
    
	const [final, setfinal] = useState('');
    const [countryCode, setCountryCode] = useState("91");

    const history = useHistory();
    const {state, dispatch} = useContext(Context);
    const [step, setStep] = useState(1);
    const [errorState, setErrorState] = useState(null);
    const [successState, setSuccessState] = useState(null);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [allCountryCodes, setAllCountryCodes] = useState([]);
    const [token, setToken] = useState('');
    const [countryAPICall, setCountryAPICall] = useState(true);
    
   // Sent OTP
	const signin = () => {
        const mobileNumber = '+' + countryCode + mobile;
        if (mobileNumber === "" || mobileNumber.length < 10) return;

        sendOtpApi({ 'mobile': mobile, 'countryCode': countryCode }).then(response => {
            if (response.status !== statusFailure && response.data != '') {
                let verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
                auth.signInWithPhoneNumber(mobileNumber, verify).then((result) => {
                    setfinal(result);
                    // alert("code sent")
                    setTimeout(function() {
                        setSuccessState('OTP send successfully.');
                    }, 3000);
                    setToken(response.data);
                    setStep(2)
                    setMinutes(0)
                    setSeconds(30)
                    // setshow(true);
                })
                .catch((err) => {
                    // alert(err);
                    // window.location.reload()
                    setTimeout(function() {
                        setErrorState('Invalid format.');
                        window.location.reload()
                    }, 3000);
                });
            } else {
                setErrorState(response.message)
            }
        });
	}

    const resendOTP = () => {
        let mobileNumber = '+' + countryCode + mobile;
        let verify = new firebase.auth.RecaptchaVerifier('recaptcha-container-resend');
        auth.signInWithPhoneNumber(mobileNumber, verify).then((result) => {
            setfinal(result);
            // alert("code sent")
            setTimeout(function() {
                setSuccessState('OTP send successfully.');
            }, 3000);
            setStep(2)
            setMinutes(0)
            setSeconds(30)
            // setshow(true);
        })
        .catch((err) => {
            // alert(err);
            // window.location.reload()
            setTimeout(function() {
                setErrorState('Invalid format.');
                window.location.reload()
            }, 3000);
        });
    }

	// Validate OTP
	const ValidateOtp = () => {
        const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
        if (otp === null || final === null)
			return;
		final.confirm(otp).then((result) => {
			// success
            let metaData = {
                'otp': otp,
                'token': token
            }
            axios.post(Constant.apiBasePath + 'firebaseSignIn', metaData).then(response => {
                let { data } = response;
                if (data.status !== statusFailure && userExist != data.message) {
                    dispatch({type: 'login', payload: data.data});
                    setSuccessState(data.message);
                    setTimeout(function() {
                        // history.push('/update-profile');
                        window.location.href = '/update-profile';
                    }, 3000);
                } else {
                    setErrorState(data.message)
                }
            }).catch((error) => {
                // console.log(error);
                setErrorState(error)
            });

		}).catch((err) => {
			// alert("Wrong code");
            setErrorState('Invalid otp')
		})
	}

    useEffect(() => {
        if(countryAPICall) {
            getCountries().then(response => {
                if (response.status === Constant.statusSuccess) {
                    setAllCountryCodes(response.data);
                } 
                else {
                    setErrorState(response.message);
                }
            });
        }
        setCountryAPICall(false);

        const interval = setInterval(() => {
            if (seconds > 0 && step === 2) {
                setSeconds(seconds - 1);
            }

            if (seconds === 0 && step === 2) {
                if (minutes === 0) {
                    clearInterval(interval);
                    window.location.reload();
                } else {
                    setSeconds(59);
                    setMinutes(minutes - 1);
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };

    }, [seconds]);


    // Social signup

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


    /* End */
    
    function backToStep(e) {
        e.preventDefault();
        setStep(e.target.getAttribute('step'));
        // setMinutes(0)
        // setSeconds(0)
    }

    /* Focus on next input field after enter otp */

    $(document).ready(function(){
        $("#otp1").keyup(function(){
            if(this.value.length === parseInt(this.attributes["maxLength"].value)) {
               $("#otp2").focus();
            }
            else {
                $("#otp1").focus();
            }
        });

        $("#otp2").keyup(function(){
            if(this.value.length === parseInt(this.attributes["maxLength"].value)) {
               $("#otp3").focus();
            }
            else {
                $("#otp1").focus();
            }
        });

        $("#otp3").keyup(function(){
            if(this.value.length === parseInt(this.attributes["maxLength"].value)) {
               $("#otp4").focus();
            }
            else {
                $("#otp2").focus();
            }
        });

        $("#otp4").keyup(function(){
            if(this.value.length === parseInt(this.attributes["maxLength"].value)) {
               $("#otp5").focus();
            }
            else {
                $("#otp3").focus();
            }
        });

        $("#otp5").keyup(function(){
            if(this.value.length === parseInt(this.attributes["maxLength"].value)) {
               $("#otp6").focus();
            }
            else {
                $("#otp4").focus();
            }
        });

        $("#otp6").keyup(function(){
            if(this.value.length !== parseInt(this.attributes["maxLength"].value)) {
                $("#otp5").focus();
            }
        });
    });

    /* End */

    let countryCodeOptions = [];
    if(allCountryCodes.length > 0) {
        countryCodeOptions = allCountryCodes.map((item, index) => {
            return <option key={index} value={item.phonecode}>{item.phonecode}</option>
        });
    }

    return (<>
            {step == 1 ?
                <section className="login_page">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-12 order_2">
                                <div className="left_content">
                                    <h2>Bring <span className="text-red">Stories</span> to <div className="text-red sliderCurveText">Life</div></h2>
                                    <p>Start for free and get attractive contests from the community</p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12 p-0 order_1">
                                <div className="login_page_content">
                                    <h1><img src="images/story.png" alt=""/> <span>Story telling</span></h1>
                                    <h2>Create new Account </h2>
                                    <p>To register Please enter your details.</p>

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
                                                <FcGoogle className="" /> Sign up with google
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
                                                <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn"><img src="/images/google.png" alt=""/> Sign up with Meta</button>
                                            )}
                                        />
                                    </div>

                                    <div className="or text-center">
                                        <h2>or</h2>
                                    </div>
                                    <div className="form">
                                        <div className="row">
                                            <div className="f_class">
                                                <div className="col-lg-3 col-md-6 col-3 p-0">
                                                    <div className="countory_code">
                                                        <select value={countryCode} name="countryCode" onChange={ (e)=> { setCountryCode(e.target.value)}}>
                                                            { countryCodeOptions }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-9 col-md-6 col-9 p-0">
                                                    <input type="text" name="mobile"
                                                            className="border_none form-control"
                                                            placeholder="Mobile Number" value={mobile} onChange={(e)=>{ setMobile(e.target.value)}}/>
                                                    {errorState ?
                                                        <div className="text-danger error-msg-text">{errorState}</div> : ''}
                                                </div>

                                            </div>
					                        <div id="recaptcha-container"></div>
                                        </div>
                                        <div className="login_btn text-center mt-50 ">
                                            <button type="submit" className="btn" onClick={signin}> Create an
                                                account
                                            </button>
                                            <p className="mt-1">Already have an account? <Link
                                                to="/login">Login</Link></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                :
                <section className="login_page">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-12 order_2">
                                <div className="left_content">
                                    <h2>Bring <span className="text-red">Stories</span> to <div className="text-red sliderCurveText">Life</div></h2>
                                    <p>Start for free and get attractive contests from the community</p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-12 p-0 order_1">
                                <div className="login_page_content pt-110">
                                    <h2>Enter OTP and Verify </h2>
                                    <p>Please enter your one time password.</p>
                                    <div className="form">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-12 col-md-12 col-12">
                                                <div className="top_box">
                                                    <input type="number" name="otp1" id="otp1" maxLength={1}
                                                            value={otp1} className="form-control otp_input"
                                                            placeholder="" onChange={(e)=>{ setOtp1(e.target.value)}}/>
                                                    <input type="number" name="otp2" id="otp2" maxLength={1}
                                                            value={otp2} className="form-control otp_input"
                                                            placeholder="" onChange={(e)=>{ setOtp2(e.target.value) }}/>
                                                    <input type="number" name="otp3" id="otp3" maxLength={1}
                                                            value={otp3} className="form-control otp_input"
                                                            placeholder="" onChange={(e)=>{ setOtp3(e.target.value) }}/>
                                                    <input type="text" name="otp4" id="otp4" value={otp4}
                                                            maxLength={1} className="form-control otp_input"
                                                            placeholder="" onChange={(e)=>{ setOtp4(e.target.value) }}/>
                                                    <input type="number" name="otp5" id="otp5" maxLength={1}
                                                            value={otp5} className="form-control otp_input"
                                                            placeholder="" onChange={(e)=>{ setOtp5(e.target.value) }}/>
                                                    <input type="text" name="otp6" id="otp6" value={otp6}
                                                            maxLength={1} className="form-control otp_input"
                                                            placeholder="" onChange={(e)=>{ setOtp6(e.target.value) }}/>
                                                </div>
                                                {/* <div className="number_resent">
					                                <div id="recaptcha-container-resend"></div>
                                                    <a href="#" onClick={backToStep} step="1">Change number</a>

                                                    {seconds > 0 || minutes > 0 ? (
                                                        <span>
                                                            Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}: {seconds < 10 ? `0${seconds}` : seconds}
                                                        </span>
                                                    ) : (
                                                        <span onClick={resendOTP} step="1" className="default-cursor-point">Resend</span>
                                                    )}
                                                </div> */}
                                                {errorState ? <div className="text-danger error-msg-text mt-3">{errorState}</div> : ''}
                                                {successState ? <div className="text-success success-msg-text mt-3">{ successState }</div> : ''}

                                            </div>
                                        </div>
                                        <div className="login_btn text-center mt-110">
                                            <button type="submit" className="btn" onClick={ValidateOtp}>Verify
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


            }
        </>
    )
}