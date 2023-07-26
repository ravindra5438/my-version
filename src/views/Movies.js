import Layout from "../Layout/Layout";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import OwlCarousel from 'react-owl-carousel';

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import {getMovies, getStoryCategories, userLike} from "./utilities/ApiCalls";
import { statusFailure } from "./Constant";
import $ from 'jquery';

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
export default function Videos(props) {
    const query = new URLSearchParams(props.location.search);
    let search = query.get('search');

    const [movies, setMovies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [isLike, setLike] = useState(false);
    const [getClipboard, setClipboard] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [length, setLength] = useState(1);

    useEffect(() => {
        getStoryCategories().then((response) => {
            setCategories(response.data);
        })
    }, []);

    useEffect(() => {
        let prams = { pageNo: pageNo };
        if (categoryId) prams.categoryId = categoryId;
        if (search) prams.searchKey = search;
    
        getMovies(prams).then((response) => {
            setMovies(response.data);
            setPageNo(response.pageNo);
            setLength(response.length);
        });
    }, [categoryId, isLike, pageNo]);

    function setCategory(e) {
        e.preventDefault();
        setCategoryId(e.target.getAttribute('value'));
    }

    function like(metaData) {
        // e.preventDefault();
        let likeRequest = {
            "moduleId": metaData.id,
            "type": 5,
            "user_id": '',
            "title": metaData.title,
            "description": metaData.description,
            "thumbnail": metaData.thumbnail
        }

        userLike(likeRequest).then(response => {
            if (response.status !== statusFailure && response.data) {
               setLike(response.data.userLike);
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

    function copyClipBoard(url) {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        // textArea.select();
        try {
          document.execCommand('copy');
          setClipboard('Link copied to clipboard');
          setTimeout(function() { setClipboard('') }, 3000);
        } catch (err) {
          setClipboard('Unable to copy to clipboard', err);
          setTimeout(function() { setClipboard(''); }, 3000);
        }
        document.body.removeChild(textArea);
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

    return <>
        <Layout>
            <section className="categories_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div className="heading_title mt-30 mb-10">
                                <h1>Movies by Categories </h1>
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
                                <h1>Movies </h1><span><img src="/images/star-icon.png" alt="" /> </span> <span>Only for Premium user</span>
                            </div>
                            
                        </div>
                    </div>
                    <div className="row">
                        {
                            movies.map((video, index) => {
                            console.log({ isLike: isLike, 'userLike': video.userLike });

                                let metaData = {
                                    id: video._id,
                                    title: video.title,
                                    description: video.description,
                                    thumbnail: video.thumbnail
                                }
                                return <div className="col-lg-3 col-sm-4 col-md-4 col-12">
                                            <div className="videos_list">
                                                <div className="time">
                                                    <span>{ video.duration } min</span>
                                                </div>
                                                <div className="video_image">
                                                    <img src={ video.thumbnail } alt="" />
                                                    <div className="play_btn">
                                                        <Link to={`/movies-details/${ video._id }`} data-toggle="dropdown" aria-haspopup="true"
                                                            aria-expanded="false"><i className="icofont-ui-play"></i></Link>
                                                    </div>
                                                </div>
                                                <div className="video_info">
                                                    <div className="row">
                                                        <div className="col-lg-9 col-sm-8 col-md-8 col-9">
                                                            <div className="content_box">
                                                                <img src="/images/video_info.png" alt="" />
                                                                <div className="video_details">
                                                                    <h2>{ video.title }</h2>
                                                                    <p>{ video.categoryName } <i className="icofont-check-alt"></i></p>
                                                                    <div className="like_days">
                                                                        <h3><i className = { (video.userLike) ? 'fa fa-thumbs-up default-cursor-point' : 'fa fa-thumbs-o-up default-cursor-point' } onClick={ () => like(metaData) } id={`like_${video._id}`}> </i>{ video.likes } <span>{ video.time }</span>
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-sm-4 col-md-4 col-3">
                                                            <div className="share">
                                                                <a className=" share_icon" href="javascript:void(0);" data-toggle="dropdown"
                                                                aria-haspopup="true" aria-expanded="false" onClick={()=> {copyClipBoard(video.moviesURL)}}>
                                                                <i className="icofont-share"></i> 
                                                                </a>
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
                    </div>
                    {
                        (movies.length > 0 && length > 1)
                        ?
                            <div className="pagination">
                            {
                                (pageNo <= 1) ?
                            <a className="default-previous">Previous</a>
                            :
                            <a className="paginate-link" onClick={() => previousPage(previous)}>Previous</a>
                            }
                            
                            <a>{pageNo}</a>
                            {
                                (pageNo >= customLength)
                                ?
                            <a className="default-next">Next</a>
                            :
                            <a className="paginate-link active"onClick={() => nextPage(next)}>Next</a>

                            }
                        </div>
                        :
                        null
                    }
                </div>
            </section>

        </Layout>
    </>
}