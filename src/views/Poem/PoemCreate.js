import Layout from "../../Layout/Layout";
import {useEffect, useState, useContext} from "react";
import Context from "../../Context";
import {createPoem, getStoryCategories, uploadStoryImage, getDataById} from "../utilities/ApiCalls";
import Constant, {statusFailure} from "../Constant";
import {Link} from "react-router-dom";
import {useHistory} from "react-router";
import { FilePond, registerPlugin } from 'react-filepond'
import Axios from "axios";
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond/dist/filepond.min.css'

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import $ from 'jquery';
import { getTokenDetails } from "../utilities/CommonFunction";

let val = 1;
let arr = [];

// register if want to preview

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function StoryCreate(props) {
    const query = new URLSearchParams(props.location.search);
    
    let constest_id = query.get('contest');
    let id = query.get('id');
    let type = query.get('type');

    let token = sessionStorage.getItem('loginDetails');
    const history = useHistory();
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [documents, setDocuments] = useState([])
    const [successMessage, setSuccessMessage] = useState('');
    const [thumblain, setThumblain] = useState(null);
    const {state, dispatch} = useContext(Context);
    const [storyForm, setStoryForm] = useState({
        name: "",
        thumbnail: "",
        categoryId: [],
        description: "",
        document:[],
        duration: "",
        contestId: "",
        id: "",
        isAdultContent: false
    });
    const [btnStatus, setbtnStatus ] = useState(false);
    const [images, setImages] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [length, setLength] = useState(1);
    const [contentData, setContentData] = useState({});

    useEffect(() => {
        // hide second step
        $('#second-step').hide();
        let prams = {}
        if (constest_id) prams.contestType = 1;

        if(constest_id) {
            setStoryForm({
                ...storyForm,
                contestId: constest_id
            });
        }

        getStoryCategories(prams).then((response) => {
            if (response.status !== statusFailure) {
                setCategories(response.data);
            } else {
                setError(response.message)
            }
        })

        getTHumbnail(1)

        if(id && type) {
            prams = { 'id': id, 'type': type };
            getDataById(prams).then(data => {
                if(data.status === Constant.statusSuccess) {
                    setContentData(data.data[0]);

                    // make category active

                    if(data.data[0].categoryId.length > 0) {
                        let categoryIds = data.data[0].categoryId;
                        categoryIds.map(el => {
                            $("#"+el).addClass("active");
                        });
                    }

                    setStoryForm({
                        ...storyForm,
                        id: id,
                        name: data.data[0].name,
                        description: data.data[0].description,
                        thumbnail: data.data[0].thumbnail,
                        duration: data.data[0].duration,
                        categoryId: data.data[0].categoryId,
                        contestId: data.data[0].contestId,
                        isAdultContent: data.data[0].isAdultContent
                    });
                }
                else{
                    setError(data.message);
                }
            })
        }

    }, [])


    useEffect(() => {
        let prams = {}
        if (constest_id) prams.contestType = 1;

        getStoryCategories(prams).then((response) => {
            if (response.status !== statusFailure) {
                setCategories(response.data);
            } else {
                setError(response.message)
            }
        })
    }, [])

    useEffect(() => {
        console.log('stated changed',storyForm)
    }, [storyForm])


    function onFormChange(e) {
        if(e.target.id === 'isAdultContent') {
            console.log(e.target.checked)
            setStoryForm({
                ...storyForm,
                isAdultContent: e.target.checked
            })
        }
        else {
            if(e.target.id === 'name') {
                let words = e.target.value.split(' ').length;
                if(words > 50) {
                    setError('Title should be less then or equal to 50 words.');
                    setbtnStatus(true);
                }
                else {
                    setError('');
                    setbtnStatus(false);
                }
            }

            if(e.target.id === 'description') {
                let words = e.target.value.split(' ').length;
                if(words > 6000) {
                    setError('Description should be less then or equal to 6000 words.');
                    setbtnStatus(true);
                }
                else {
                    setError('');
                    setbtnStatus(false);
                }
            }

            setStoryForm({
                ...storyForm,
                [e.target.name]: e.target.value
            })
        }
    }


    function updateCategory(id) {
        // e.preventDefault()
        if($("#"+id).hasClass('active')) {
            val -= 1;
            $("#"+id).removeClass("active");
            $("#"+id+'_check').removeClass('icofont-plus');
            $("#"+id+'_check').addClass('icofont-check');
            var index = arr.map(x => {
                return x;
            }).indexOf(id);
            arr.splice(index, 1);
        }
        else {
            val += 1;
            $("#"+id).addClass("active");
            $("#"+id+'_check').removeClass('icofont-check');
            $("#"+id+'_check').addClass('icofont-plus');
            arr.push(id);
        }

        setStoryForm({
            ...storyForm,
            categoryId: arr
        });

    }

    async function getTHumbnail(page){
        let token = sessionStorage.getItem('loginDetails');
        let response = await Axios.get(Constant.apiBasePath + 'content-thumbnail/getDataForUser?pageNo='+page, {
            headers: { 'token': token }
        });
        console.log("asassaa",response.data)
        if (response.status !== "Success") {
            console.log("asassaa")
            setImages(response.data.data);
            setPageNo(response.data.pageNo)
            setLength(response.data.length)
        } else {
            setError(response.message)
        }
        
    }
        
    function setThumbnail(thumbnail, id) {
        setStoryForm({
            ...storyForm,
            thumbnail: thumbnail
        });

        $('.ticcircle').removeClass('active');
        $('#ticcircle_' + id).addClass('active');
    }

    function submitStory(e) {
        e.preventDefault();  
        setbtnStatus(true);
        
        createPoem(storyForm).then(response => {
            if (response.status !== statusFailure && response.data != '') {
                if(id && type) {
                    setSuccessMessage(response.message);
                    let token = sessionStorage.getItem('loginDetails');
                    if(token) {
                        let userDetails = getTokenDetails(token);
                        setSuccessMessage(response.message);
                        setTimeout(function() {
                            history.push(`/profile/${userDetails._id}`);
                        }, 3000);
                    }
                }
                else {
                    if(response.isAccess === false) {
                        setSuccessMessage(response.message);
                        setTimeout(function() {
                            history.push('/plans');
                        }, 3000);
                    }
                    else {
                        setSuccessMessage(response.message);
                        setTimeout(function() {
                            history.push('/poems');
                        }, 3000);
                    }
                }
            } else {
                setbtnStatus(false);
                setError(response.message)
            }
        });


    }

    function uploadDocuments(response){
        response = JSON.parse(response)
        if (response.status !== statusFailure) {
            setStoryForm({
                ...storyForm,
                document: [...storyForm.document, response.location]
            })
        } else {
            setError(response.message)
        }
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

    function handleModel(type) {
        if(type === 1) {
            window.$('#contentThumbnail').modal('show');
        }
        else {
            window.$('#contentThumbnail').modal('hide');
        }
    }

    function uploadThumbnail() {
        document.getElementById('file-image').classList.remove('hidden');
        document.getElementById('file-image').src = storyForm.thumbnail;
        window.$('#contentThumbnail').modal('hide');
    }

    if(contentData.name !== undefined) {
        document.getElementById('file-image').classList.remove('hidden');
        document.getElementById('file-image').src = contentData.thumbnail;
    }

    function validatePreviewData() {
        if(storyForm.name === '') {
            setbtnStatus(true);
            setError('"name" is not allowed to be empty')
        }
        else if(storyForm.thumbnail === '') {
            setbtnStatus(true);
            setError('"thumbnail" is not allowed to be empty')
        }
        else if(storyForm.categoryId.length < 1) {
            setbtnStatus(true);
            setError('"categoryId" does not contain 1 required value(s)');
        }
        else if(storyForm.duration === '') {
            setbtnStatus(true);
            setError('"duration" is not allowed to be empty')
        }
        else{
            setError('');
            setbtnStatus(false);
            $('#first-step').hide();
            $('#second-step').show();
        }
    }

    function hideStepTwo() {
        $('#second-step').hide();
        $('#first-step').show();
    }

    return <>
        <Layout>
            <section className="top_categories_section" id="first-step">
                <div className="container">
                    {error && <div className="alert alert-danger error-msg-text" role="alert"> {error} </div>}
                    {successMessage && <div className="alert alert-success success-msg-text" role="alert"> {successMessage} </div>}
                    {/* Start modal for select thumbnail */}

                    <div class="modal fade" id="contentThumbnail" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl" role="document">
                            <div class="modal-content startPopup">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Select Thumbnail</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div className="story_thumb_gallery">
                                        <ul>
                                            {
                                                images.map((image, index) => {
                                                    return  <li key={image._id} onClick={ () => setThumbnail(image.thumbnail, image._id)}>
                                                                <img src={image.thumbnail}/>
                                                                <span className="ticcircle" id={`ticcircle_${image._id}`}></span>
                                                            </li>
                                                            

                                                })
                                            }
                                        </ul>
                                    </div>

                                    {
                                        (images.length > 0 && length > 1)
                                        ?
                                            <div className="pagination">
                                            {
                                                (pageNo <= 1) ?
                                            <a>Previous</a>
                                            :
                                            <a className="paginate-link" onClick={() => getTHumbnail(previous)}>Previous</a>
                                            }
                                            
                                            <a>{pageNo}</a>
                                            {
                                                (pageNo >= customLength)
                                                ?
                                            <a className="active">Next</a>
                                            :
                                            <a className="paginate-link active"onClick={() => getTHumbnail(next)}>Next</a>

                                            }
                                        </div>
                                        :
                                        null
                                    }
                                    <div className="storybtns d-flex">
                                        <div class="theme-button mr-3">
                                            <button type="button" className="btn default-btn" onClick={uploadThumbnail}>Upload</button>
                                        </div>   
                                        <div class="theme-button1">
                                            <button type="button" className="btn default-btn" onClick={() => { handleModel(2) }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 

                    {/* End modal */}

                    <div className="row">
                        <div className="col-lg-4 col-sm-4 col-md-4 col-12">
                            <div className="top_categories_box">
                                <form id="file-upload-form" className="uploader" onClick={() => { handleModel(1) }}>
                                    <input id="file-upload" type="hidden" onChange='' name="thumbnail"
                                        accept="image/*"/>
                                    <label htmlFor="file-upload" id="file-drag">
                                        <img id="file-image" src="/images/download-image.png" alt="Preview"
                                            className="hidden"/>
                                        <div id="start">
                                            <i className="fa fa-download" aria-hidden="true"></i>
                                            <div><h2>Upload story title image</h2></div>
                                            <div id="notimage" className="hidden">Please select an image</div>
                                        </div>
                                        <div id="response" className="hidden">
                                            <div id="messages"></div>
                                            <progress className="progress" id="file-progress" value="0">
                                                <span>100%</span>%
                                            </progress>
                                        </div>
                                    </label>
                                </form>
                            </div>
                        </div>

                        <div className="col-lg-8 col-sm-8 col-md-8 col-12">
                            <div className="top_categories_tags">
                                <div className="heading_title mb-20">
                                    <h1>Select topic/category *</h1>
                                </div>
                                <div className="select_tags">
                                    {
                                        categories.map((category, index) => {
                                            return <a key={index} href="#" onClick={() => { updateCategory(category._id)}} value={category._id} id={category._id}><i className='icofont-check' id={`${category._id}_check`}></i> {category.name}
                                            </a>
                                        })
                                    }
                                </div>
                                <div className="row mt-30 form_title">

                                    <div className="col-lg-12 col-sm-6 col-md-6 col-12">
                                        <div className="heading_title">
                                            <h1>Enter poem title *</h1>
                                            <span>(It should be max 50 words.)</span>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Poem name"
                                                onChange={onFormChange} name="name" id="name" defaultValue={storyForm.name} required/>
                                        </div>

                                    </div>
                                    <div className="col-lg-12 col-sm-6 col-md-6 col-12">
                                        <div className="heading_title">
                                            <h1>Enter poem</h1>
                                            <span>(It should be max 6000 words.)</span>
                                        </div>
                                        <div className="form-group">
                                            <textarea type="message" className="form-control"
                                                    placeholder="Start writing" onChange={onFormChange}
                                                    name="description" id="description" defaultValue={storyForm.description}></textarea>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-sm-6 col-md-6 col-12">
                                        <div className="heading_title">
                                            <h1>Duration *</h1>
                                            <span>(It should be in minutes.)</span>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="duration of poem"
                                                onChange={onFormChange} name="duration" defaultValue={storyForm.duration} required/>
                                        </div>
                                    </div>

                                    {
                                        constest_id ?
                                            <>
                                                <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                                                    <div className="choice">
                                                        <h6>or</h6>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                                                    <div className="top_categories_box top_categories_box_1">
                                                        {/*<img src="/images/download-image.png" alt="" />*/}
                                                        {/*    <h2>Upload your written story File upload<br /> (doc, pdf, image)</h2>*/}
                                                        <FilePond
                                                            imagePreviewMaxHeight={100}
                                                            credits={false}
                                                            files={documents}
                                                            allowMultiple={true}
                                                            maxFiles={3}
                                                            name="story"
                                                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                                            instantUpload={true}
                                                            server={
                                                                {
                                                                    url: Constant.apiBasePath + 'story/uploadFileOnS3',
                                                                    process: {
                                                                        headers: {
                                                                            token: token
                                                                        },
                                                                        onload: (res) =>{
                                                                            uploadDocuments(res)
                                                                        }
                                                                    }
                                                                }
                                                            }

                                                        />
                                                        {storyForm.document.length ? <h2>Total Uploaded File {storyForm.document.length}</h2> : '' }
                                                    </div>
                                                </div>
                                            </>
                                            : ''
                                    }

                                    {/* <div className="col-lg-12 col-sm-12 col-md-12 col-12 mt-30">
                                        <div class="top_categories_box top_categories_box_1">
                                            <img src="images/download-image.png" alt=""></img>
                                            <h2>Upload your written story File upload<br/> (doc, pdf, image)</h2>
                                        </div>
                                    </div> */}
                                    <div className="col-lg-12 col-sm-12 col-md-12 col-12 mt-30">
                                        <div class="checkbox checkboxcreate"><input type="checkbox" name="isAdultContent" class="form-check-input" id="isAdultContent" checked={ storyForm.isAdultContent } onChange={onFormChange}/><label class="form-check-label" for="exampleCheck1">Is this content for above 18?</label></div>
                                    </div>
                                    <div className="col-lg-12 col-sm-12 col-md-12 col-12 mt-30">
                                        <div className="theme-button btnsgroup d-inline mr-2">
                                            <Link to="#"><button type="button" className="default-btn" onClick={ validatePreviewData }>Preview
                                            </button></Link>
                                        </div>
                                        <div className="theme-button1 d-inline">
                                            <button type="button" className="default-btn" onClick={submitStory} disabled={ btnStatus }>Submit
                                                to publish
                                                {
                                                    (btnStatus)
                                                    ?
                                                    <div className="content-loader"><img src="images/loader.gif"/></div>
                                                    :
                                                    ''
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
                
            {/* Preview section */}
            
            <div id="second-step">
                <section className="top_categories_section story_f_page">
                    <div className="story_bg">
                        <img src="/images/story_bg.png" alt="" />
                    </div>
                    <div className="container">
                        {error && <div className="alert alert-success error-msg-text" role="alert"> {error} </div>}
                        {successMessage && <div className="alert alert-success success-msg-text" role="alert"> {successMessage} </div>}
                        <div className="row">
                            <div className="col-lg-4 col-sm-4 col-md-4 col-12">
                                <div className="top_categories_box">
                                    <img src={ storyForm.thumbnail } alt="" style={{ pointerEvents: 'none' }}/>
                                </div>
                            </div>
                            <div className="col-lg-8 col-sm-8 col-md-8 col-12">
                            <div className="text-right"><div class="theme-button1 "><a href="#" class="default-btn" onClick={ submitStory } disabled={ btnStatus }>Submit to publish</a></div></div>
                                <div className="top_categories_tags">
                                    <div className="heading_title mb-20">
                                        <h1>{ storyForm.name }<span><i className='fa fa-thumbs-o-up default-cursor-point'> </i>0</span></h1>
                                        <span className="editforcreate"><Link to="#"><i className="fa fa-edit" onClick={ hideStepTwo }></i></Link></span>
                                    </div>
                                    <h6><span>{ `Duration: ${ storyForm.duration }`}</span></h6>
                                    <p>{ storyForm.description }</p>

                                    <div className="author">
                                        <img src={state.user.profilePic} alt="" />
                                        <h2>{state.user.userName}</h2>
                                        <p>Total Followers : {state.user.followers}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="similar_story">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                                <div className="more_similar">
                                    <div className="heading_title mb-20">
                                        <h1>More Similar Poems </h1>
                                    </div>
                                    <ul>
                                        <li>
                                            <a href="#">
                                                <img src="/images/video-gallery.png" alt="" />
                                                <div className="gallery_info">
                                                    <h2>The rise of sun</h2>
                                                    <p>This is a nature lover, who protect the forests from........</p>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src="/images/video-gallery-1.png" alt="" />
                                                <div className="gallery_info">
                                                    <h2>The rise of sun</h2>
                                                    <p>This is a nature lover, who protect the forests from........</p>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src="/images/video-gallery-2.png" alt="" />
                                                <div className="gallery_info">
                                                    <h2>The rise of sun</h2>
                                                    <p>This is a nature lover, who protect the forests from........</p>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src="/images/video-gallery-3.png" alt="" />
                                                <div className="gallery_info">
                                                    <h2>The rise of sun</h2>
                                                    <p>This is a nature lover, who protect the forests from........</p>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src="/images/video-gallery-4.png" alt="" />
                                                <div className="gallery_info">
                                                    <h2>The rise of sun</h2>
                                                    <p>This is a nature lover, who protect the forests from........</p>
                                                </div>
                                            </a>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    </>
}