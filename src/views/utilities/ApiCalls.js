const Axios = require("axios");
const Constant = require("../Constant");
const { getTokenDetails } = require('../utilities/CommonFunction');

export async function getBanners(data ={}) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.post(Constant.apiBasePath + 'banner/get-all', data, {headers: {'token': token}});
    return response.data;
}


export async function getCountries() {
    let response = await Axios.get(Constant.apiBasePath + 'location/country/getAll');
    return response.data;
}

export async function getStatesbyCountry(prams={}) {

    let response = await Axios.get(Constant.apiBasePath + 'location/state/getAll', {
        params: prams
    } );
    return response.data;
}

export async function getCitiesbyState(params={}) {
    let response = await Axios.get(Constant.apiBasePath + 'location/city/getAll',{
        params:params
    });
    return response.data;
}
export async function getContests(params ={}) {
    let response = await Axios.get(Constant.apiBasePath + 'contest/getDataForApp',{
        params:params
    });
    return response.data;
}

export async function updateUserProfile(data) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.patch(Constant.apiBasePath + 'updateUserInfoById', data, {headers: {'token': token}});
    return response.data;
}

export async function updateUserPassword(data) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.patch(Constant.apiBasePath + 'updatePassword', data, {headers: {'token': token}});

    return response.data;
}

export async function getEnrollmentDataForApp(params) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.get(Constant.apiBasePath + 'enrollment/getDataForApp?userId=' + params.userId, {headers: {'token': token}});
    return response.data;
}

export async function getUserPlan() {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.get(Constant.apiBasePath + 'enrollment/getUserPlan', {headers: {'token': token}});
    return response.data;
}

export async function createUserSubscription(data) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.post(Constant.apiBasePath + 'order/create-user-subscription', data, {headers: {'token': token}});
    return response.data;
}

export async function getStoryCategories(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');

    let response = await Axios.get(Constant.apiBasePath + 'category/getDataForApp', {
        headers: {'token': token},
        params: prams
    });
    return response.data;
}

export async function createStory(data) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.post(Constant.apiBasePath + 'story/create', data, {headers: {'token': token}});
    return response.data;
}

export async function uploadStoryImage(data) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.post(Constant.apiBasePath + 'story/uploadFileOnS3', data, {headers: {'token': token}});
    return response.data;
}

export async function getStories(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');
    if(token) {
        let { _id } = getTokenDetails(token);
        prams.user_id = _id;
    }
    let response = await Axios.get(Constant.apiBasePath + 'story/getDataForApp', {
        headers: {'token': token},
        params: prams
    });
    return response.data;
}

export async function createPoem(data) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.post(Constant.apiBasePath + 'poem/create', data, {headers: {'token': token}});
    return response.data;
}

export async function getPoems(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');
    if(token) {
        let { _id } = getTokenDetails(token);
        prams.user_id = _id;
    }
    let response = await Axios.get(Constant.apiBasePath + 'poem/getDataForApp', {
        headers: {'token': token},
        params: prams
    });
    return response.data;
}

export async function getProfileDetails(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.get(Constant.apiBasePath + 'user/getProfileDetails', {
        headers: {'token': token},
        params: prams
    });
    return response.data;
}


export async function userCoin(data) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.post(Constant.apiBasePath + 'userCoin', data, {headers: {'token': token}});
    return response.data;
}


export async function getSiteSocial(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');
    let response = await Axios.post(Constant.apiBasePath + 'getSocialMediaData', {
        headers: {'token': token},
        params: prams
    });
    return response.data;
}

export async function getPages(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');

    let response = await Axios.post(Constant.apiBasePath + 'searchChildCMSByTitle', prams, {
        headers: {'token': token}
    });
    return response.data;
}

export async function getVideos(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');
    if(token) {
        let { _id } = getTokenDetails(token);
        prams.user_id = _id;
    }
    let response = await Axios.get(Constant.apiBasePath + 'video/getDataForUser', {
        headers: {'token': token},
        params: prams
    });
    return response.data;
}

export async function getMovies(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');
    if(token) {
        let { _id } = getTokenDetails(token);
        prams.user_id = _id;
    }
    let response = await Axios.get(Constant.apiBasePath + 'movies/getDataForUser', {
        headers: {'token': token},
        params: prams
    });
    return response.data;
}

export async function getAudios(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');
    if(token) {
        let { _id } = getTokenDetails(token);
        prams.user_id = _id;
    }
    let response = await Axios.get(Constant.apiBasePath + 'audio/getDataForUser', {
        headers: {'token': token},
        params: prams
    });
    return response.data;
}

export async function userLike(data) {
    let token = sessionStorage.getItem('loginDetails');

    let response = await Axios.post(Constant.apiBasePath + 'like', data, {
        headers: {'token': token},
    });
    return response.data;
}

export async function getNotification(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');

    let response = await Axios.get(Constant.apiBasePath + 'notification/getByUserId', {
        headers: { 'token': token },
        params: prams
    });
    return response.data;
}

export async function getThumbnail(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');

    let response = await Axios.get(Constant.apiBasePath + 'content-thumbnail/getDataForUser', {
        headers: { 'token': token },
        params: prams
    });
    return response.data;
}

export async function deleteStoryOrPoem(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');
    
    let type = '';
    if(prams.type === 1) {
        type = 'story';
    }
    else if(prams.type === 2) {
        type = 'poem';
    }

    let response = await Axios.delete(Constant.apiBasePath + type + '/user/' + prams.id, {
        headers: { 'token': token },
        params: prams
    });
    return response.data;
}

export async function getDataById(prams = {}) {
    let token = sessionStorage.getItem('loginDetails');
    
    let type = '';
    if(prams.type == 1) {
        type = 'story';
    }
    else if(prams.type == 2) {
        type = 'poem';
    }

    let response = await Axios.get(Constant.apiBasePath + type + '/getDataById/' + prams.id, {
        headers: { 'token': token },
        params: prams
    });
    return response.data;
}

export async function getFollowOrFollowingList(metaData) {
    let token = sessionStorage.getItem('loginDetails');
    
    let response = await Axios.post(Constant.apiBasePath + 'getFollowOrFollowingList', metaData, { headers: { 'token': token }});
    return response.data;
}

export async function getUserBadge(params) {
    let token = sessionStorage.getItem('loginDetails');
    let metaData = {};
    let response = await Axios.post(Constant.apiBasePath + 'getUserBadge?type=' + params.type, metaData, { headers: { 'token': token }});
    return response.data;
}

export async function userFollow(data) {
    let token = sessionStorage.getItem('loginDetails');

    let response = await Axios.post(Constant.apiBasePath + 'follow-user', data, {
        headers: {'token': token},
    });
    return response.data;
}
