import React, {useContext, useEffect, useState} from "react";
import Context from "../Context";
import {Link, Redirect} from "react-router-dom";
import {getProfileDetails, getStoryCategories} from "../views/utilities/ApiCalls";
import {statusFailure} from "../views/Constant";
import {useLocation} from "react-router";
import {useHistory} from "react-router";

export default function NavAuthenticated() {
    const {state, dispatch} = useContext(Context);
    const [profile, setProfile] = useState({});
    const location = useLocation();
    const [error, setError] = useState(null);
    const history = useHistory();
    const [messageTitle, setMessageTitle] = useState('');

    function logout(e) {
        e.preventDefault()
        // remove local storage
        dispatch({type: 'logout', payload: null});
        

    }

    useEffect(() => {
        getProfileDetails().then((response) => {
            if (response.status !== statusFailure) {
                setProfile(response.data)
            } else {
                setError(response.message);
            }
        })

    }, []);

    function verifyUserAccess(moduleType) {
        if(moduleType === 1) {
            if(profile.isPrime) {
                history.push('/audios');
            }
            else {
                window.$('#sidebarSubscriptionPlanModal').modal('show');
                setMessageTitle('audio');
            }
        }
        else if(moduleType === 2) {
            if(profile.isPrime) {
                history.push('/videos');
            }
            else {
                window.$('#sidebarSubscriptionPlanModal').modal('show');
                setMessageTitle('video');
            }
        }
        else if(moduleType === 3) {
            if(profile.isPrime) {
                history.push('/movies');
            }
            else {
                window.$('#sidebarSubscriptionPlanModal').modal('show');
                setMessageTitle('movie');
            }
        }
    }

    function closeModelAndRedirect() {
        window.$('#sidebarSubscriptionPlanModal').modal('hide');
        history.push('/plans');
    }
    

    return (
        <div className="navbar-area">
            <div className="mobile-nav">
                <Link className="navbar-brand" to={'/'}>
                    <img src="/images/logo.png" alt="logo"/>
                </Link>
            </div>
            <div className="main-nav">
                <div className="container">
                    <nav className="navbar navbar-expand-md navbar-light">
                        <Link className="navbar-brand" to={'/'}>
                            <img src="/images/logo.png" alt="logo"/>
                        </Link>
                        <div className="collapse navbar-collapse mean-menu" id="navbarSupportedContent">
                            {error ? <div className="text-danger">{error}</div> : ''}
                            <ul className="navbar-nav">
                                <li className="nav-item"><Link className={location.pathname == '/' ? 'nav-link active' : 'nav-link' } to={'/'} >Home</Link></li>
                                <li className="nav-item"><Link to={'/stories'} className={location.pathname == '/stories' ?  'nav-link active' : 'nav-link' }>Stories</Link></li>
                                <li className="nav-item"><Link to={'/poems'} className={location.pathname == '/poems' ?  'nav-link active' : 'nav-link' }>Poems</Link></li>
                                <li className="nav-item"><Link className={location.pathname == '/audios' ?  'nav-link active' : 'nav-link' } to="#" onClick={() => verifyUserAccess(1)}>Audios</Link></li>
                                <li className="nav-item"><Link className={location.pathname == '/videos' ? 'nav-link active' : 'nav-link' } to="#" onClick={() => verifyUserAccess(2)}>Videos</Link></li>
                                {/* <li className="nav-item"><Link className={location.pathname == '/movies' ? 'nav-link active' : 'nav-link' } to="#" onClick={() => verifyUserAccess(3)}>Movies</Link></li> */}
                                <li className="nav-item"><Link to='/plans' className={location.pathname == '/plans' ?  'nav-link active' : 'nav-link' } >Membership Plans</Link></li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
                                        More <span className='icofont-rounded-down'></span>
                                    </a>
                                    <div className="dropdown-menu">
                                    <Link className="dropdown-item"  to={`/profile/${profile._id}`}>Profile</Link>
                                    <Link className="dropdown-item"  to={'/about-us'}>About Us</Link>
                                    {/* <Link className="dropdown-item"  to={'/who-we-are'}>Who we are</Link> */}
                                    <Link className="dropdown-item"  to={'/what-we-do'}>What we do</Link>
                                    {/* <Link className="dropdown-item"  to={'/our-partner'}>Our Partner</Link> */}
                                    <Link className="dropdown-item"  to={'/faqs'}>FAQ’s</Link>
                                    <Link className="dropdown-item"  to={'/our-vision'}>Vision & Mission</Link>
                                    </div>
                                </li>
                            </ul>
                            <div className="user_icon">
                                <a data-toggle="modal" data-target="#search-modal" href="#"><i
                                    className="icofont-search"></i> </a>
                                <div className="user">
                                    {/* <img className="star_icon" src="/images/star-icon.png" alt=""/> */}
                                    <div className="dropdown">
                                        <img src={profile.profilePic} width={30} height={30} alt=""/>
                                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                            {profile.name}
                                        </a>
                                        <div className="dropdown-menu">
                                            <Link to='/update-password' className="dropdown-item" ><i
                                                className="fa fa-user-o"></i> Update Password</Link>

                                            <a className="dropdown-item" href="#" onClick={logout}><i
                                                className="fa fa-power-off"></i> Logout </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            {/* Start modal for by subscription plan */}

            <div class="modal fade" id="sidebarSubscriptionPlanModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-sm" role="document">
                    <div class="modal-content startPopup">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Please subscribe to view the { messageTitle }.</h5>
                            <button type="button" class="close closePlanModel" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="theme-button">
                                <Link to="#" class="default-btn" onClick={ closeModelAndRedirect }>Upgrade</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* End modal */}
        </div>
    );
}