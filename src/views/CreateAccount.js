import {Link} from "react-router-dom";
import {useState} from "react";

export default function CreateAccount() {
    const [step, setStep] = useState(1);
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        dob: '',
        country_id: '',
        city_id: '',
        password: '',
        confirme_password: ''
    });

    function verifyOtp() {
        setStep(2)
    }

    return (<>
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
                                <h2>Fill the Details </h2>
                                <p>Please enter your details.</p>
                                <div className="form">
                                    <form className="register_form">
                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 col-12 p-0">
                                                <input type="text" className=" form-control"
                                                       placeholder="Full name"/>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12 p-0">
                                                <input type="email" className=" form-control"
                                                       placeholder="Email Id"/>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12 p-0">
                                                <input type="date" className=" form-control"
                                                       placeholder="Full name"/>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12 p-0">
                                                <select className="form-control">
                                                    <option> Select your gender</option>
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12 p-0">
                                                <select className="form-control">
                                                    <option> Select your country</option>
                                                    <option>India</option>
                                                    <option>Japan</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12 p-0">
                                                <select className="form-control">
                                                    <option> Select your City</option>
                                                    <option>Delhi</option>
                                                    <option>Dehradun</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12 p-0">
                                                <input type="password" id="myInput" className="form-control"
                                                       placeholder="Create your password"/>
                                                <button className="password_show" type="button"
                                                        onClick="myFunction()"><i className="fa fa-eye"
                                                                                  aria-hidden="true"></i>
                                                </button>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12 p-0">
                                                <input type="password" id="myInput" className="form-control"
                                                       placeholder="Confirm your password"/>
                                                <button className="password_show" type="button"
                                                        onClick="myFunction()"><i className="fa fa-eye"
                                                                                  aria-hidden="true"></i>
                                                </button>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-12 p-0 ">
                                                <div className="login_btn text-center">
                                                    <button type="submit" className="btn">Next</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}