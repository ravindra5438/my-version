import Layout from "../Layout/Layout";
import {Link} from "react-router-dom";
import React , {useEffect, useState, useContext} from "react";
import OwlCarousel from 'react-owl-carousel';
import {useHistory} from "react-router";
import Context from "../Context";

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { getProfileDetails } from './utilities/ApiCalls';
import { getTokenDetails } from "./utilities/CommonFunction";

// library for popup
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../../src/css/style.css';


const Axios = require("axios");
const cookie = require('js-cookie');

const Constant = require("../../src/views/Constant");

const options = {
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
        },
        400: {
            items: 1,
        },
        600: {
            items: 1,
        },
        700: {
            items: 2,
        },
        1000: {
            items: 3
        }
    },
};

export default function Home() {
    const [bannerList, setBannerList] = useState([]);
    const [ videoList, setVideoList] = useState([]);
    const [ storyList, setStoryList ] = useState([]);
    const [ audioList, setAudioList ] = useState([]);
    const [ moviesList, setMoviesList ] = useState([]);
    const [ poemList, setPoemList ] = useState([]);
    const [ contestList, setContestList ] = useState([]);
    const [isLodding, setIsLodding] = useState(true);
    const history = useHistory();
    const [getClipboard, setClipboard] = useState('');
    const [ getEventList, setEventList ] = useState([]); 
    const {state, dispatch} = useContext(Context);
    const [audioAccess, setAudioAccess] = useState(0);
    const [videoAccess, setVideoAccess] = useState(0);
    // popup state
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    useEffect( async () => {

        let metaData = {};
        let token = sessionStorage.getItem('loginDetails');
        if(token) {
            let userDetails = getTokenDetails(token);
            if(userDetails) {
                metaData.userId = userDetails._id;
            }
        }
        let response = await Axios.post(Constant.apiBasePath + 'home/pageData', metaData, {  headers: { 'token': token } });
        let data = response.data;
        if(data.status === Constant.statusSuccess) {
            let { bannerList, videoList, storyList, moviesList, audioList, poemList, contestList, eventList, audioAccess, videoAccess } = data.data;
            setBannerList(bannerList);
            setVideoList(videoList);
            setStoryList(storyList);
            setMoviesList(moviesList);
            setAudioList(audioList);
            setPoemList(poemList);
            setContestList(contestList);
            setEventList(eventList);
            setAudioAccess(audioAccess);
            setVideoAccess(videoAccess);
            setIsLodding(false);
        }

        // verify cookies
        if(!cookie.get('user_auth')) {
            window.$('#cookiesModal').modal('show');
        }
      
    }, []);
    

    function redirectOnCreateStory() {
        window.$('#startwritingModal').modal("hide");
        history.push('/story-create');
    }

    function redirectOnCreatePoem() {
        window.$('#startwritingModal').modal("hide");
        history.push('/poem-create');
    }

    function redirectOnReadingStory() {
        window.$('#startreadingModal').modal("hide");
        history.push('/stories');
    }

    function redirectOnReadingPoem() {
        window.$('#startreadingModal').modal("hide");
        history.push('/poems');
    }

    function copyClipBoard(url) {
        let textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setClipboard('Link copied to clipboard');
          setTimeout(function() { setClipboard(''); }, 3000);
        } catch (err) {
          setClipboard('Unable to copy to clipboard', err);
          setTimeout(function() { setClipboard(''); }, 3000);
        }
        document.body.removeChild(textArea);
    }

    function saveCookies() {
        let token = sessionStorage.getItem('loginDetails');
        cookie.set('user_auth', token, { sameSite: 'strict' });
        window.$('#cookiesModal').modal('hide');
    }

    function closeModelAndRedirect() {
        window.$('#homeSubscriptionPlanModal').modal('hide');
        history.push('/plans');
    }

    return (
        <Layout>
            {/* Start Banner Section */}

            <section class="banner_section">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-6 col-sm-6 col-md-6 col-12 order_2">
                            <div class="slider_info">
                                {/* <h1>Word most-loved social platform</h1> */}
                                <h2>Bring <span className="text-red">Stories</span> to <div className="text-red sliderCurveText">Life</div></h2>
                                <p>Every story is a magical seed with potential to grow into massive trees with branches as varied as the minds reading the stories.</p>
                                <div class="about_button">
                                    <div class="theme-button1 mr-4">
                                        <a data-toggle="modal" data-target="#startwritingModal" href="#" class="default-btn">Start Writing</a>
                                        {/* <Link to="/story-create" class="default-btn">Start Writing</Link> */}
                                    </div>
                                    <div class="theme-button1">
                                        <a data-toggle="modal" data-target="#startreadingModal" href="#" class="default-btn">Start Reading</a>
                                        {/* <Link to="/stories" class="default-btn">Start Reading</Link> */}
                                        {/* <Link to="/stories" class="default-btn">Start Reading</Link> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal fade" id="startwritingModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-sm" role="document">
                            <div class="modal-content startPopup">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Start Writing</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="theme-button">
                                        <a class="default-btn" onClick={redirectOnCreateStory}>Stories</a>
                                        <a class="default-btn" onClick={redirectOnCreatePoem}>Poems</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div class="modal fade" id="startreadingModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-sm" role="document">
                            <div class="modal-content startPopup">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Start Reading</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="theme-button">
                                        <a class="default-btn" onClick={redirectOnReadingStory}>Stories</a>
                                        <a class="default-btn" onClick={redirectOnReadingPoem}>Poems</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>

                        {/* Accept Cookies */}

                        {
                            (sessionStorage.getItem('loginDetails'))
                            ?
                                <div class="modal fade" id="cookiesModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-top modal-lg" role="document">
                                        <div class="modal-content startPopup">
                                            <div class="modal-header">
                                                <p>Cookie text is the message on a website to inform users about cookies and for what purpose they are used.  Accept cookies and term and conditions.</p>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="theme-button pull-right">
                                                    <button type="button" className="btn btn-primary" onClick={saveCookies}>Accept & Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                            ''
                        }

                        {/* End Cookies */}

                        <div class="col-lg-6 col-sm-6 col-md-6 col-12 order_1">
                            <div class="slider_image">
                                <div id="demo" class="carousel slide" data-ride="carousel"> 
                                    {/* Indicators  */}
                                    {/* The slideshow */}
                                    <div class="carousel-inner">
                                        { 
                                            (bannerList.length > 0)
                                            ?
                                                bannerList.map((el, index) => {
                                                    return <div className={index!==0 ?"carousel-item" : "carousel-item active"}>
                                                                <img src={el.image} alt=" "/>
                                                                <div class="slider_content">
                                                                    <h2>{ el.name }</h2>
                                                                    <p>{ el.description }</p>
                                                                </div>
                                                            </div>
                                                })
                                            :
                                            ''
                                        }
                                    </div>

                                    {/* Left and right controls */}
                                    <a class="carousel-control-prev" href="#demo" data-slide="prev">
                                            <div class="left">
                                                <span class="carousel-control-prev-icon"></span>
                                            </div>
                                    </a>
                                    <a class="carousel-control-next" href="#demo" data-slide="next">
                                        <div class="left">
                                            <span class="carousel-control-next-icon"></span> 
                                        </div>
                                    </a> 

                                </div>
                            </div> 
                        </div>
                    </div>
                </div> 
            </section>

            {/* End Banner Section */}

            {/* Start Event Section */}
            
            <section>
                <div className="container">
                    <div className="heading_title mb-20">
                        <h1>Upcoming Events</h1>
                    </div>
                <div className="row justify-content-center">
                            <div className="col-lg-12">
                    <div className="upcoming-event">

                    {
                        isLodding ? "" :
                        
                                <OwlCarousel className="owl-slider" margin={10} autoplay={true} responsiveClass={true}
                                    dots={true} autoplayTimeout={7000}
                                    smartSpeed={800}
                                    nav={false}
                                    navText={["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]}
                                    responsive={{
                                        0: {
                                            items: 1
                                        },

                                        768: {
                                            items: 1
                                        },

                                        1024: {
                                            items: 1
                                        },

                                        1366: {
                                            items: 1
                                        }
                                    }}

                                >
                                    {getEventList.map((item, index) => <div className="item" key={item._id}>
                                            <div className="row align-items-center">
                                                <div className="col-lg-3 col-md-3 col-sm-3 col-12">
                                                    <div className="eventleftbox">
                                                        <img src="images/megaphone-img.png"></img>
                                                    </div>
                                                    
                                                </div>
                                            <div className="col-lg-7 col-md-7 col-sm-9 col-12">
                                            <div className="on_going_box">
                                                
                                                <h1>{item.name}</h1>
                                                <div className="creative_box d-flex">
                                                    <div className="eventdate"><span><i class="bi bi-calendar4"></i></span>{ " " + item.date.split('T')[0]}</div>
                                                    <div className="eventadd"><span><i class="bi bi-geo-alt"></i></span>{" " + item.venue}</div>
                                                   
                                                </div>
                                            
                                            
                                            </div>
                                            </div>
                                            </div>
                                        </div>
                                    )}
                                </OwlCarousel>
                            
                    }
                            </div>
                        </div>
                    </div> 
                </div>
            </section> 

           {/* End Event Section */}


            {/* Start Story Section */}

            <section class="video_gallery_section">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div class="heading_title mb-10">
                                <h1>Stories </h1>
                            </div>
                            {/* <div class="tabs_div">
                                <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all"
                                    aria-selected="true">All</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="topic1-tab" data-toggle="tab" href="#topic1" role="tab" aria-controls="topic1"
                                    aria-selected="false">Topic 1</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="topic2-tab" data-toggle="tab" href="#topic2" role="tab" aria-controls="topic2"
                                    aria-selected="false">Topic 2</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="topic3-tab" data-toggle="tab" href="#topic3" role="tab" aria-controls="topic3"
                                    aria-selected="false">Topic 3</a>
                                </li>
                                    <li class="nav-item">
                                    <a class="nav-link" id="topic4-tab" data-toggle="tab" href="#topic4" role="tab" aria-controls="topic4"
                                    aria-selected="false">Topic 4</a>
                                </li>
                                </ul> 
                            </div> */}
                        </div>
                        <div class="col-lg-12">
                            <div class="tab-content" id="myTabContent">
                                <div class="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab"> 
                                    <div class="videos_gallery">
                                        
                                        <ul>
                                        <OwlCarousel className="owl-slider" margin={10} autoplay={true} responsiveClass={true}
                                            dots={true} autoplayTimeout={7000}
                                            smartSpeed={800}
                                            nav={false}
                                            navText={["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]}
                                            responsive={{
                                                0: {
                                                    items: 2
                                                },

                                                768: {
                                                    items: 3
                                                },

                                                1024: {
                                                    items: 5
                                                },

                                                1366: {
                                                    items: 5
                                                }
                                            }}

                            >
                                            {
                                                (storyList.length > 0) 
                                                ?
                                                    storyList.map(el => {
                                                        let str = el.description;
                                                        let description = str;
                                                        if(str.length > 60) {
                                                            description = el.description.substring(0, 60) + '...';
                                                        }
                                                        return <li> 
                                                            {(!sessionStorage.getItem('loginDetails') ? 
                                                             <span>
                                                                <img src={ el.thumbnail } alt=""/>
                                                                <div class="gallery_info">
                                                                    <h2>{ el.name }</h2>
                                                                    <p>{ description }</p>
                                                                </div>
                                                             </span> : 
                                                                <Link to={`/story-details/` + el._id}>
                                                                <img src={ el.thumbnail } alt=""/>
                                                                <div class="gallery_info">
                                                                    <h2>{ el.name }</h2>
                                                                    <p>{ description }</p>
                                                                </div>
                                                            </Link> 
                                                            )}
                                                            
                                                        </li>
                                                    })
                                                :
                                                   null
                                            }
                                            </OwlCarousel>
                                        </ul>
                                    </div>  
                                </div> 
                                {/* <div class="tab-pane fade" id="topic1" role="tabpanel" aria-labelledby="topic1-tab">
                                    <div class="videos_gallery">
                                        <ul>
                                            <li> 
                                                <a href="#">
                                                    <img src="images/video-gallery.png" alt=""/>
                                                    <div class="gallery_info">
                                                        <h2>The rise of sun</h2>
                                                        <p>This is a nature lover, who protect the forests from........</p>
                                                    </div>
                                                </a> 
                                            </li>
                                            <li> 
                                                <a href="#">
                                                <img src="images/video-gallery-1.png" alt=""/>
                                                <div class="gallery_info">
                                                    <h2>The rise of sun</h2>
                                                    <p>This is a nature lover, who protect the forests from........</p>
                                                </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>  
                                
                                </div>
                                <div class="tab-pane fade" id="topic2" role="tabpanel" aria-labelledby="topic2-tab"> 
                                    <div class="videos_gallery">
                                        <ul>
                                            <li> 
                                                <a href="#">
                                                    <img src="images/video-gallery.png" alt=""/>
                                                    <div class="gallery_info">
                                                        <h2>The rise of sun</h2>
                                                        <p>This is a nature lover, who protect the forests from........</p>
                                                    </div>
                                                </a> 
                                            </li>
                                            <li> 
                                                <a href="#">
                                                <img src="images/video-gallery-9.png" alt=""/>
                                                <div class="gallery_info">
                                                    <h2>The rise of sun</h2>
                                                    <p>This is a nature lover, who protect the forests from........</p>
                                                </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>  
                                
                                </div> */}
                            </div>
                        </div>
                        <div class="col-lg-12 text-center mt-20">
                            <div class="theme-button1">
                                <Link to="/stories" class="default-btn">View All</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section> 

            {/* End Story Section */}

            {/* Start Poem Section */}

            <section class="video_gallery_section mt-4">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div class="heading_title mb-10">
                                <h1>Poems </h1>
                            </div>
                            {/* <div class="tabs_div">
                                <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all"
                                    aria-selected="true">All</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="topic1-tab" data-toggle="tab" href="#topic1" role="tab" aria-controls="topic1"
                                    aria-selected="false">Topic 1</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="topic2-tab" data-toggle="tab" href="#topic2" role="tab" aria-controls="topic2"
                                    aria-selected="false">Topic 2</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="topic3-tab" data-toggle="tab" href="#topic3" role="tab" aria-controls="topic3"
                                    aria-selected="false">Topic 3</a>
                                </li>
                                    <li class="nav-item">
                                    <a class="nav-link" id="topic4-tab" data-toggle="tab" href="#topic4" role="tab" aria-controls="topic4"
                                    aria-selected="false">Topic 4</a>
                                </li>
                                </ul> 
                            </div> */}
                        </div>
                        <div class="col-lg-12">
                            <div class="tab-content" id="myTabContent">
                                <div class="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab"> 
                                    <div class="videos_gallery">
                                        <ul>
                                        <OwlCarousel className="owl-slider" margin={10} autoplay={true} responsiveClass={true}
                                            dots={true} autoplayTimeout={7000}
                                            smartSpeed={800}
                                            nav={false}
                                            navText={["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]}
                                            responsive={{
                                                0: {
                                                    items: 2
                                                },

                                                768: {
                                                    items: 3
                                                },

                                                1024: {
                                                    items: 5
                                                },

                                                1366: {
                                                    items: 5
                                                }
                                            }}

                            >
                                            {
                                                (poemList.length > 0) 
                                                ?
                                                    poemList.map(el => {
                                                        let str = el.description;
                                                        let description = str;
                                                        if(str.length > 60) {
                                                            description = el.description.substring(0, 60) + '...';
                                                        }
                                                        return <li> 
                                                             {(!sessionStorage.getItem('loginDetails') ? 
                                                             <span>
                                                             <img src={ el.thumbnail } alt=""/>
                                                                <div class="gallery_info">
                                                                    <h2>{ el.name }</h2>
                                                                    <p>{ description }</p>
                                                                </div>
                                                          </span> :
                                                            <Link to={`/poem-details/` + el._id} href="#">
                                                                <img src={ el.thumbnail } alt=""/>
                                                                <div class="gallery_info">
                                                                    <h2>{ el.name }</h2>
                                                                    <p>{ description }</p>
                                                                </div>
                                                            </Link> )}
                                                        </li>
                                                    })
                                                :
                                                   null
                                            }
                                            </OwlCarousel>
                                        </ul>
                                    </div>  
                                </div> 
                                {/* <div class="tab-pane fade" id="topic1" role="tabpanel" aria-labelledby="topic1-tab">
                                    <div class="videos_gallery">
                                        <ul>
                                            <li> 
                                                <a href="#">
                                                    <img src="images/video-gallery.png" alt=""/>
                                                    <div class="gallery_info">
                                                        <h2>The rise of sun</h2>
                                                        <p>This is a nature lover, who protect the forests from........</p>
                                                    </div>
                                                </a> 
                                            </li>
                                            <li> 
                                                <a href="#">
                                                <img src="images/video-gallery-8.png" alt=""/>
                                                <div class="gallery_info">
                                                    <h2>The rise of sun</h2>
                                                    <p>This is a nature lover, who protect the forests from........</p>
                                                </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>  
                                
                                </div>
                                <div class="tab-pane fade" id="topic2" role="tabpanel" aria-labelledby="topic2-tab"> 
                                    <div class="videos_gallery">
                                        <ul>
                                            <li> 
                                                <a href="#">
                                                    <img src="images/video-gallery.png" alt=""/>
                                                    <div class="gallery_info">
                                                        <h2>The rise of sun</h2>
                                                        <p>This is a nature lover, who protect the forests from........</p>
                                                    </div>
                                                </a> 
                                            </li>
                                            <li> 
                                                <a href="#">
                                                <img src="images/video-gallery-9.png" alt=""/>
                                                <div class="gallery_info">
                                                    <h2>The rise of sun</h2>
                                                    <p>This is a nature lover, who protect the forests from........</p>
                                                </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>  
                                
                                </div> */}
                            </div>
                        </div>
                        <div class="col-lg-12 text-center mt-20">
                            <div class="theme-button1">
                                <Link to="/poems" class="default-btn">View All</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section> 

            {/* End Poem Section */}

            {/* Start Audio Section */}

            <section>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-6 col-sm-5 col-md-6 col-12">
                            <div class="audio_image">
                                <img src="images/audio_image.png" alt=""/>
                            </div>
                        </div>
                        
                        <div class="col-lg-6 col-sm-7 col-md-6 col-12">
                            <div class="audio_content">
                                <div className="row mb-20 mt-20">
                                    <div className="col-lg-10 col-sm-10 col-md-10 col-9">
                                        <div class="heading_title">
                                            <h1>Audio Notes </h1>
                                            {
                                                (audioAccess)
                                                ?
                                                null
                                                : 
                                                <span><img src="images/star-icon.png" alt=""/>Only for Premium user</span>
                                            }
                                        </div>
                                    </div>
                                    <div class="col-lg-2 col-sm-2 col-md-2 col-3">
                                        <div class="view_all">
                                            <Link to="/audios">View All</Link>
                                        </div>
                                    </div>
                                </div>
                                <OwlCarousel className='owl-theme' {...options} loop={false} autoplay={true} margin={10} nav={true} >
                                    
                                    { 
                                        (audioList.length > 0)
                                        ?
                                        audioList.map(el => {
                                            let str = el.description;
                                            let description = str;
                                            if(str.length > 60) {
                                                description = el.description.substring(0, 60) + '...';
                                            }
                                            return  <div class="recent-items">
                                                        <div class="music_main">
                                                            <div class="top_content">
                                                                <h2>{ el.title }</h2>
                                                                <p>{ description }</p>
                                                            </div>
                                                            <div class="music_line">
                                                                <img src="images/music-line.png" alt=""/>
                                                            </div>
                                                            <img src={ el.thumbnail } alt=""/>
                                                            <div class="bottom_button">
                                                                <Link to={`/audio-details/${el._id}`}><i class="fa fa-headphones"></i> Listen now</Link>
                                                            </div>
                                                        </div>
                                                        <div class="bottom_info"> 
                                                        {/* <p>User name <i class="icofont-check-alt"></i> </p>    */}
                                                        <div class="like_days">
                                                            <h3><i class="fa fa-thumbs-o-up"></i>{ el.likes.length }
                                                            {/* <span>414k Followers</span>  */}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                        })
                                        :
                                        null
                                    }  

                                </OwlCarousel>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
                
            {/* End Audio Section */}

            {/* Start Video Section */}

            <section class="videos_section">
                <div class="container">
                    <div class="row mb-20">
                        <div class="col-lg-10 col-sm-10 col-md-10 col-9">
                            <div class="heading_title">
                                <h1>Videos </h1>
                                {
                                    (videoAccess)
                                    ?
                                    null
                                    : 
                                    <span><img src="images/star-icon.png" alt=""/>Only for Premium user</span>
                                }
                            </div>
                            <p className="text-success">{ getClipboard }</p>
                        </div>
                        <div class="col-lg-2 col-sm-2 col-md-2 col-3">
                            <div class="view_all">
                                <Link to="/videos">View All</Link>
                            </div>
                        </div>
                    </div>
                    
                    <OwlCarousel className="owl-slider" margin={20} autoplay={true} responsiveClass={true}
                                            dots={true} autoplayTimeout={7000}
                                            smartSpeed={800}
                                            nav={false}
                                            navText={["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]}
                                            responsive={{
                                                0: {
                                                    items: 1
                                                },

                                                768: {
                                                    items: 2
                                                },

                                                1024: {
                                                    items: 3
                                                },

                                                1366: {
                                                    items: 3
                                                }
                                            }}

                            >
                    {
                            (videoList.length > 0)
                            ?
                                videoList.map(el => {
                                    
                                    return <div>
                                        <div class="videos_list">
                                            <div class="time">
                                                <span>{ el.duration }</span>
                                            </div> 
                                            <div class="video_image">
                                                <img src={ el.thumbnail } alt=""/>
                                                <div class="play_btn">
                                                    <Link to={`/video-details/${el._id}`}><i class="icofont-ui-play"></i></Link>
                                                </div>
                                            </div> 
                                            <div class="video_info"> 
                                                <div class="row">
                                                    <div class="col-lg-9 col-sm-8 col-md-8 col-9">
                                                        <div class="content_box"> 
                                                            <img src={ el.thumbnail } alt="" />
                                                                <div class="video_details">
                                                                    <h2>{ el.title }</h2>
                                                                    <p>{ el.categoryName }<i class="icofont-check-alt"></i> </p>   
                                                                    <div class="like_days">
                                                                        <h3><i class="fa fa-thumbs-o-up"></i> { el.likes.length } <span>{ el.time }</span> </h3>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-3 col-sm-4 col-md-4 col-3">
                                                        <div class="share">
                                                            <a class=" share_icon" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={()=> {copyClipBoard(el.videoURL)}}>
                                                                <i class="icofont-share"></i> </a>
                                                            {/* <div class="">  
                                                                <div class="dropdown-menu dropdown-menu-right dropdown-menu-social">
                                                                    <a class="dropdown-item social-facebook mb-1" href="#"><i class="icofont-facebook"></i></a>
                                                                    <a class="dropdown-item social-twitter mb-1" href="#"><i class="icofont-twitter"></i></a>
                                                                    <a class="dropdown-item social-youtube mb-1" href="#"><i class="icofont-youtube"></i></a>

                                                                    <a class="dropdown-item social-instagram" href="#"><i class="icofont-instagram"></i></a>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div> 
                                            </div>
                                        </div>
                                    </div>
                                })
                            :
                            ''
                        }
                        </OwlCarousel>
                    </div>
                    
            </section>

            {/* End Video Section */}

            {/* Start Movies Section */}

            {/* <section class="videos_section">
                <div class="container">
                    <div class="row mb-20">
                        <div class="col-lg-10 col-sm-10 col-md-10 col-9">
                            <div class="heading_title">
                                <h1>Movies </h1><span><img src="images/star-icon.png" alt=""/> </span> <span>Only for Premium user</span>
                            </div>
                        </div>
                        <div class="col-lg-2 col-sm-2 col-md-2 col-3">
                            <div class="view_all">
                                <Link to="/movies">View All</Link>
                            </div>
                        </div>
                    </div>
                    <OwlCarousel className="owl-slider" margin={20} autoplay={true} responsiveClass={true}
                                            dots={true} autoplayTimeout={7000}
                                            smartSpeed={800}
                                            nav={false}
                                            navText={["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]}
                                            responsive={{
                                                0: {
                                                    items: 1
                                                },

                                                768: {
                                                    items: 2
                                                },

                                                1024: {
                                                    items: 3
                                                },

                                                1366: {
                                                    items: 3
                                                }
                                            }}

                            >
                    {
                            (moviesList.length > 0)
                            ?
                                moviesList.map(el => {
                                    return <div>
                                        <div class="videos_list">
                                            <div class="time">
                                                <span>{ el.duration }</span>
                                            </div> 
                                            <div class="video_image">
                                                <img src={ el.thumbnail } alt=""/>
                                                <div class="play_btn">
                                                    <Link to="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icofont-ui-play"></i></Link>
                                                </div>
                                            </div> 
                                            <div class="video_info"> 
                                                <div class="row">
                                                    <div class="col-lg-9 col-sm-8 col-md-8 col-9">
                                                        <div class="content_box"> 
                                                            <img src={ el.thumbnail } alt="" />
                                                                <div class="video_details">
                                                                    <h2>{ el.title }</h2>
                                                                    <p>{ el.categoryName }<i class="icofont-check-alt"></i> </p>   
                                                                    <div class="like_days">
                                                                        <h3><i class="fa fa-thumbs-o-up"></i> { el.likes.length } <span>{ el.time }</span> </h3>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-3 col-sm-4 col-md-4 col-3">
                                                        <div class="share">
                                                            <a class=" share_icon" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={()=> {copyClipBoard(el.moviesURL)}}>
                                                                <i class="icofont-share"></i> </a>
                                                        </div>
                                                    </div>
                                                </div> 
                                            </div>
                                        </div>
                                    </div>
                                })
                            :
                            ''
                        }
                    </OwlCarousel>
                </div>
            </section> */}

            {/* End Movies Section */}

            {/* Start Contest Section */}

            <div className="container on_going_main">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <div className="heading_title mb-20">
                            <h1>On-Going Contests </h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="on_going_section">
                <div className="container">

                    {
                        isLodding ? "" :
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                            <OwlCarousel className="owl-slider" margin={10} autoplay={true} responsiveClass={true}
                                            dots={false} autoplayTimeout={7000}
                                            smartSpeed={800}
                                            nav={true}
                                            navText={["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]}
                                            responsive={{
                                                0: {
                                                    items: 1
                                                },

                                                768: {
                                                    items: 1
                                                },

                                                1024: {
                                                    items: 1
                                                },

                                                1366: {
                                                    items: 1
                                                }
                                            }}

                            >
                                {contestList.map((item, index) => <div className="item" key={item._id}>
                                        <div className="on_going_box">
                                            <div className="creative_box">
                                                <div className="contact_id">
                                                    <span>Contest Id: {item._id}</span>
                                                </div>
                                                <h1>{item.name}</h1>
                                            </div>
                                            <div className="bg_blue_dark">
                                                <img src={item.image} alt={`img_${item._id}`} />
                                            </div>
                                            <p>{item.about}</p>
                                            <div className="button_box row d-flex justify-content-between">
                                                <Link className="col-5" to={`/story-create?contest=${item._id}`}>Participate in Story</Link>
                                                <Link className="col-5 ml-2" to={`/poem-create?contest=${item._id}`}>Participate in Poem</Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </OwlCarousel>
                            </div>
                        </div>
                    }
                        
                </div>
            </section> 

        {/* End Contest Section */}

        {/* Start Testomonial Section*/}

            <section class="testimonial_section">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12  text-center">
                            <div class="heading_title mb-30">
                                <h1>Testimonial </h1>  
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                    <div class="col-lg-7 col-sm-12 col-md-12 col-12 white_bg text-center">
                        <div id="testimonial-slider" class="owl-carousel">
                            <div class="recent-items">
                                    <div class="testimonial_box">
                                        <div class="box_info">
                                            <h2>Inventore vel alias consequatur nihil maiores voluptate enim ea deleniti.</h2>
                                            <p>Sherri Cronin</p>
                                            <span>Dynamic Program Designer</span>
                                        </div>
                                        <div class="testimonial_img">
                                            <img src="images/Image.png" alt=""/>
                                        </div>
                                    </div>
                            </div> 
                            <div class="recent-items">
                                    <div class="testimonial_box">
                                        <div class="box_info">
                                            <h2>Inventore vel alias consequatur nihil maiores voluptate enim ea deleniti.</h2>
                                            <p>Sherri Cronin</p>
                                            <span>Dynamic Program Designer</span>
                                        </div>
                                        <div class="testimonial_img">
                                            <img src="images/Image.png" alt=""/>
                                        </div>
                                    </div>
                            </div> 
                        </div> 
                        </div>
                    </div>
                </div>
            </section>

        {/* End Testomonial Section */}


        <div class="modal fade" id="homeReirectionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1" aria-hidden="true">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content startPopup">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel1">Authentication required.</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Please login to access detail mode</p>
                        <div class="theme-button">
                            <Link to="/login" class="default-btn btn-sm">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           Please login to see details view
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <div class="theme-button">
          <Link to="/login" class="default-btn"> Login </Link>
          </div>
        </DialogActions>
      </Dialog>

        {/* End modal */}

        </Layout>
    )
}