import Layout from "../Layout/Layout";
import {useContext, useEffect, useState} from "react";
import {getAudios, userLike} from "./utilities/ApiCalls";
import {useParams} from "react-router";
import Context from "../Context";
import { statusFailure } from "./Constant";
import { getTokenDetails } from "./utilities/CommonFunction";
import { Link } from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';
import { param } from "jquery";


export default function AudioDetails(props) {
    const {state, dispatch} = useContext(Context);
    let { id } = useParams();
    const [audioObj, setAudio] = useState({});
    const [isLike, setLike] = useState(false);
    const [getClipboard, setClipboard] = useState('');
    const [isAccess, setIsAccess] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');


    useEffect(() => {
        let prams = { id: id };
        
        // get user details
        let token = sessionStorage.getItem('loginDetails');
        if(token) {
            let userDetails = getTokenDetails(token);
            if(userDetails) {
                prams.user_id = userDetails._id;
            }
        }
        getAudios(prams).then((response) => {
            setAudio(response.data[0]);
            setIsAccess(response.isAccess);
            if(response.isAccess === false) {
                setSuccessMessage(response.message);
            }
            if(response.data[0].userLike === 1) {
                setLike(true);
            }
        })

    }, [isLike]);

    function like(e) {
        e.preventDefault();
        let metaData = {
            "moduleId": audioObj._id,
            "type": 3,
            "user_id": '',
            "title": audioObj.title,
            "description": audioObj.description,
            "thumbnail": audioObj.thumbnail
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

    let audioURL = (audioObj.shortURL) ? audioObj.shortURL : audioObj.audioURL;
    
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
                        
                        <div className="row">
                            <div className="col-lg-4 col-sm-4 col-md-4 col-12">
                                <div className="">
                                    <img src={audioObj.thumbnail} alt="" style={{ pointerEvents: 'none' }}/>
                                </div>
                            </div>
                            <div class="col-lg-8 col-sm-8 col-md-8 col-12">
                                <div class="top_categories_tags">
                                    <div class="single_video">
                                        <ReactAudioPlayer
                                            controls
                                            // Disable download button
                                            controlsList="nodownload"
                                            // Disable right click
                                            onContextMenu={e => e.preventDefault()}

                                            // Your props
                                            src={ (isAccess) ? audioURL : '' }
                                        />
                                    
                                        
                                    
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="main_section">
                                                <div class="row">
                                                <div class="col-lg-8 col-sm-8 col-md-8 col-8">
                                                    <div class="video_info">
                                                        <h1>{ audioObj.title }</h1>
                                                        <span>{ audioObj.categoryName + " " + audioObj.time }</span>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-4">
                                                    <div class="share_like">
                                                        <a href="#" onClick={ like }><i class={ (isLike) ? 'fa fa-thumbs-up' : 'fa fa-thumbs-o-up' }></i>{ audioObj.likes }</a> <a href="#" onClick={ () => { copyClipBoard(audioObj.shortURL)} }><i class="fa fa-share"></i> Share</a>
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
                                        <p>{ audioObj.description }</p> 
                                    </div>
                                    
                                </div>
                            </div> 
                        </div>
                    </div>
                </section>
        </Layout>
    </>
}