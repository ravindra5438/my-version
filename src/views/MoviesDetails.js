import Layout from "../Layout/Layout";
import {useContext, useEffect, useState} from "react";
import {getMovies, userLike} from "./utilities/ApiCalls";
import {useParams} from "react-router";
import ReactPlayer from 'react-player';

import Context from "../Context";
import { statusFailure } from "./Constant";

export default function MoviesDetails(props) {
    const {state, dispatch} = useContext(Context);
    let { id } = useParams();
    const [movies, setMovies] = useState({});
    const [isLike, setLike] = useState(false);
    const [getClipboard, setClipboard] = useState('');
    
    useEffect(() => {
        let prams = {
            id: id
        };
        getMovies(prams).then((response) => {
            setMovies(response.data[0]);
            if(response.data[0].userLike === 1) {
                setLike(true);
            }
        })
    }, [isLike]);

    function like(e) {
        e.preventDefault();
        let metaData = {
            "moduleId": movies._id,
            "type": 5,
            "user_id": '',
            "title": movies.title,
            "description": movies.description,
            "thumbnail": movies.thumbnail
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

const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  const onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

    return <>
        <Layout>
            <p className="alertMsgBlackbg text-success">{ getClipboard }</p>
                <section class="single_video_section story_f_page"> 
                    <div class="container">
                        <div class="row justify-content-center"> 
                            <div class="col-lg-9 col-sm-12 col-md-12 col-12">

                                <div class="top_categories_tags">
                                    <div class="single_video">

                                        <ReactPlayer
                                            // Disable download button
                                            config={{ file: { attributes: { controlsList: 'nodownload' } } }}

                                            // Disable right click
                                            onContextMenu={e => e.preventDefault()}

                                            // Your props
                                            url={ movies.moviesURL }
                                            className="react-player"
                                            controls
                                            width="100%"
                                            height="315"
                                        />

                                        {/* <iframe width="100%" height="315" src={ movies.moviesURL } title="YouTube video player" frameborder="0" notAllow='nodownload'></iframe> */}
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="main_section">
                                                <div class="row">
                                                <div class="col-lg-8 col-sm-8 col-md-8 col-8">
                                                    <div class="video_info">
                                                        <h1>{ movies.title }</h1>
                                                        <span>{ movies.categoryName + " " + movies.time }</span>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-4">
                                                    <div class="share_like">
                                                        <a href="#" onClick={ like }><i class={ (isLike) ? 'fa fa-thumbs-up' : 'fa fa-thumbs-o-up' }></i>{ movies.likes }</a> <a href="#" onClick={ () => {copyClipBoard(movies.shortURL)} }><i class="fa fa-share"></i> Share</a>
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
                                        <p>{ movies.description }</p> 
                                    </div>
                                    
                                </div>
                            </div> 
                        </div>
                    </div>
                </section>
        </Layout>
    </>
}