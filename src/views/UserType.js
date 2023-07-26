import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Constant from "./Constant";
import {useHistory} from "react-router";
import Context from "../Context";
import {getEnrollmentDataForApp, createUserSubscription} from "./utilities/ApiCalls";

export default function UserType() {
    const history = useHistory();
    const [plans, setPlans] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);


    useEffect(() => {
        getEnrollmentDataForApp().then((response) => {
            setPlans(response.data);
        });
    }, []);

    function updateType(e) {
        e.preventDefault()
        let plan_id = e.target.getAttribute('value')
        let currentplan = plans.find(item => item._id == plan_id);
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

    return (
        <>
            <section className="login_page">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12 order_2">
                            <div className="left_content">
                                <h2>Bringing Stories To Life</h2>
                                <p>Start for free and get attractive contests from the community</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12 p-0 order_1">
                            <div className="login_page_content">
                                <h2>Select your User type </h2>
                                <div className="row left_rite_space">
                                    <div className="col-lg-12 col-sm-6 col-md-12 col-12 p-0">
                                        <div className="type_box">
                                            <div className="bg_info">
                                                <img src="/images/free.png" alt=""/>
                                                <h3>Free</h3>
                                            </div>
                                            <div className="row">
                                                {
                                                    plans.map((plan, index) => {
                                                        return <>
                                                            <div className="col-lg-6 col-md-6 col-6">
                                                                <div className="free_info">
                                                                    <h3>{plan.name}</h3>
                                                                    <h4>{plan.finalAmount}</h4>
                                                                    <p>/month(no dynamic)</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-6 col-6">
                                                                <div className="info_box">
                                                                    <ul>
                                                                        <li>Write a stories (no dynamic)</li>
                                                                        <li>See short stories (no dynamic)</li>
                                                                    </ul>
                                                                    <button type="submit" className="bg_blue"
                                                                            onClick={updateType} value={plan._id}>Get Started
                                                                    </button>
                                                                </div>
                                                            </div>

                                                        </>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-sm-6 col-md-12 col-12 p-0">
                                        <div className="type_box">
                                            <div className="bg_info">
                                                <img src="/images/standard.png" alt=""/>
                                                <h3>Standard</h3>
                                                <p className="text-danger">{ errorMessage }</p>
                                                <p className="text-success">{ successMessage }</p>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-6">
                                                    <div className="free_info">
                                                        <h3>Team</h3>
                                                        <h4>$0</h4>
                                                        <p>/month</p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-6">
                                                    <div className="info_box">
                                                        <ul>
                                                            <li>Write a stories</li>
                                                            <li>See short stories</li>
                                                            <li>Listen all audio notes</li>
                                                            <li>Watch all stories</li>
                                                        </ul>
                                                        <button type="submit" className="bg_d_blue" onClick={updateType}
                                                                value={1}>Get Started
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}