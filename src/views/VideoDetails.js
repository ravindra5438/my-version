import Layout from "../Layout/Layout";
import {useContext, useEffect, useState} from "react";
import {getVideos, userLike} from "./utilities/ApiCalls";
import {useParams} from "react-router";
import ReactPlayer from 'react-player';
import Constant, { statusFailure } from "./Constant";
import { getTokenDetails } from "./utilities/CommonFunction";
import { Link } from 'react-router-dom';

export default function VideoDetails(props) {
    let { id } = useParams();
    const [video, setVideo] = useState({});
    const [isLike, setLike] = useState(false);
    const [getClipboard, setClipboard] = useState('');
    const [isAccess, setIsAccess] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        let prams = {
            id: id
        };
        let token = sessionStorage.getItem('loginDetails');
        if(token) {
            let userDetails = getTokenDetails(token);
            if(userDetails) {
                prams.user_id = userDetails._id;
            }
        }
        
        getVideos(prams).then((response) => {
            if (response.status !== statusFailure && response.data) {
                setVideo(response.data[0]);
                setIsAccess(response.isAccess);
                if(response.isAccess === false) {
                    setSuccessMessage(response.message);
                }
                if(response.data[0].userLike === 1) {
                    setLike(true);
                }
            }
        })
    }, [isLike]);

    function like(e) {
        e.preventDefault();
        let metaData = {
            "moduleId": video._id,
            "type": 4,
            "user_id": '',
            "title": video.title,
            "description": video.description,
            "thumbnail": video.thumbnail
        }

        userLike(metaData).then(response => {
            if (response.status !== statusFailure && response.data) {
               setLike(response.data.userLike);
            }
        });
    }

        
    const unsecuredCopyToClipboard = (text) => { const textArea = document.createElement("textarea"); textArea.value=text; document.body.appendChild(textArea); textArea.focus();textArea.select(); 
        try {
            document.execCommand('copy');
            setClipboard('Link copied to clipboard');
            setTimeout(function() { setClipboard(''); }, 3000);
        }
        catch(err){
            // console.error('Unable to copy to clipboard',err)
            setClipboard('Unable to copy to clipboard', err);
            setTimeout(function() { setClipboard(''); }, 3000);
        }
        document.body.removeChild(textArea)
    };

    /**
     * Copies the text passed as param to the system clipboard
     * Check if using HTTPS and navigator.clipboard is available
     * Then uses standard clipboard API, otherwise uses fallback
    */
    const copyClipBoard = (content) => {
        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(content);
            setClipboard('Link copied to clipboard');
            setTimeout(function() { setClipboard(''); }, 3000);
        } else {
            unsecuredCopyToClipboard(content);
        }
    };
        

    let videoURL = (video.shortURL) ? video.shortURL : video.videoURL;

    return <>
        <Layout>
            <p className="alertMsgBlackbg text-success">{ getClipboard }</p>
                <section class="single_video_section story_f_page"> 
                    <div class="container position-relative">

                        {
                            (isAccess)
                            ?
                            ''
                            :
                            <div className="overlayboxfor">
                                {successMessage && <div className="alert alert-success" role="alert"> {successMessage} </div>}
                                <div class="theme-button theme-button-overlay"><Link to='/plans' class="default-btn">Buy plan</Link></div>
                            </div>
                        }
                                        
                        <div class="row justify-content-center"> 
                            <div class="col-lg-4 col-sm-4 col-md-4 col-12">
                                <div class="">
                                    <img alt="" src="https://storytent.s3.ap-south-1.amazonaws.com/thumbnail/thumbnail_1672223488215.jpg"></img>
                                </div>
                            </div>
                            <div class="col-lg-8 col-sm-8 col-md-8 col-12">

                                <div class="top_categories_tags">
                                    <div class="single_video">
                                        {/* <iframe width="100%" height="315" src={ video.videoURL} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen controls controlsList="nodownload"></iframe> */}
                                        
                                        <ReactPlayer
                                            controls
                                            // Disable right click
                                            onContextMenu={e => e.preventDefault()}

                                            // Your props
                                            url={ (isAccess) ? videoURL : '' }
                                            className="react-player"
                                            width="100%"
                                            height="315"
                                            // Disable download button
                                            config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                                        />
                                        

                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="main_section">
                                                <div class="row">
                                                <div class="col-lg-8 col-sm-8 col-md-8 col-8">
                                                    <div class="video_info">
                                                        <h1>{ video.title }</h1>
                                                        <span>{ video.categoryName + " " + video.time }</span>
                                                    </div>
                                                </div>
                                               
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-4">
                                                    <div class="share_like">
                                                        <a href="#"><i class='fa fa-eye'></i>{ (video.totalView) ? video.totalView : 0 }</a><a href="#" onClick={ like }><i class={ (isLike) ? 'fa fa-thumbs-up' : 'fa fa-thumbs-o-up' }></i>{ video.likes }</a> <a href="#" onClick={ () => { copyClipBoard(video.shortURL)} }><i class="fa fa-share"></i> Share</a>
                                                    </div>
                                                </div>
                                            </div>
                                            </div> 
                                        </div>
                                    </div>
                                    
                                    <div class="author">
                                        <img src="images/author.png" alt=""/> 
                                    </div>
                                    <div class="video_dec">
                                        {/* <h2>User</h2>
                                        <span>1.2K Followers</span> */}
                                        <p>{ video.description }</p> 
                                    </div>
                                    
                                </div>
                            </div> 
                        </div>
                    </div>
                </section>
        </Layout>
    </>
}