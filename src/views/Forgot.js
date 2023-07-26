import {Link} from "react-router-dom";
import {useCallback, useContext, useEffect, useState} from "react";
import axios from "axios";
import {forgotPassword, sendOtpApi, verifyOtpApi} from "./utilities/Authentication";
import {statusFailure} from "./Constant";
import {useHistory} from "react-router";
import Context from "../Context";
import {deDE} from "@material-ui/core/locale";
import $ from 'jquery';

export default function Forgot() {
    const history = useHistory();
    const {state, dispatch} = useContext(Context);
    const [step, setStep] = useState(1);
    const [errorState, setErrorState] = useState(null);
    const [optFormState, setOptFormState] = useState({
        emailMobile: ''
    });
    const [otpToken, setOtpToken] = useState('');
    const [otpNumber, setOtpNumber] = useState({
        otp1: '',
        otp2: '',
        otp3: '',
        otp4: '',
    });

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }

            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval);
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

    //redirect to home page if user is already logged in
    function getOtpNumber() {
        return otpNumber.otp1 + otpNumber.otp2 + otpNumber.otp3 + otpNumber.otp4;
    }


    function handleOtpFormChange(e) {
        console.log(e.target.value)
        setOptFormState({
            ...optFormState,
            [e.target.name]: e.target.value
        })
    }

    function onChangeOtpNumber(e) {
        let {value, maxLength} = e.target;
        value = value.slice(0, maxLength);
        setOtpNumber({
            ...otpNumber,
            [e.target.name]: value
        })
    }

    // clear error state after 5 seconds
    if (errorState) {
        setTimeout(() => {
            setErrorState(null);
        }, 5000);
    }


    function sendOtp(e) {
        e.preventDefault();
        forgotPassword({emailMobile:optFormState.emailMobile}).then(response => {
            if (response.status !== statusFailure && response.data != '') {
                setStep(2)
                setOtpToken(response.data);
                setMinutes(0)
                setSeconds(45)
            } else {
                setErrorState(response.message)
            }
        });
    }

    function verifyOtp(e) {
        e.preventDefault();

        verifyOtpApi({otp: getOtpNumber().toString(), token: otpToken}).then(response => {
            if (response.status !== statusFailure) {
                dispatch({type: 'login', payload: response.data});
                history.push('/update-password');
            } else {
                setErrorState(response.message)
            }
        }).catch((error) => {
            setErrorState(error.response.data.message)
        });
    }

    function backToStep(e) {
        e.preventDefault();
        // alert(e.target.getAttribute('step'))
        setStep(e.target.getAttribute('step'));
        // setStep(1)
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


    return (
        <>
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
                                <div className="login_page_content pt-110">
                                    <h2>Forgot Password </h2>
                                    <p>Please enter your registered email.</p>
                                    <div className="form">
                                        <form className="mt-110" onChange={handleOtpFormChange} onSubmit={sendOtp}>
                                            <div className="row">
                                                <div className="f_class">
                                                    <div className="col-lg-10 col-md-6 col-10 p-0">
                                                        <input type="email" name="emailMobile"
                                                               className="border_none form-control"
                                                               placeholder="Enter Your Email" value={optFormState.emailMobile}/>
                                                        {errorState ?
                                                            <div className="text-danger error-msg-text">{errorState}</div> : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="login_btn text-center mt-110">
                                                <button type="submit" className="btn">Send OTP</button>
                                            </div>
                                        </form>
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
                                        <form className="mt-110" onSubmit={verifyOtp} onChange={onChangeOtpNumber}>
                                            <div className="row justify-content-center">
                                                <div className="col-lg-12 col-md-12 col-12">
                                                    <div className="top_box">
                                                        <input type="number" name="otp1" id="otp1" maxLength={1}
                                                               value={otpNumber.otp1} className="form-control otp_input"
                                                               placeholder=""/>
                                                        <input type="number" name="otp2" id="otp2" maxLength={1}
                                                               value={otpNumber.otp2} className="form-control otp_input"
                                                               placeholder=""/>
                                                        <input type="number" name="otp3" id="otp3" maxLength={1}
                                                               value={otpNumber.otp3} className="form-control otp_input"
                                                               placeholder=""/>
                                                        <input type="text" name="otp4" id="otp4" value={otpNumber.otp4}
                                                               maxLength={1} className="form-control otp_input" placeholder=""/>
                                                    </div>
                                                    <div className="number_resent">
                                                        <a href="#" onClick={backToStep} step="1">Change number</a>
                                                        {seconds > 0 || minutes > 0 ? (
                                                            <span>
                                                                Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}: {seconds < 10 ? `0${seconds}` : seconds}
                                                            </span>
                                                        ) : (
                                                            <span onClick={backToStep} step="1">Resend</span>
                                                        )}
                                                    </div>
                                                    {errorState ? <div className="text-danger error-msg-text">{errorState}</div> : ''}

                                                </div>
                                            </div>
                                            <div className="login_btn text-center mt-110">
                                                <button type="submit" className="btn">Verify
                                                </button>
                                            </div>
                                        </form>
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