import Layout from "../Layout/Layout";
import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Context from "../Context";

import {getPoems, getStoryCategories, userLike} from "./utilities/ApiCalls";
import {statusFailure} from "./Constant";
import {useHistory} from "react-router";
import $, { param } from 'jquery';

import { getTokenDetails } from '../../src/views/utilities/CommonFunction';
import InfiniteScroll from "react-infinite-scroll-component";
let multi = true;


export default function Poems(props) {
    const history = useHistory();
    const query = new URLSearchParams(props.location.search);
    let search = query.get('search');
    const {state, dispatch} = useContext(Context);
    const [poems, setPoems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [pageNo, setPageNo] = useState(1);
    const [length, setLength] = useState(1);
    let contestId = query.get('contest');

    const [errorState, setErrorState] = useState(null);
    const [isLike, setLike] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [getNewData, setNewData] = useState(0);

    useEffect(() => {
        let prams = { 'moduleType': 2 };
        getStoryCategories(prams).then((response) => {
            if (response.status !== statusFailure) {
                setCategories(response.data);
            } else {
                // console.log(response.message)
                setErrorState(response.message)
            }
        }).catch((error) => {
            console.log(error)
        });
    }, []);

    useEffect(() => {
        let prams = {};
        if (categoryId) prams.categoryId = categoryId;
        if (search) prams.searchKey = search;
        prams.pageNo = pageNo;
        if(contestId) prams.contestId = contestId;

        getPoems(prams).then((response) => {
        if (response.data.length > 0) {
            if(getNewData) {
                setPoems(response.data);
            }
            else {
                setPoems([...poems, ...response.data]);
            }
            setPageNo(response.pageNo);
            setLength(response.length);
            setNewData(0);
        } else {
            setPoems([]);
            setSuccessMessage(response.message);
        }
    }).catch((error) => {
        console.log(error)
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
        let likeRequest = {
            "moduleId": metaData.id,
            "type": 2,
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

    let poemList = [];
    if(poems.length > 0) {
        poemList = poems.map((poem, index) => {
            let str = poem.description;
            let description = str;
            if(str.length > 60) {
                description = str.substring(0, 60) + '...';
            }

            let metaData = {
                id: poem._id,
                title: poem.name,
                description: poem.description,
                thumbnail: poem.thumbnail,
                likes: poem.likes
            }

            return <li key={poem._id}>
                        <img src={poem.thumbnail} />
                        <div className="gallery_info">
                            <h2>{poem.name}</h2>
                            <p>{description}</p>
                        </div>
                        <div class="overlay">
                            <h2>{poem.name}</h2>
                            <p>{description}</p>
                            <div class="theme-button1">
                            {(!sessionStorage.getItem('loginDetails') ?
                        <button type="" class="default-btn" onClick={()=> { window.$("#homeReirectionModal").appendTo("body"); window.$('#homeReirectionModal').modal('show'); }}>View Poem</button>
                        :
                            // <button type="" class="default-btn" onClick={()=> { verifyUser(poem._id, poem.standard) }}>View Poem</button>
                            <Link to={'/poem-details/' + poem._id } class="default-btn">View Poem</Link>
                            )}
                            </div>
                            <div class="verif">
                            {
                                    (poem.status === 1)
                                    ?
                                    <h6>Poem verified <i class="fa fa-check"></i></h6>
                                    :
                                    <h6>Poem not verified <i class="bi bi-stopwatch-fill"></i></h6>
                                }
                            
                            <span>Total Followers : { poem.followers }</span> <span><i className= { (poem.userLike) ? 'fa fa-thumbs-up default-cursor-point' : 'fa fa-thumbs-o-up default-cursor-point' } onClick={ () => like(metaData) } id={`like_${poem._id}`}> </i> <span id={`update_likes${poem._id}`}>{ poem.likes }</span></span>
                            </div>
                        </div>
            </li>

        });
    }


    return <>
        <Layout>
            <section className="breadcrumbs_section" style={{
                backgroundImage: "url(/images/bg-banner.png)",
                backgroundPosition: "center",
            }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12 justify-content-center">
                            <div className="breadcrumbs_box">
                                <h2>Collection of poems written by other People <span> so start writing your poem now</span>
                                </h2>
                                <div className="theme-button2">
                                    <Link className="default-btn" to={'/poem-create'}>Write a Poem</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="video_gallery_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div className="heading_title mb-10">
                                <h1>Poems </h1>
                            </div>
                            {
                                (contestId)
                                ?
                                ''
                                :
                                <div class="theme-button contestbtn"><Link class="btn default-btn" to="/contest/2">Contest</Link></div>
                            }
                            <div className="tabs_div">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <a className={categoryId ? "nav-link" : "nav-link active"} value=""
                                           onClick={setCategory}>All</a>
                                    </li>
                                    {
                                        categories.map((category, index) => {
                                            return <li className="nav-item" key={category._id}>
                                                <a className={categoryId == category._id ? "nav-link active" : "nav-link"}
                                                   value={category._id} onClick={setCategory}
                                                   href="#all">{category.name}</a>
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="tab-content" id="myTabContent">
                                <div className="videos_gallery">
                                    <ul>
                                        <InfiniteScroll
                                            dataLength={ poems.length }
                                            next={fetchMoreData}
                                            hasMore={true}
                                            // loader={<h4>Loading...</h4>}
                                            // endMessage={
                                            //     <p style={{ textAlign: 'center' }}>
                                            //     <b>Yay! You have seen it all</b>
                                            //     </p>
                                            // }
                                            >
                                            { poemList }
                                        </InfiniteScroll>
                                        {successMessage && <div className="alert alert-success success-msg-text" role="alert"> {successMessage} </div>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            </section>
        </Layout>
    </>
}