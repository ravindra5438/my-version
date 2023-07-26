// import package and components

import React, {Component, useEffect, useReducer, useState} from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import UserAccess from './UserAccess';
import FAQ from './views/FAQ';
import PrivacyPolicy from './views/PrivacyPolicy';
import CookiesPolicy from './views/CookiesPolicy';
import AboutUS from './views/AboutUS';
import UpdateUserProfile from './views/UpdateUserProfile';
import Login from './views/Login';
import TermCondition from './views/TermCondition';
import PageNotFound from './views/Error/Page-404';
import Home from "./views/Home";
import Context from "./Context";
import Forgot from "./views/Forgot";
import Register from "./views/Register";
import UserType from "./views/UserType";
import UpdatePassword from "./views/UpdatePassword";
import Stories from "./views/Stories";
import StoryCreate from "./views/Story/StoryCreate";
import Plan from "./views/Plan";
import Poems from "./views/Poems";
import PoemCreate from "./views/Poem/PoemCreate";
import WhoWeAre from "./views/WhoWeAre";
import WhatWeDo from "./views/WhatWeDo";
import OurVision from "./views/OurVision";
import OurTeam from "./views/OurTeam";
import Profile from "./views/Profile";
import Videos from "./views/Videos";
import Movies from "./views/Movies";
import Audios from "./views/Audios";
import {getProfileDetails} from "./views/utilities/ApiCalls";
import {statusFailure} from "./views/Constant";
import StoryDetails from "./views/StoryDetails";
import PoemDetails from "./views/PoemDetails";
import VideoDetails from './views/VideoDetails';
import MoviesDetails from './views/MoviesDetails';
import AudioDetails from './views/AudioDetails';
import Contest from './views/Contest';
import Thumbnail from './views/Thumbnail';

/* End */

function reducer(state, {payload, type}) {
    switch (type) {
        case 'login':
            sessionStorage.setItem('loginDetails', payload);
            return {
                ...state,
                token: payload
            };
        case 'logout':
            sessionStorage.removeItem('loginDetails');
            
            return {
                ...state,
                token: null,
                user:{},
                isPrime:false
            };
        case 'user':
            return {
                ...state,
                user: payload
            }
        case 'isPrime':
            return {
                ...state,
                isPrime: !!payload
            }
        default:
            return state;
    }
}


export  default  function App (){
    let token = sessionStorage.getItem('loginDetails');

    const [state, dispatch] = useReducer(reducer, {
        token,
        user:{},
        isPrime:false,
    } );

    useEffect(() => {
        if (!state.token) return
        getProfileDetails().then((response) => {
            console.log('response',response.data)
            if (response.status !== statusFailure) {
                dispatch({type: 'user', payload: response.data});
            } else {
                dispatch({type: 'user', payload: {}});
                console.log(response.message);
            }
        })
    }, []);


    useEffect(() => {
         if (state.isPrime ) {
             dispatch({type: 'isPrime', payload: true});
         }else{
             dispatch({type: 'isPrime', payload: false});
         }
    }, [state.user]);

    return (
            <Context.Provider value={{state, dispatch}}>
                <Router>
                    <Switch>
                        <Route exact strict path="/" component={Home}/>
                        <Route exact strict path="/about-us" component={AboutUS}/>
                        <Route exact strict path="/who-we-are" component={WhoWeAre}/>
                        <Route exact strict path="/what-we-do" component={WhatWeDo}/>
                        <Route exact strict path="/our-vision" component={OurVision}/>
                        <Route exact strict path="/our-partner" component={OurTeam}/>
                        <Route exact strict path="/faqs" component={FAQ}/>

                        <Route exact strict path="/register" component={Register}/>
                        <Route exact strict path="/login" component={Login}/>
                        <Route exact strict path="/forgot" component={Forgot}/>
                        <Route exact strict path="/" component={Forgot}/>
                        <UserAccess exact strict path="/plans" component={Plan}/>
                        <Route exact strict path="/term-condition" component={TermCondition}/>
                        <Route exact strict path="/stories" component={Stories}/>
                        <Route exact strict path="/story-details/:id" component={StoryDetails}/>
                        <Route exact strict path="/videos" component={Videos}/>
                        <Route exact strict path="/movies" component={Movies}/>
                        <Route exact strict path="/audios" component={Audios}/>
                        <UserAccess exact strict path="/story-create" component={StoryCreate}/>
                        <UserAccess exact strict path="/update-story" component={StoryCreate}/>
                        <Route exact strict path="/poems" component={Poems}/>
                        <Route exact strict path="/poem-details/:id" component={PoemDetails}/>
                        <UserAccess exact strict path="/poem-create" component={PoemCreate}/>
                        <UserAccess exact strict path="/update-poem" component={PoemCreate}/>

                        <UserAccess exact strict path="/user-type" component={UserType}/>
                        <UserAccess exact strict path="/update-password" component={UpdatePassword}/>
                        <UserAccess exact strict path="/profile/:userId" component={Profile}/>

                        <UserAccess exact strict path="/location" component={Location}/>
                        <UserAccess exact strict path="/update-profile" component={UpdateUserProfile}/>

                        
                        <Route exact strict path="/privacy-policy" component={PrivacyPolicy}/>
                        <Route exact strict path="/cookies-policy" component={CookiesPolicy}/>
                        <UserAccess exact strict path="/video-details/:id" component={VideoDetails} />
                        <UserAccess exact strict path="/movies-details/:id" component={MoviesDetails} />
                        <UserAccess exact strict path="/audio-details/:id" component={AudioDetails} />
                        <UserAccess exact strict path="/contest/:type" component={Contest} />
                        <UserAccess exact strict path="/select-thumbnail/:type" component={Thumbnail} />

                        {/* <Route path="*" component={PageNotFound} /> */}

                    </Switch>
                </Router>
            </Context.Provider>

        )

}
