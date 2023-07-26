const Axios = require("axios");
const Constant = require("../Constant");

export async function sendOtpApi(data) {
    let response = await Axios.post(Constant.apiBasePath + 'sendOTP', data);
    return response.data;
}

export async function verifyOtpApi(data) {
    let response = await Axios.post(Constant.apiBasePath + 'verifyOTP', data);
    return response.data;
}



export  async function forgotPassword(data) {
    let response = await Axios.post(Constant.apiBasePath + 'forgotPassword', data);
    return response.data;
}

export  async function loginUser(data) {
    let response = await Axios.post(Constant.apiBasePath + 'login', data);
    return response.data;
}

export async function authGoogle(data) {
    let response = await Axios.post(Constant.apiBasePath + 'auth-google', data);
    return response.data;
}

export async function authFacebook(data) {
    let response = await Axios.post(Constant.apiBasePath + 'auth-facebook', data);
    return response.data;
}
