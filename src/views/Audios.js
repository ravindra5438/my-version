import Layout from "../Layout/Layout";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import OwlCarousel from 'react-owl-carousel';
import {useHistory} from "react-router";

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import {getAudios, getStoryCategories, userLike} from "./utilities/ApiCalls";
import { statusFailure } from "./Constant";
import $ from 'jquery';
import InfiniteScroll from "react-infinite-scroll-component";
let multi = true;


const options = {
    responsiveClass: true,
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

export default function Audios(props) {
    const query = new URLSearchParams(props.location.search);
    let search = query.get('search');

    
    const [audios, setAudios] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [isLike, setLike] = useState(false);
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
        if (search) prams.searchKey = search;
        getAudios(prams).then((response) => {
            if(response.data.length > 0) {
                if(getNewData) {
                    setAudios(response.data);
                }
                else {
                    setAudios([...audios, ...response.data]);
                }
                setPageNo(response.pageNo);
                setLength(response.length);
                setNewData(0);
                setPlanDetails(response.planDetails);
            }
            else {
                setAudios([]);
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
            "type": 3,
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
                    $("#like_"+metaData.id).removeClass('fa fa-thumbs-o-up default-cursor-point');
                    $("#like_"+metaData.id).addClass('fa fa-thumbs-up default-cursor-point');
                }
            }
        });
    }

    function fetchMoreData() {
        let nextPage = pageNo + 1;
        if(length >= nextPage){
            multi = false;
            setPageNo(nextPage);
        }
    }

    let audioList = [];
    if(audios.length > 0) {
        audioList = audios.map((audio, index) => {
            let str = audio.description;
            let description = str;
            if(str.length > 60) {
                description = audio.description.substring(0, 60) + '...';
            }
            let metaData = {
                id: audio._id,
                title: audio.title,
                description: audio.description,
                thumbnail: audio.thumbnail,
                likes: audio.likes,
                userLike: audio.userLike
            }
            return <li>
                        <div class="recent-items">
                            <div class="music_main">
                                <div class="top_content">
                                    <h2>{ audio.title }</h2>
                                    <p>{ description }</p>
                                </div>
                                <div class="music_line">
                                    <img src="images/music-line.png" alt=""/>
                                </div>
                                <img src={ audio.thumbnail } alt=""/>
                                <div class="bottom_button">
                                    <Link to={`/audio-details/${audio._id}`}><i class="fa fa-headphones"></i> Listen now</Link>
                                </div>
                            </div>
                            <div class="bottom_info"> 
                                {/* <p>User name <i class="icofont-check-alt"></i> </p>    */}
                                <div class="like_days">
                                    <h3><i className = { (audio.userLike) ? 'fa fa-thumbs-up default-cursor-point' : 'fa fa-thumbs-o-up default-cursor-point' } onClick={ () => like(metaData) } id={`like_${audio._id}`}> </i> <span id={`update_likes${audio._id}`}>{ audio.likes }</span> 
                                       {/* <span>414k Followers</span>  */}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </li>
        });
    }

    return <>
        <Layout>
            <section className="categories_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div className="heading_title mt-30 mb-10">
                                <h1>Audio by Categories </h1>
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

            <section class="video_gallery_section mt-4">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div class="heading_title mb-10">
                                <h1>Audio Notes </h1>
                                {
                                    (planDetails && (planDetails.audioCount > 0) || (!planDetails.mixCount && !planDetails.audioCount))
                                    ?
                                    null
                                    : 
                                    <span><img src="images/star-icon.png" alt=""/>Only for Premium user</span>
                                }
                            </div>

                            <div class="tabs_div">
                            </div>
                        </div>

                        <div class="col-lg-12">
                            <div class="tab-content" id="myTabContent">
                                <div class="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">  
                                    <div class="audio_page">
                                        <ul class="audio_content">
                                            <InfiniteScroll
                                                dataLength={ audios.length }
                                                next={fetchMoreData}
                                                hasMore={true}
                                                // loader={<h4>Loading...</h4>}
                                                // endMessage={
                                                //   <p style={{ textAlign: 'center' }}>
                                                //     <b>Yay! You have seen it all</b>
                                                //   </p>
                                                // }
                                                >
                                                { audioList }
                                            </InfiniteScroll>
                                            {successMessage && <div className="alert alert-success success-msg-text" role="alert"> {successMessage} </div>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </Layout>
    </>
}