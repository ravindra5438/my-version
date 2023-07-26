import {useEffect, useState} from "react";
import {
    getCitiesbyState,
    getCountries,
    getProfileDetails,
    getStatesbyCountry,
    updateUserProfile
} from "./utilities/ApiCalls";
import Constant from "./Constant";
import {useHistory} from "react-router";
import moment from 'moment';

export default function UpdateUserProfile() {
    const history = useHistory();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        dob: '',
        gender: '',
        countryId: '',
        stateId: '',
        cityId: '',
        password: '',
        confirmPassword: ''
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        getCountries().then(response => {
            if (response.status === Constant.statusSuccess) {
                setCountries(response.data);
                setStates([])
                setCities([]);

            } else {
            }
        });

        getProfileDetails().then(response => {
            if (response.status === Constant.statusSuccess) {
                setRegisterForm({
                    name: response.data.name,
                    email: response.data.email,
                    dob: response.data.dob,
                    gender: response.data.gender,
                    countryId: '',
                    stateId: '',
                    cityId: '',
                    password: '',
                    confirmPassword: ''
                });

            } else {
            }
        });
        
    }, [])

    function onChangeCountry(e) {
        let country = countries.find( item => item._id == e.target.value)
        if (!country) {
            setStates([]);
            return false;
        }
        getStatesbyCountry({countryCode: country.isoCode}).then(response => {
            if (response.status === Constant.statusSuccess) {
                setStates(response.data);
                setCities([]);
            } else {
                setError(response.message);
            }
        });
    }

    function onChangeState(e) {
        let country = countries.find( item => item._id == registerForm.countryId)
        let state = states.find( item => item._id == e.target.value)
        if (!country || !state) {
            setCities([]);
            return false;
        }
        getCitiesbyState({countryCode:country.isoCode, stateCode:state.isoCode}).then(response => {
            if (response.status === Constant.statusSuccess) {
                setCities(response.data);
            } else {
                setError(response.message);
            }
        });
    }


    function handleFormChange(e) {
        setRegisterForm({
            ...registerForm,
            [e.target.name]: e.target.value
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        // write a script for password complexity

        let password = registerForm.password;

        var strength = 0;
        if (password.match(/[a-z]+/)) {
            strength += 1;
        }
        if (password.match(/[A-Z]+/)) {
            strength += 1;
        }
        if (password.match(/[0-9]+/)) {
            strength += 1;
        }
        if (password.match(/[$@#&!]+/)) {
            strength += 1;
        }

        if(strength === 4) {
            updateUserProfile(registerForm).then(response => {
                if (response.status === Constant.statusSuccess) {
                    setSuccessMessage(response.message);
                    setTimeout(function() {
                        history.push('/plans');
                    }, 3000);
                } else {
                    setError(response.message);
                }
            });
        }
        else{
            setError("Password should be at least minimum 6 characters, one uppercase, lowercase, number and special character!")
        }
    }
    function showHidePassword (e) {
        e.preventDefault()
        setShowPassword(!showPassword)
    }

    return (<>
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
                                <h2>Fill the Details </h2>
                                <p>Please enter your details.</p>
                                {error ? <p className="text-danger error-msg-text">{error}</p> : ''}
                                {successMessage ? <p className="text-success success-msg-text">{successMessage}</p> : ''}

                                <form onChange={handleFormChange}>
                                    <div className="form">
                                        <form className="register_form">
                                            <div className="row">
                                                <div className="col-lg-12 col-md-12 col-12 p-0">
                                                    <input type="text" name="name" className=" form-control"
                                                           placeholder="Full name *" value={registerForm.name}/>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-12 p-0">
                                                    <input type="email" className=" form-control"
                                                           placeholder="Email Id" name="email"
                                                           value={registerForm.email}/>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-12 p-0">
                                                    <input type="date" className=" form-control"
                                                           placeholder="Full name" name="dob" value={registerForm.dob} max={moment().format("YYYY-MM-DD")}/>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-12 p-0">
                                                    <select className="form-control" name="gender"
                                                            value={registerForm.gender}>
                                                        <option value="" selected> Select your gender</option>
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-12 p-0">
                                                    <select className="form-control" name="countryId"
                                                            value={registerForm.countryId} onChange={onChangeCountry}>
                                                        <option value={''} selected> Select your country</option>
                                                        {countries.map((country, index) => {
                                                            return (<option key={country._id}
                                                                            value={country._id}>{country.name}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-12 p-0">
                                                    <select className="form-control" name="stateId"
                                                            value={registerForm.stateId} onChange={onChangeState}>
                                                        <option selected value={''}> Select your State</option>
                                                        {states.map((state, index) => {
                                                            return (<option key={state._id}
                                                                            value={state._id}>{state.name}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-12 p-0">
                                                    <select className="form-control" name="cityId"
                                                            value={registerForm.cityId}>
                                                        <option selected value={''}> Select your City</option>
                                                        {cities.map((state, index) => {
                                                            return (<option key={state._id}
                                                                            value={state._id}>{state.name}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-12 p-0">
                                                    <input type={showPassword ? 'text' : 'password'} id="password" className="form-control"
                                                           placeholder="Create your password *" name="password"
                                                           value={registerForm.password}/>
                                                    <p class="textbox text-center"></p>
                                                    <button className="password_show" type="button"
                                                            onClick={showHidePassword} >
                                                        <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} aria-hidden="true"></i></button>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-12 p-0">
                                                    <input type={showPassword ? 'text' : 'password'} id="confirmPassword" className="form-control"
                                                           placeholder="Confirm your password *" name="confirmPassword"
                                                           value={registerForm.confirmPassword}/>
                                                    <button className="password_show" type="button" onClick={showHidePassword}>
                                                        <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} aria-hidden="true"></i></button>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-12 p-0 ">
                                                    <div className="login_btn text-center">
                                                        <button onClick={handleFormSubmit} type="button"
                                                                className="btn">Next
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}