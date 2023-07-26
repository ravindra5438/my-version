import Nav from "./Nav";
import Context from "../Context";
import NavAuthenticated from "./NavAuthenticated";
import {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import SearchModalComponent from "../Componets/SearchModal";
import {getSiteSocial} from "../views/utilities/ApiCalls";

export default function Layout(props) {
    const {state, dispatch} = useContext(Context);
    const [facebook, setFacebook] = useState(null);
    const [twitter, setTwitter] = useState(null);
    const [linkedin, setLinkedin] = useState(null);
    const [instagram, setInstagram] = useState(null);
    const [youtube, setYoutube] = useState(null);


    useEffect(() => {
        getSiteSocial().then((response) =>{
            response.data.map((item) => {
                if (item.title.toUpperCase() === "facebook".toUpperCase()) setFacebook(item)
                if (item.title.toUpperCase() === "twitter".toUpperCase()) setTwitter(item)
                if (item.title.toUpperCase() === "linkedin".toUpperCase()) setLinkedin(item)
                if (item.title.toUpperCase() === "instagram".toUpperCase()) setInstagram(item)
                if (item.title.toUpperCase() === "youtube".toUpperCase()) setYoutube(item)
            })
        })
    }, []);


    return (
        <>
            {state.token ? <NavAuthenticated/> : <Nav/>}
            <div className="loader-content">
                <div className="d-table">
                    <div className="d-table-cell">
                        <div id="loading-center">
                            <div id="loading-center-absolute">
                                <div className="object" id="object_one"></div>
                                <div className="object" id="object_two"></div>
                                <div className="object" id="object_three"></div>
                                <div className="object" id="object_four"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                props.children
            }


            <section className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                            {/* <div className="footer_box text-center">
                                <ul>
                                    <li><Link to={'/about-us'}>About Us</Link></li>
                                    <li><Link to={'/who-we-are'}>Who we are</Link></li>
                                    <li><Link to={'/what-we-do'}>What we do</Link></li>
                                    <li><Link to={'/our-partner'}>Our Partner</Link></li>
                                    <li><Link to={'/our-vision'}>Our Vision & Mission</Link></li>
                                </ul>
                            </div> */}
                            <div className="social_media text-center">
                                <ul>
                                    {facebook ? <li ><a href={facebook.redirectURL}><i className="icofont-facebook"></i> </a></li> : '' }
                                    {instagram ? <li ><a href={instagram.redirectURL}><i className="icofont-instagram"></i> </a></li> : '' }
                                    {youtube ? <li ><a href={youtube.redirectURL}><i className="icofont-youtube-play"></i> </a></li> : '' }
                                    {linkedin ? <li ><a href={linkedin.redirectURL}><i className="icofont-linkedin"></i> </a></li> : '' }
                                    {twitter ? <li ><a href={twitter.redirectURL}><i className="icofont-twitter"></i> </a></li> : '' }
                                </ul>
                                <div className="copy_right">
                                    <p><Link to={'/term-condition'}>Terms & Conditions</Link> | <Link to={'/privacy-policy'}>Privacy Policy</Link> | <Link to={'/cookies-policy'}>Cookies Policy</Link></p>
                                </div>
                                <div className="copy_right">
                                    <p>Design with B2C Info solutions. All right reserved</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <SearchModalComponent/>


        </>

)
}