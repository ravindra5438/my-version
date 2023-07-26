import Layout from "../Layout/Layout";
import {useEffect, useState, useContext} from "react";
import Context from "../Context";
import { createUserSubscription, getEnrollmentDataForApp, getUserPlan, getProfileDetails } from "./utilities/ApiCalls";
import {useHistory} from "react-router";
import axios from "axios";
import Parse from 'html-react-parser';
import Constant from "./Constant";

export default function Plan() {
    const history = useHistory();
    const [plans, setPlans] = useState([]);
    const [userPlans, setUserPlans] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [userDetails, setUserDetails] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const {state, dispatch} = useContext(Context);

    useEffect(() => {
        // getProfileDetails().then((response) => {
        //     setUserDetails(response.data);
        // });

        getUserPlan().then((res) => {
            setUserPlans(res.data);
        })

        if(state.user) {
            // console.log({userId: state.user});
            // save user info in state
            getEnrollmentDataForApp({userId: state.user._id}).then((response) => {
                setPlans(response.data);
                setUserDetails(state.user);
            });
        }

        // razorpay payment gateway initialization

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);


    }, []);

    function updateType(e) {
        e.preventDefault();
        let plan_id = e.target.getAttribute('value');
        let currentplan = plans.find(item => item._id == plan_id);
        if(currentplan) {
            if(parseInt(currentplan.amount) > 0) {

                let token = sessionStorage.getItem('loginDetails');
                var amount = currentplan.amount; //Razorpay consider the amount in paise
                var options = {
                    "key": 'rzp_test_a5bjEyydEthrBk',
                    "amount": "", // 2000 paise = INR 20, amount in paisa
                    "name": "",
                    "description": "",
                    'order_id':"",
                    "handler": function(response) {
                        var values = {
                            enrollmentId: currentplan._id,
                            razorpaySignature : response.razorpay_signature,
                            razorpayOrderId : response.razorpay_order_id,
                            razorpayPaymentId : response.razorpay_payment_id,
                            secret: 'ZPzYKhzrveCXWqIgT8pmNu3j',
                            finalAmount : amount,
                            expiredDate: currentplan.expiredDate,
                            isPrime: currentplan.isPrime
                        }
                        axios.post(Constant.apiBasePath + 'order/verify-signature', values, { headers: { 'token': token }})
                        .then( res => { 
                            setSuccessMessage(res.data.message); 
                            setTimeout(function() { history.push('/') }, 3000);
                        })
                        .catch(e => console.log(e) );
                    },
                    "prefill":{
                        "name": userDetails.name,
                        "email": userDetails.email,
                        "contact": userDetails.mobile
                    },
                    "notes": {
                        "address": "Hello World"
                    },
                    "theme": {
                        "color": "#528ff0"
                    }
                };
                let metaData = {
                    "amount": amount,
                    "enrollmentId": currentplan._id,
                    "isPrime": 1,
                    "expiredDate": currentplan.expiredDate
                }
    
                axios.post(Constant.apiBasePath + 'order/create', metaData, { headers: { 'token': token }})
                    .then(res=>{
                        if(res.data.status === Constant.statusSuccess) {
                            options.order_id = res.data.data.razorpayOrderId;
                            options.amount = res.data.data.amount;
                            var rzp1 = new window.Razorpay(options);
                            rzp1.open();
                        }
                        else {
                            alert(res.data.message);
                            return false;
                        }
                    })
                    .catch(e => console.log(e))
            
            }
            else{
                createUserSubscription({
                    enrollmentId: currentplan._id,
                    amount: currentplan.amount,
                    isPrime: currentplan.isPrime,
                    expiredDate:currentplan.expiredDate
                }).then((response) => {
                    if (response.status == Constant.statusSuccess) {
                        setSuccessMessage(response.message);
                        setTimeout(function() { history.push('/') }, 3000);
                    } else {
                        setErrorMessage(response.message);
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
        else {
            setErrorMessage('No current plan found!');
        }
    }


    return <Layout>
        <section className="about_section plan_section">
            <div className="story_bg">
                <img src="/images/story_bg.png" alt=""/>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                        <div className="heading_title mt-30">
                            <h1>Plans</h1>
                            { (userPlans.length < 1) ? <p>You are unsubscribe user!</p> : '' }
                            {
                                (successMessage)
                                ?
                                <p className="text-success success-msg-text">{ successMessage }</p> 
                                :
                                ''
                            }

                            {
                                (errorMessage)
                                ?
                                <p className="text-danger error-msg-text">{ errorMessage }</p>
                                :
                                ''
                            }
                        </div>
                    </div>
                    {
                        userPlans.map((plan, index) => {
                            // split createAt

                            let purchaseDate = plan.createdAt.split('T')[0];
                            let difference_In_Days = '';

                            if(plan.expiredDate) {
                                let todayDate = new Date();
                                let expiredDate = new Date(plan.expiredDate);
                                let difference_In_Time = expiredDate.getTime() - todayDate.getTime();
                                difference_In_Days = (difference_In_Time / (1000 * 3600 * 24)).toFixed(0) + " Days left";
                            }
                            else {
                                difference_In_Days = '';
                            }

                            return <div className="col-lg-6 col-sm-6 col-md-6 col-12" key={index}>
                                <div className="type_box">
                                    <div className="counter_plan">
                                        <p> {plan.fromAge} to {plan.toAge} age</p>
                                    </div>
                                    <div className="bg_info">
                                        <img src="/images/standard.png" alt=""/>
                                        { (plan.isExpire || difference_In_Days < 0) ? <h3>{plan.name} <span>Expired</span></h3> : <h3>{plan.name} <span>{ difference_In_Days }</span></h3> }
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-6">
                                            <div className="free_info">
                                                <h3>{plan.isExpire ? 'Expired' : 'Active'}</h3>
                                                <h4>{plan.amount}</h4>
                                                <p>Amount paid</p>
                                                <div className="date_purchase">
                                                    <ul>
                                                        <li>
                                                            Purchased : <span>{purchaseDate}</span>
                                                        </li>
                                                        {
                                                            (plan.expiredDate)
                                                            ?
                                                            <li>
                                                                Expire till : <span>{plan.expiredDate}</span>
                                                            </li>
                                                            :
                                                            ''
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-6">
                                            <div className="info_box">
                                                <p>{plan.about}</p>
                                                <p>{ Parse(plan.description) }</p>
                                                { plan.isExpire ?  <button type="submit" className="bg_blue" onClick={updateType} value={plan.enrollmentId}>Purchase again</button> : <button type="submit" className="bg_d_blue" onClick={updateType} value={plan.enrollmentId}>Renew now</button> }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }

                    <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                        <div className="heading_title mt-30">
                            <h1>New Plans </h1>
                            { (plans.length < 1) ? <p>No plan found</p> : '' }
                        </div>
                    </div>
                    {
                        plans.map((plan, index) => {
                            return <div className="col-lg-6 col-sm-6 col-md-6 col-12" key={index}>
                                <div className="type_box">
                                    <div className="counter_plan">
                                        <p> {plan.fromAge} to {plan.toAge} age</p>
                                    </div>
                                    <div className="bg_info">
                                        <img src="/images/standard.png" alt=""/>
                                        <h3>{plan.name} </h3>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-6">
                                            <div className="free_info">
                                                <h4>RS {plan.amount}</h4>
                                                <p>Amount</p>
                                                <div className="date_purchase">
                                                    <ul>
                                                        {
                                                            (plan.expiredDate)
                                                            ?
                                                            <li>
                                                                Expire till : <span>{plan.expiredDate}</span>
                                                            </li>
                                                            :
                                                            ''
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-6">
                                            <div className="info_box">
                                                <p>{ Parse(plan.description) }</p>
                                                <button type="submit" className="bg_d_blue" onClick={updateType}
                                                        value={plan._id} disabled={ (plan.userPlan === true) ? 'disabled': '' }>Purchase now
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        })
                    }

                </div>
            </div>
        </section>
    </Layout>


}