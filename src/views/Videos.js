import Layout from "../Layout/Layout";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import {useHistory} from "react-router";
import {getVideos, getStoryCategories, userLike} from "./utilities/ApiCalls";
import { statusFailure } from "./Constant";
import $ from 'jquery';
import InfiniteScroll from "react-infinite-scroll-component";
let multi = true;

const options = {
    responsiveClass: true,
    nav: true,
    responsive: {
        0: {
            items: 3,
        },
        400: {
            items: 3,
        },
        600: {
            items: 4,
        },
        700: {
            items: 4,
        },
        1000: {
            items: 9
        }
    },
};
export default function Videos() {
    const [videos, setVideos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [isLike, setLike] = useState(false);
    const [getClipboard, setClipboard] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [length, setLength] = useState(1);
    const history = useHistory();
    const [planDetails, setPlanDetails] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [getNewData, setNewData] = useState(0);

    useEffect(() => {
        getStoryCategories().then((response) => {
            setCategories(response.data);
        })
    }, []);

    useEffect(() => {
        let prams = { pageNo: pageNo };
        if (categoryId) prams.categoryId = categoryId;
        
        getVideos(prams).then((response) => {
            if(response.data.length > 0) {
                if(getNewData) {
                    setVideos(response.data);
                }
                else {
                    setVideos([...videos, ...response.data]);
                }
                setPageNo(response.pageNo);
                setLength(response.length);
                setNewData(0);
                setPlanDetails(response.planDetails);
            }
            else {
                setVideos([]);
                setSuccessMessage(response.message);
            }
        });
    }, [categoryId, pageNo]);

    function setCategory(e) {
        e.preventDefault();
        setCategoryId(e.target.getAttribute('value'));
        setNewData(1);
        setPageNo(1);
        setLength(1);
    }

    function like(metaData) {
        // e.preventDefault();
        let likeRequest = {
            "moduleId": metaData.id,
            "type": 4,
            "user_id": '',
            "title": metaData.title,
            "description": metaData.description,
            "thumbnail": metaData.thumbnail
        }
        let val = parseInt($("#update_likes"+metaData.id).text());

        userLike(likeRequest).then(response => {
            if (response.status !== statusFailure && response.data) {
               setLike(response.data.userLike);
               if(response.data.userLike) {
                $("#update_likes"+metaData.id).text(val + 1);
                }
                else {
                    $("#update_likes"+metaData.id).text(val - 1);
                }
               if($("#like_"+metaData.id).hasClass('fa fa-thumbs-up default-cursor-point')) {
                    $("#like_"+metaData.id).removeClass('fa fa-thumbs-up default-cursor-point');
                    $("#like_"+metaData.id).addClass('fa fa-thumbs-o-up default-cursor-point');
                }
                else{
                    $("#like_"+metaData.id).    removeClass('fa fa-thumbs-o-up default-cursor-point');
                    $("#like_"+metaData.id).addClass('fa fa-thumbs-up default-cursor-point');
                }
            }
        });
    }

    function copyClipBoard(url) {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        // textArea.select();
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

   
    function fetchMoreData() {
        let nextPage = pageNo + 1;
        if(length >= nextPage){
            multi = false;
            setPageNo(nextPage);
        }
    }

    let videoList = [];
    if(videos.length > 0) {
        videoList = videos.map((video, index) => {
            let metaData = {
                id: video._id,
                title: video.title,
                description: video.description,
                thumbnail: video.thumbnail,
                likes: video.likes
            }

            return <div className="col-lg-3 col-sm-4 col-md-4 col-12">
                        <div className="videos_list">
                            <div className="time">
                                <span>{ video.duration } min</span>
                            </div>
                            <div className="video_image">
                                <img src={ video.thumbnail } alt="" />
                                <div className="play_btn">
                                    <Link to={`/video-details/${video._id}`}><i className="icofont-ui-play"></i></Link>
                                </div>
                            </div>
                            <div className="video_info">
                                <div className="row">
                                    <div className="col-lg-9 col-sm-8 col-md-8 col-9">
                                        <div className="content_box">
                                            <img src={ video.thumbnail } alt="" />
                                            <div className="video_details">
                                                <h2>{ video.title }</h2>
                                                <p>{ video.categoryName } <i className="icofont-check-alt"></i></p>
                                                <div className="like_days">
                                                    <h3><i className= { (video.userLike) ? 'fa fa-thumbs-up default-cursor-point' : 'fa fa-thumbs-o-up default-cursor-point' } onClick={ () => like(metaData) } id={`like_${video._id}`}> </i> <span id={`update_likes${video._id}`}>{ video.likes }</span> <span>{ video.time }</span>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-sm-4 col-md-4 col-3">
                                        <div className="share">
                                            {/* <a className=" share_icon" href="javascript:void(0);" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false" onClick={()=> {copyClipBoard(video.videoURL)}}>
                                            <i className="icofont-share"></i> 
                                            </a> */}
                                            {/* <div className="">
                                                <div
                                                    className="dropdown-menu dropdown-menu-right dropdown-menu-social">
                                                    <a className="dropdown-item social-facebook mb-1" href="#"><i
                                                        className="icofont-facebook"></i></a>
                                                    <a className="dropdown-item social-twitter mb-1" href="#"><i
                                                        className="icofont-twitter"></i></a>
                                                    <a className="dropdown-item social-youtube mb-1" href="#"><i
                                                        className="icofont-youtube"></i></a>

                                                    <a className="dropdown-item social-instagram" href="#"><i
                                                        className="icofont-instagram"></i></a>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>
                   
        })
    }

    return <>
        <Layout>
            <section className="categories_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div className="heading_title mt-30 mb-10">
                                <h1>Video by Categories </h1>
                            </div>
                        </div>
                        <div class="col-lg-12 col-sm-12 col-md-12 col-12">
                            <OwlCarousel className='owl-theme' {...options} loop={false} autoplay={true} margin={10} nav={true}>
                                {
                                    categories.map((category, index) => {
                                        return <div class="recent-items">
                                                <div class="categories_box">
                                                    <div class="categorie_icon" onClick={ setCategory }>
                                                        <img src={ category.icon } alt="" value={ category._id } />
                                                    </div>
                                                    <h2>{ category.name }</h2>
                                                    {/* <p>{ category._id }</p> */}
                                                </div>
                                            </div>
                                    })
                                }
                            </OwlCarousel>   
                       </div>
                    </div>
                </div>
            </section>

            <p className="alertMsgBlackbg text-success">{ getClipboard }</p>
            <section className="videos_section videos_c_section">
                <div className="container">
                    <div className="row mb-20">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div className="heading_title">
                                <h1>Trending Videos </h1>
                                {
                                    (planDetails && (planDetails.videoCount > 0) || (!planDetails.mixCount && !planDetails.videoCount))
                                    ?
                                    null
                                    : 
                                    <span><img src="images/star-icon.png" alt=""/>Only for Premium user</span>
                                }
                            </div>
                        </div>
                    </div>
                    <InfiniteScroll
                        dataLength={ videos.length }
                        next={fetchMoreData}
                        hasMore={true}
                        // loader={<h4>Loading...</h4>}
                        // endMessage={
                        //   <p style={{ textAlign: 'center' }}>
                        //     <b>Yay! You have seen it all</b>
                        //   </p>
                        // }
                        >
                            <div className="row">{ videoList }</div>
                        
                    </InfiniteScroll>
                    {successMessage && <div className="alert alert-success success-msg-text" role="alert"> {successMessage} </div>}
                </div>
            </section>
        </Layout>
    </>
}