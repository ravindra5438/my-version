import Layout from "../Layout/Layout";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import Axios from 'axios';
import {useParams} from "react-router";

import Constant from "./Constant";


export default function Poems(props) {

    const query = new URLSearchParams(props.location.search);
    let search = query.get('search')
    const [images, setImages] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [length, setLength] = useState(1);
    const [errorState, setErrorState] = useState(null);
    let { type } = useParams();
    const [pageURL, setPageURL] = useState('/story-create');
    const [getThumbnail, setThumbnail] = useState(null);

    useEffect( async () => {
        let token = sessionStorage.getItem('loginDetails');
        let params = {};
        if(search) {
            params = { 'searchKey': search };
        }
        let { data } = await Axios.get(Constant.apiBasePath + 'content-thumbnail/getDataForUser', { headers: { 'token': token } }, params);
        if(data.status === Constant.statusSuccess) {
            setImages(data.data);
            setPageNo(data.pageNo);
            setLength(data.length);
        }
        else {
            setErrorState(data.message);
        }

        if(type === '1') {
            setPageURL('/poem-create');
        }


    }, []);

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

    function selectThumbnail(thumbnail) {
        setThumbnail(thumbnail);
    }

    return <>
        <Layout>
            <section className="video_gallery_section videos_c_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div className="heading_title mb-10">
                                <h1><span><i class="fa fa-arrow-left" aria-hidden="true"></i></span><Link to={ pageURL }>Back</Link></h1>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="tab-content" id="myTabContent">
                                <div className="videos_gallery">
                                    <ul>
                                        {
                                            images.map((image, index) => {
                                                return <li key={image._id} onClick={ () => selectThumbnail(image.thumbnail)}>
                                                            <img src={image.thumbnail}/>
                                                        </li>

                                            })
                                        }
                                    </ul>
                                </div>
                                <Link to={`${pageURL}?thumbnail=${getThumbnail}`}><button type="button" className="btn btn-primary">Upload</button></Link>
                                <Link to={pageURL}><button type="button" className="btn btn-danger">Cancel</button></Link>

                                {
                                    (images.length > 0 && length > 1)
                                    ?
                                        <div className="pagination">
                                        {
                                            (pageNo <= 1) ?
                                        <a>Previous</a>
                                        :
                                        <a className="paginate-link" onClick={() => previousPage(previous)}>Previous</a>
                                        }
                                        
                                        <a>{pageNo}</a>
                                        {
                                            (pageNo >= customLength)
                                            ?
                                        <a className="active">Next</a>
                                        :
                                        <a className="paginate-link active"onClick={() => nextPage(next)}>Next</a>

                                        }
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    </>
}