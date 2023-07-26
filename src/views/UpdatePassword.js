import {useContext, useEffect, useState} from "react";
import {
    updateUserPassword
} from "./utilities/ApiCalls";
import Constant from "./Constant";
import {useHistory} from "react-router";
import Context from "../Context";

export default function UpdatePassword() {
    const history = useHistory();
    const {state, dispatch} = useContext(Context);

    const [error, setError] = useState('');
    const [getSuccessMessage, setSuccessMessage] = useState('');

    const [registerForm, setRegisterForm] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);




    function handleFormChange(e) {
        setRegisterForm({
            ...registerForm,
            [e.target.name]: e.target.value
        })
    }
    function showHidePassword (e) {
        e.preventDefault()
        setShowPassword(!showPassword)
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
            updateUserPassword(registerForm).then(response => {
                if (response.status === Constant.statusSuccess) {
                    dispatch({type: 'logout', payload: null});
                    setSuccessMessage(response.message);
                    setTimeout(function() {
                        history.push('/login');
                    }, 3000);
                } else {
                    setError(response.message);
                    setTimeout(function() { setError(null); }, 3000);
                }
            });
        }
        else{
            setError("Password should be at least minimum 6 characters, one uppercase, lowercase, number and special character!")
        }
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
                            <div className="login_page_content pt-110">
                                <h2>Create Your New Password </h2>
                                <p>Please enter your new password.</p>
                                
                                {error ? <div className="text-danger">{error}</div> : ''}
                                {getSuccessMessage ? <div className="text-success">{getSuccessMessage}</div> : ''}
                                
                                <div className="form form_1">
                                    <form className="mt-110" onChange={handleFormChange} onSubmit={handleFormSubmit}>
                                        <div className="row">
                                            <div className="col-lg-12 col-md-6 col-12">
                                                <input type={showPassword ? 'text' : 'password'}  className="form-control"
                                                       placeholder="New password" name="password"
                                                       value={registerForm.password}/>
                                                <button className="password_show" type="button" onClick={showHidePassword}>
                                                    <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} aria-hidden="true"></i></button>
                                            </div>
                                            <div className="col-lg-12 col-md-6 col-12">
                                                <input type={showPassword ? 'text' : 'password'}  className="form-control"
                                                       name="confirmPassword"
                                                       placeholder="Confirm password"
                                                       value={registerForm.confirmPassword}/>
                                                <button className="password_show" type="button" onClick={showHidePassword}>
                                                    <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                        <div className="login_btn text-center mt-110">
                                            <button type="submit" className="btn">Submit</button>
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