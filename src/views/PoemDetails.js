import Layout from "../Layout/Layout";
import {useEffect, useState, useContext} from "react";
import {getPoems, userLike, userFollow} from "./utilities/ApiCalls";
import {useParams} from "react-router";
import Constant, {statusFailure} from "./Constant";
import { getTokenDetails } from "./utilities/CommonFunction";
import Context from "../Context";
import {useHistory} from "react-router";
import { Link } from 'react-router-dom';


export default function PoemDetails(props) {
    let { id } = useParams();

    const [story, setStory] = useState({});
    const [errorState, setErrorState] = useState(null);
    const [isLike, setLike] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [similarPoem, setSimilarPoem] = useState([]);
    const history = useHistory();
    const {state, dispatch} = useContext(Context);
    const [similarId, setSimilarId] = useState('');
    const [userId, setUserId] = useState('');
    const [userBadge, setUserBadge] = useState('');
    const [isAccess, setIsAccess] = useState(true);
    const [isFollow, setFollow] = useState(false);


    useEffect(() => {
        let prams = {
            id:id
        };
        let token = sessionStorage.getItem('loginDetails');
        // get data by similar id

        if(similarId) {
            prams = {
                id: similarId
            }
        }
        if(token) {
            let userDetails = getTokenDetails(token);
            if(userDetails) {
                prams.user_id = userDetails._id;
                setUserId(userDetails._id);
            }
        }

        if(state.user.userBadge) {
            setUserBadge(state.user.userBadge.title);    
        }
        
        getPoems(prams).then((response) => {
            if (response.status !== statusFailure) {
                setStory(response.data[0]);
                setSimilarPoem(response.similarPoem);
                setIsAccess(response.isAccess);
                if(response.isAccess === false || response.isBadge === true) {
                    setSuccessMessage(response.message);
                }
            } else {
                setErrorState(response.message);
                setTimeout(function() {
                    setErrorState('');
                }, 3000);
            }
        }).catch((error) => {
            console.log(error)
        });
    }, [isLike, similarId, isFollow]);


    function like() {
        let likeRequest = {
            "moduleId": story._id,
            "type": 2,
            "user_id": '',
            "title": story.name,
            "description": story.description,
            "thumbnail": story.thumbnail
        }

        userLike(likeRequest).then(response => {
            if (response.status !== statusFailure && response.data) {
               setLike(response.data.userLike);
            }
        });
    }

    function verifyUser(id, standard) {
        setSimilarId(id);
        if(standard === 2) {
            if(state.user.isPrime) {
                history.push('/poem-details/' + id);
            }
            else {
                // history.push('/plans');
                history.push('/poem-details/' + id);
            }
        }
        else{
            history.push('/poem-details/' + id);
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

    return <>
        <Layout>
            <section className="top_categories_section story_f_page">
                <div className="story_bg">
                    <img src="/images/story_bg.png" alt="" />
                </div>
                <div className="container">
                    {errorState && <div className="alert alert-error error-msg-text" role="alert"> {errorState} </div>}
                    {successMessage && <div className="alert alert-success success-msg-text" role="alert"> {successMessage} </div>}
                    <div className="row">
                        <div className="col-lg-4 col-sm-4 col-md-4 col-12">
                            <div className="top_categories_box">
                                <img src={story.thumbnail} alt="" style={{ pointerEvents: 'none' }}/>
                            </div>
                        </div>
                        <div className="col-lg-8 col-sm-8 col-md-8 col-12">
                            <div className="top_categories_tags">
                                <div className="heading_title mb-20">
                                    <h1>{story.name}<span><i className= { (isLike || story.userLike) ? 'fa fa-thumbs-up default-cursor-point' : 'fa fa-thumbs-o-up default-cursor-point' } onClick={ like }> </i>{ story.likes }</span></h1>
                                    {
                                        (story.userId === userId)
                                        ?
                                            <span className="editforcreate"><Link to={`/update-poem?type=2&id=${story._id}`}><i className="fa fa-edit"></i></Link></span>
                                        :
                                            ''
                                    }
                                </div>
                                {
                                    (story.createdAt) 
                                    ? 
                                    <h6><span>{ `Duration: ${(story.duration) ? story.duration : '0 min'} `}</span> <span>{ `Date: ${story.createdAt.split('T')[0]}` }</span></h6>
                                    : 
                                    ''
                                }
                                <p>{ (isAccess) ? story.description : <Link to='/plans' class="default-btn">Buy plan</Link>}</p>

                                <div className="author">
                                    <img src={ story.profilePic } alt="" />
                                    <h2>{ story.userName }</h2>
                                    {
                                        (story.userId === userId)
                                        ?
                                        ''
                                        :
                                        <a class="btn bg_l_blue follow_btn pull-right" onClick={()=> { follow(story.userId, story.userFollow) }}>{ (story.userFollow) ? 'UnFollow' : 'Follow' }</a>
                                    }
                                    <p>Total Followers : { story.followers }</p>
                                    <p>Badge: { userBadge }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="similar_story video_gallery_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div className="more_similar">
                                <div className="heading_title mb-20">
                                    <h1>More Similar Poems </h1>
                                </div>
                                <div class="videos_gallery">
                                <ul>
                                    {
                                        (similarPoem.length > 0)
                                        ?
                                            similarPoem.map((story, index) => {
                                                let str = story.description;
                                                let description = str;
                                                if(str.length > 60) {
                                                    description = str.substring(0, 60) + '...';
                                                }

                                                let metaData = {
                                                    id: story._id,
                                                    title: story.name,
                                                    description: story.description,
                                                    thumbnail: story.thumbnail
                                                }

                                                return <li key={story._id}>
                                                        <img src={story.thumbnail} />
                                                        <div className="gallery_info">
                                                            <h2>{story.name}</h2>
                                                            <p>{description}</p>
                                                        </div>
                                                        <div class="overlay">
                                                            <h2>{ story.name }</h2>
                                                            <p>{ description }</p>
                                                            <div class="theme-button1">
                                                                <button type="" class="default-btn" onClick={()=> { verifyUser(story._id, story.standard) }}>View Poem</button>
                                                            </div>
                                                            <div class="verif">
                                                                
                                                                    {
                                                                        (story.status === 1)
                                                                        ?
                                                                        <h6>Poem verified <i class="fa fa-check"></i></h6>
                                                                        :
                                                                        <h6>Poem not verified <i class="bi bi-stopwatch-fill"></i></h6>
                                                                    }
                                                                
                                                                <span>Total Followers : { story.followers }</span> <span><i className= { (isLike || story.userLike) ? 'fa fa-thumbs-up default-cursor-point' : 'fa fa-thumbs-o-up default-cursor-point' } onClick={ () => like(metaData) }> </i> { story.likes }</span>
                                                            </div>
                                                        </div>
                                                </li>

                                            })
                                        :
                                        <p>No result found</p>
                                    }
                                </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    </>
}