
import Layout from "../Layout/Layout";
import {useEffect, useState} from "react";
import { getPoems, getProfileDetails, getStories, getNotification, updateUserProfile, 
    userLike, deleteStoryOrPoem, getFollowOrFollowingList, getUserBadge, getStoryCategories, userFollow } from "./utilities/ApiCalls";
import {Link} from "react-router-dom";
import Axios from "axios";
import Constant, { statusFailure } from "./Constant";
import {useHistory, useParams} from "react-router";
import $ from 'jquery';
import moment from 'moment';
import { getTokenDetails } from "./utilities/CommonFunction";

export default function Profile() {

    const history = useHistory();
    const params = useParams();
    const [stories, setStories] = useState([]);
    const [poems, setPoems] = useState([]);
    const [profile, setProfile] = useState({});
    const [notifications, setNotification] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    const [successState, setSuccessState] = useState(null);
    const [errorState, setErrorState] = useState(null);
    const [isLike, setLike] = useState(false);

    const [followerFollowingList, setFollowerFollowingList] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [length, setLength] = useState(1);
    const [followHeader, setFollowHeader] = useState('Followers');

    const [badgeList, setBadgeList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);

    const [updateForm, setUpdateForm] = useState({
        name: '',
        email: '',
        dob: '',
        gender: '',
        countryId: '',
        stateId: '',
        cityId: '',
        profilePic: ''
    });
    
    const [isFollow, setFollow] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {

        getProfileDetails({ user_id: params.userId }).then((response) => {
            let user = response.data;
            setProfile(user);
            setNotificationCount(user.notificationCount);
            let prams = {
                user_id: user._id
            };

            setUpdateForm({
                name: user.name,
                email: user.email,
                dob: user.dob,
                gender: user.gender,
                countryId: user.countryId,
                stateId: user.stateId,
                cityId: user.cityId,
                profilePic: user.profilePic
            }); 
        });

        let token = sessionStorage.getItem('loginDetails');
        let userDetails = getTokenDetails(token);
        if(userDetails) {
            setUserId(userDetails._id);
        }

    }, [setProfile, isFollow]);

    function getUserStories(page, categoryId) {
        let prams = { 'moduleType': 1 };
        getStoryCategories(prams).then((response) => {
            setCategories(response.data);
        })

        prams = { 'userId': profile._id, 'user_id': profile._id, 'pageNo': (page) ? page : pageNo };
        if(categoryId) {
            prams = { ...prams, categoryId: categoryId }
            setCategoryId(categoryId);
        }
        else{
            setCategoryId('');
        }
        getStories(prams).then((response) => {
            setStories(response.data);
            setPageNo(response.pageNo);
            setLength(response.length);
        });
    }

    function getUserPoems(page, categoryId) {
        let prams = { 'moduleType': 2 };
        getStoryCategories(prams).then((response) => {
            setCategories(response.data);
        });

        prams = { 'userId': profile._id, 'user_id': profile._id, 'pageNo': (page) ? page : pageNo };
        if(categoryId) {
            prams = { ...prams, categoryId: categoryId }
            setCategoryId(categoryId);
        }
        else{
            setCategoryId('');
        }
        getPoems(prams).then((response) => {
            setPoems(response.data);
            setPageNo(response.pageNo);
            setLength(response.length);
        });
    }

    async function getUserNotification(page) {
        getNotification({pageNo: page}).then((response) => {
            setNotification(response.data);
            setNotificationCount(response.count);
            setLength(response.length);
            setPageNo(response.pageNo);
        });
    }

    async function deleteNotificiation(id) {
        let token = sessionStorage.getItem('loginDetails');
        let response = await Axios.delete(Constant.apiBasePath + 'notification/delete/' + id, {
            headers: { 'token': token },
            params: {}
        });
        
        let data = response.data;
        if(data.status === Constant.statusSuccess) {
            setSuccessState(data.message);
            setTimeout(function() { setSuccessState(null) }, 3000);
            getUserNotification(pageNo);
        }
        else{
            setErrorState(data.message);
            setTimeout(function() { setErrorState(null) }, 3000);
        }
    }

    function handleFormChange(e) {
        setUpdateForm({
            ...updateForm,
            [e.target.name]: e.target.value
        })
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        updateUserProfile(updateForm).then(response => {
            if (response.status === Constant.statusSuccess) {
                setSuccessState(response.message);
                setErrorState("");
                setTimeout(() => window.location.reload(), 3000);
            } else {
                setErrorState(response.message);
                setSuccessState("");
                // setTimeout(() => window.location.reload(), 3000);
            }
        });
    }

    function like(metaData) {
        let likeRequest = {
            "moduleId": metaData.id,
            "type": metaData.type,
            "user_id": '',
            "title": metaData.title,
            "description": metaData.description,
            "thumbnail": metaData.thumbnail
        }

        userLike(likeRequest).then(response => {
            if (response.status !== Constant.statusFailure && response.data) {
                setLike(response.data.userLike);
                if(metaData.type === 1) {
                   getUserStories(pageNo);
                }
                if(metaData.type === 2) {
                    getUserPoems(pageNo);
                }
            }
        });
    }

    async function deleteContent(metaData) {
        let params = { 'id': metaData.id, 'type': metaData.type };

        deleteStoryOrPoem(params).then(data => {
            if(data.status === Constant.statusSuccess) {
                if(metaData.type === 1) {
                    getUserStories(pageNo);
                }
                if(metaData.type === 2) {
                    getUserPoems(pageNo);
                }
            }
            else{
                setErrorState(data.message);
            }
        });
    }

    async function followersOrFollowing(type, userId) {
        let metaData = {
            user_id: userId,
            type: type,
            pageNo: pageNo
        }

        if(type === 1) {
            setFollowHeader('Following');
        }

        // show following or followers modal

        window.$('#followingFolowers').modal('show');
        getFollowOrFollowingList(metaData).then(data => {
            if(data.status === Constant.statusSuccess) {
                setFollowerFollowingList(data.data);
                setPageNo(data.pageNo);
                setLength(data.length);
            }
            else{
                setErrorState(data.message);
            }
        });
    }

    function previousPage(page) {
        setPageNo(page);
    }

    function nextPage(page) {
        setPageNo(page);
    }

    var previous = 0;
    var next = 0;
    var customLength = 0

    if(pageNo >= 0) {
        previous = pageNo - 1;
        next = pageNo + 1;
    }

    if(length !== 0) {
        customLength = length;
    }

    function getBadgeList(type) {
        // 1 for Writer and 2 for Reader
        let params = { 'type': type };
        getUserBadge(params).then(response => {
            setBadgeList(response.data);
            setPageNo(response.pageNo);
            setLength(response.length);
        });

        if(type === 2) {
            $('#radio-one').prop('checked', false); // Checks it
            $('#radio-two').prop('checked', true); // Unchecks it
        }
        else {
            $('#radio-one').prop('checked', true); // Checks it
            $('#radio-two').prop('checked', false); // Unchecks it
        }
    }

    function changeProfilePicture(event) {
        try {
            let token = sessionStorage.getItem('loginDetails');
            let image = event.target.files[0];
            const form_data = new FormData();
           
            let extension = image.name.split('.').pop();
            if(extension !== 'jpg' && extension !== 'png' && extension !== 'JPG' && extension !== 'PNG') {
                $("#error-msg").text('Only jpg and png file type are allow!');
                // $("#error-msg").css("color", "red");
                return false;
            }
                
            form_data.append('userProfile', image, image.name);         
                
            Axios.post(Constant.apiBasePath + 'user/updateProfilePic', form_data, { headers: { 'token': token }}).then(response => {
            const getResults = response.data.message;
            
                if(response.data.status === Constant.statusSuccess) {
                    $("#success-msg").text('Your profile pic uploaded successfully.');
                    setTimeout(function() {
                        window.location.reload();
                    }, 3000);
                }
                else {
                    $("#error-msg").text(getResults);
                }

            });
        }
        catch(err) {
            console.log(err);
        }

    }

    function follow(followingId, status) {
        let userStatus = (status) ? 0 : 1;
        let userRequest = {
            "followingId": followingId,
            "status": userStatus
        }

        userFollow(userRequest).then(response => {
            if (response.status !== statusFailure) {
               setFollow(status);
            }
        });
    }
    
    return <Layout>

        {/* Start modal for select thumbnail */}

        <div class="modal fade" id="followingFolowers" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content startPopup">
                    <div class="modal-header">
                        <h5 class="modal-title">{ followHeader }</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div className="videos_gallery">
                            <div className="row">
                                <div className="col-12 col-sm-6 col-md-6">
                        
                                    {
                                        (followerFollowingList.length > 0)
                                        ?
                                            followerFollowingList.map((el, index) => {
                                                return <div className="row" key={el._id} >
                                                            <div className="col-4 col-sm-3 col-md-3">
                                                                <div className="leftimgbox">
                                                                    <img src={el.profilePic}/>
                                                                </div>
                                                            </div>
                                                            <div className="col-8 col-sm-9 col-md-9">
                                                                <div className="righttextbox">
                                                                    <h2>{el.name}</h2>
                                                                    <p>{el.userName}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                        })
                                        :
                                        <p>No data found</p>
                                    }
                                    
                                </div>
                            </div>
                        </div>

                        {
                            (followerFollowingList.length > 0 && length > 1)
                            ?
                                <div className="pagination">
                                {
                                    (pageNo <= 1) ?
                                <a>Previous</a>
                                :
                                <a className="paginate-link" onClick={() => previousPage(previous)}>Previous</a>
                                }
                                
                                <a>{pageNo}</a>
                                {
                                    (pageNo >= customLength)
                                    ?
                                <a className="active">Next</a>
                                :
                                <a className="paginate-link active"onClick={() => nextPage(next)}>Next</a>

                                }
                            </div>
                            :
                            null
                        }

                        <div class="theme-button">
                        
                        </div>
                    </div>
                </div>
            </div>
        </div> 

        {/* End modal */}

        <section className="single_profile">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-sm-12 col-md-12 col-12">
                        <div className="single_profile_info">
                            <span><img className="profile_icon" src={ (profile.userBadge) ? profile.userBadge.image : "/images/profile-icon.png" } alt="" /> </span>
                            
                            <div class="image-upload">
                                <label for="file-input">
                                    
                                    <img src={profile.profilePic} alt="" />
                                    <span className="editprofileicon"><i class="fa fa-pencil" aria-hidden="true"></i></span>
                                </label>
                                <input id="file-input" type="file" onChange={changeProfilePicture} accept="image/png, image/jpg"/>
                                <p id="error-msg" className="text-danger"></p>
                                <p id="success-msg" className="text-success"></p>
                            </div>

                                <h2>{profile.name}</h2>
                                <p>{profile.userName}</p>
                                <p>{ (profile.userBadge) ? profile.userBadge.title: '' }</p>
                                <p>{ (profile.isPrime) ? 'Premium' : 'Freemium' }</p>
                                {
                                    (profile._id !== userId)
                                    ?
                                    <a class="btn bg_l_blue follow_btn" onClick={()=> {follow(profile._id, profile.userFollow)}}>{ (profile.userFollow) ? 'UnFollow' : 'Follow' }</a>
                                    :
                                    ''
                                }
                                <div className="followmaintext">
                                    <div className="followtextleft">
                                    <strong onClick={()=> { followersOrFollowing(2, profile._id) }}>{profile.followers}</strong>
                                    Followers
                                    </div>
                                    <div className="followtextright">
                                    <strong onClick={()=>{ followersOrFollowing(1, profile._id) }}>{profile.following}</strong> Following 
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="video_gallery_section profile_tabs">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 col-sm-12 col-md-12 col-12 p-0">
                        <div className="profile_tabsmain">
                        <div className="tabs_div mt-50">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="all-tab" data-toggle="tab" href="#all" role="tab"
                                       aria-controls="all"
                                       aria-selected="true">About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="topic1-tab" data-toggle="tab" href="#topic1" role="tab"
                                       aria-controls="topic1"
                                       aria-selected="false" onClick={ ()=> { getUserStories(pageNo) } }>My Stories</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="topic-poem-tab" data-toggle="tab" href="#topic-poem" role="tab"
                                       aria-controls="topic-poem"
                                       aria-selected="false" onClick={ ()=> { getUserPoems(pageNo) } }>My Poems</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="topic2-tab" data-toggle="tab" href="#topic2" role="tab"
                                       aria-controls="topic2"
                                       aria-selected="false" onClick={ ()=> {getUserNotification(pageNo)} }>Notification <span className="notification-dot">{ notificationCount }</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="badges-tab" data-toggle="tab" href="#badges" role="tab"
                                       aria-controls="badges"
                                       aria-selected="false" onClick={ ()=> {getBadgeList(1)} }>My Badges</a>
                                </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="all" role="tabpanel"
                                aria-labelledby="all-tab">
                                <form onChange={handleFormChange} >
                                    <div className="row">
                                        <div className="col-lg-4 col-sm-4 col-md-4 col-6">
                                            <div className="user_content">
                                            <label>Name</label>
                                            <input type="text" name="name" className=" form-control" placeholder="Full name" defaultValue={profile.name}/>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-4 col-md-4 col-6">
                                            <div className="user_content">
                                                <label>DOB</label>
                                                <input type="date" className=" form-control" placeholder="Full name" name="dob" defaultValue={profile.dob} max={moment().format("YYYY-MM-DD")}/>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-4 col-md-4 col-6">
                                            <div className="user_content">
                                                <label>User Id</label>
                                                <input type="text" name="id" className="form-control" value={profile._id} />
                                                
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-4 col-md-4 col-6 profileedit">
                                            <div className="user_content">
                                                
                                                <label>Contact Number</label>
                                                <input type="text" name="mobile" className="form-control" value={profile.mobile} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-4 col-md-4 col-6 col-6 profileedit">
                                            <div className="user_content">
                                            <label>Email Id</label>
                                            <input type="email" name="email" className="form-control" defaultValue={profile.email} />
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-sm-12 col-md-12 col-12 mb-4 mt-2">
                                            <div className=" ">
                                                {
                                                    (errorState)
                                                    ?
                                                    <p className="text-danger error-msg-text">{ errorState }</p>
                                                    :
                                                    ''
                                                }

                                                {
                                                    (successState)
                                                    ?
                                                    <p className="text-success success-msg-text">{ successState }</p>
                                                    :
                                                    ''
                                                }                                                
                                                <div class="theme-button1"><button type="submit" onClick={ handleFormSubmit } className="btn default-btn">Update</button></div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>


                            <div className="mt-50 tab-pane fade position-relative" id="topic1" role="tabpanel"
                                 aria-labelledby="topic1-tab">
                                     <div class="theme-button contestbtn"><Link class="btn default-btn" to="/contest/1">Contest</Link></div>
                                        <div className="tabs_div">
                                            <ul className="nav nav-tabs">
                                                <li className="nav-item">
                                                    <a className={categoryId ? "nav-link" : "nav-link active"} value=""
                                                    onClick={()=> { getUserStories(pageNo)}}>All</a>
                                                </li>
                                                {
                                                    categories.map((category, index) => {
                                                        return <li className="nav-item" key={category._id}>
                                                            <a className={categoryId == category._id ? "nav-link active" : "nav-link"}
                                                            value={category._id} onClick={()=> getUserStories(pageNo, category._id)}
                                                            href="#all">{category.name}</a>
                                                        </li>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                        <div className="videos_gallery">
                                            <ul>
                                                {
                                                    stories.map((story, index) => {
                                                        let str = story.description;
                                                        let description = str;
                                                        if(str.length > 60) {
                                                            description = story.description.substring(0, 60) + '...';
                                                        }

                                                        let metaData = {
                                                            id: story._id,
                                                            title: story.name,
                                                            description: story.description,
                                                            thumbnail: story.thumbnail,
                                                            type: 1
                                                        }

                                                        let userRequest = {
                                                            id: story._id,
                                                            type: 1
                                                        }

                                                        let dynamicURL = `/update-story?type=1&id=${story._id}`;
                                                        if(story.editCount >= 2) {
                                                            dynamicURL = '#'
                                                        }

                                                        return <li key={story._id}>
                                                            <div className="main_box">
                                                                <img src={story.thumbnail}  alt="" style={{ pointerEvents: 'none' }}/>
                                                                <div className="gallery_info">
                                                                    <h2>{story.name}</h2>
                                                                    <p>{description}</p>
                                                                </div>
                                                                <div class="overlay">
                                                                    <h2>{ story.name }</h2>
                                                                    <p>{ description }</p>
                                                                    <div class="theme-button1">
                                                                        <Link to={'/story-details/' + story._id} class="default-btn">View Story</Link>
                                                                    </div>
                                                                    <div class="verif">
                                                                        
                                                                            {
                                                                                (story.status === 1)
                                                                                ?
                                                                                <h6>Story verified <i class="fa fa-check"></i></h6>
                                                                                :
                                                                                <h6>Story not verified <i class="bi bi-stopwatch-fill"></i></h6>
                                                                            }
                                                                        
                                                                        <span>Total Followers : { story.followers }</span> <span><i className= { (isLike || story.userLike) ? 'fa fa-thumbs-up default-cursor-point' : 'fa fa-thumbs-o-up default-cursor-point' } onClick={ () => like(metaData) }> </i> { story.likes }</span>
                                                                    </div>
                                                                
                                                                    <div className="edit_delete">
                                                                        <div className="eidticonbox"><Link to={ dynamicURL }><i class="fa fa-pencil-square-o" aria-hidden="true"></i></Link><span><i class="fa fa-trash-o delete" aria-hidden="true" onClick={() => {if(window.confirm('Delete the story?')){deleteContent(userRequest)}}}></i></span></div>
                                                                    </div>
                                                                    
                                                                </div>
                                                            </div>
                                                        </li>
                                                    })
                                                }


                                            </ul>
                                        </div>
                                            {
                                                (stories.length > 0 && length > 1)
                                                ?
                                                    <div className="pagination">
                                                    {
                                                        (pageNo <= 1) ?
                                                    <a>Previous</a>
                                                    :
                                                    <a className="paginate-link" onClick={() => getUserStories(previous)}>Previous</a>
                                                    }
                                                    
                                                    <a>{pageNo}</a>
                                                    {
                                                        (pageNo >= customLength)
                                                        ?
                                                    <a className="active">Next</a>
                                                    :
                                                    <a className="paginate-link active"onClick={() => getUserStories(next)}>Next</a>

                                                    }
                                                </div>
                                                :
                                                null
                                            }
                                        </div>

                                        <div className="mt-50 tab-pane fade position-relative" id="topic-poem" role="tabpanel"
                                            aria-labelledby="topic-poem-tab">
                                                <div class="theme-button contestbtn"><Link class="btn default-btn" to="/contest/2">Contest</Link></div>
                                                    <div className="tabs_div">
                                                        <ul className="nav nav-tabs">
                                                            <li className="nav-item">
                                                                <a className={categoryId ? "nav-link" : "nav-link active"} value=""
                                                                onClick={()=> { getUserPoems(pageNo)}}>All</a>
                                                            </li>
                                                            {
                                                                categories.map((category, index) => {
                                                                    return <li className="nav-item" key={category._id}>
                                                                        <a className={categoryId == category._id ? "nav-link active" : "nav-link"}
                                                                        value={category._id} onClick={()=> getUserPoems(pageNo, category._id)}
                                                                        href="#all">{category.name}</a>
                                                                    </li>
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="videos_gallery">
                                                    
                                                        <ul>
                                                            {
                                                                poems.map((story, index) => {
                                                                    let str = story.description;
                                                                    let description = str;
                                                                    if(str.length > 60) {
                                                                        description = story.description.substring(0, 60) + '...';
                                                                    }
                                                                    let metaData = {
                                                                        id: story._id,
                                                                        title: story.name,
                                                                        description: story.description,
                                                                        thumbnail: story.thumbnail,
                                                                        type: 2
                                                                    }

                                                                    let userRequest = {
                                                                        id: story._id,
                                                                        type: 2
                                                                    }

                                                                    let dynamicURL = `/update-poem?type=2&id=${story._id}`;
                                                                    if(story.editCount >= 2) {
                                                                        dynamicURL = '#'
                                                                    }

                                                                    return <li key={story._id}>
                                                                        <div className="main_box">
                                                                            <img src={story.thumbnail}  alt="" style={{ pointerEvents: 'none' }}/>
                                                                            <div className="gallery_info">
                                                                                <h2>{story.name}</h2>
                                                                                <p>{description}</p>
                                                                            </div>
                                                                            <div class="overlay">
                                                                                <h2>{ story.name }</h2>
                                                                                <p>{ description }</p>
                                                                                <div class="theme-button1">
                                                                                    <Link to={'/poem-details/' + story._id} class="default-btn">View Poem</Link>
                                                                                </div>
                                                                                <div class="verif">
                                                                                    
                                                                                        {
                                                                                            (story.status === 1)
                                                                                            ?
                                                                                            <h6>Story verified <i class="fa fa-check"></i></h6>
                                                                                            :
                                                                                            <h6>Story not verified <i class="bi bi-stopwatch-fill"></i></h6>
                                                                                        }
                                                                                    
                                                                                    <span>Total Followers : { story.followers }</span> <span><i className= { (isLike || story.userLike) ? 'fa fa-thumbs-up default-cursor-point' : 'fa fa-thumbs-o-up default-cursor-point' } onClick={ () => like(metaData) }> </i> { story.likes }</span>
                                                                                </div>
                                                                            
                                                                                    <div className="edit_delete">
                                                                                        <div className="eidticonbox"><Link to={ dynamicURL }><i class="fa fa-pencil-square-o" aria-hidden="true"></i></Link><span><i class="fa fa-trash-o delete" aria-hidden="true" onClick={() => {if(window.confirm('Delete the poem?')){deleteContent(userRequest)}}}></i></span></div>
                                                                                    </div>
                                                                            
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                })
                                                            }


                                                        </ul>
                                                    </div>
                                                    {
                                                        (poems.length > 0 && length > 1)
                                                        ?
                                                            <div className="pagination">
                                                            {
                                                                (pageNo <= 1) ?
                                                            <a>Previous</a>
                                                            :
                                                            <a className="paginate-link" onClick={() => getUserPoems(previous)}>Previous</a>
                                                            }
                                                            
                                                            <a>{pageNo}</a>
                                                            {
                                                                (pageNo >= customLength)
                                                                ?
                                                            <a className="active">Next</a>
                                                            :
                                                            <a className="paginate-link active"onClick={() => getUserPoems(next)}>Next</a>

                                                            }
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                </div>

                                        <div className="tab-pane fade mt-50" id="topic2" role="tabpanel" aria-labelledby="topic2-tab">
                                        
                                                {successState ? <p className={'text-success'}> {successState}</p> : ''}
                                                
                                                    {
                                                        notifications.map(( notification, index) => {
                                                            let image = (notification.image) ? notification.image : "/images/notif-img.png";
                                                            return <>
                                                            <div class="notif_list">
                                                                <div className="row">
                                                                    <div className="col-lg-9 col-sm-9 col-md-9 col-12">
                                                                        <div className="notif_list_box">
                                                                            <div className="notif_image">
                                                                                <img src={ image } alt="" style={{ pointerEvents: 'none' }}/>
                                                                            </div>
                                                                            <div className="noti_info">
                                                                                <h1>{ notification.title }</h1>
                                                                                <p>{ notification.description }</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-3 col-sm-3 col-md-3 col-12">
                                                                        <div className="edit_delete">
                                                                            <h3>{ notification.createdAt }</h3>
                                                                            <p className="delete" onClick={ () => deleteNotificiation(notification.id) }><i className="fa fa-trash-o"></i> </p>
                                                                        </div>
                                                                    </div> 
                                                                </div>
                                                            </div>
                                                                </>
                                                        })
                                                    }

                                                    {
                                                        (notifications.length > 0)
                                                        ?
                                                            <div className="pagination">
                                                            {
                                                                (pageNo <= 1) ?
                                                            <a>Previous</a>
                                                            :
                                                            <a className="paginate-link" onClick={() => getUserNotification(previous)}>Previous</a>
                                                            }
                                                            
                                                            <a>{pageNo}</a>
                                                            {
                                                                (pageNo >= customLength)
                                                                ?
                                                            <a className="active">Next</a>
                                                            :
                                                            <a className="paginate-link active"onClick={() => getUserNotification(next)}>Next</a>

                                                            }
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                
                                        </div>

                                        <div className="tab-pane fade mt-50" id="badges" role="tabpanel" aria-labelledby="badges-tab">
                                        
                                            <div class="notif_list listsartbadgemain">
                                                <div class="switch-field mb-5">
                                                    <input type="radio" id="radio-one" name="switch-one" value="writer" defaultChecked="checked" onClick={()=> { getBadgeList(1) }}/>
                                                    <label for="radio-one">Writer</label>
                                                    <input type="radio" id="radio-two" name="switch-one" value="reader" defaultChecked="" onClick={()=> { getBadgeList(2) }}/>
                                                    <label for="radio-two">Reader</label>
                                                </div>

                                                <div className="row mb-4 listsartbadge">
                                                    
                                                    {
                                                        (badgeList.length > 0) 
                                                        ?
                                                            badgeList.map(badge => {
                                                                return <div className="col-lg-6 col-sm-6 col-md-6 col-12">
                                                                            <div className="notif_list_box">
                                                                                <div className="notif_image badgeboximg">
                                                                                    <img src={badge.image} alt="" />
                                                                                </div>
                                                                                <div className="noti_info">
                                                                                    <h1>{ badge.title }</h1>
                                                                                    <p>{ badge.subTitle }</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                            })
                                                        :
                                                        null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
    </Layout>
}