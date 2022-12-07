import React, { useContext, useState,useEffect } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom"
import '../Navbar.css';
// import "bootstrap/dist/js/bootstrap.js";
import AuthService from './Services/AuthService';
import { AuthContext } from './Context/AuthContext';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

function Navbar() {
    const [input, setInput] = useState("")
    const [inputSearch, setInputSearch] = useState("")
    const d = useLocation();
    const search = d.pathname
    const search1 = d.search;
    const params = new URLSearchParams(search1).get('input');
    
    const history = useHistory();
    useEffect(()=>{
        if (search === "/search"){
        
        setInputSearch(params)
    }
    },[])
    const SearchButton = () => {
        history.push(`search?input=${input}`)

    }
    const signOut_handler = () => {
        confirmAlert({
            title: 'Confirm Sign Out',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {onClickLogoutHandler()
                        history.push(`/login`)
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        })
    };
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);
    const onClickLogoutHandler = () => {
        AuthService.logout().then(data => {
            if (data.success) {
                setUser(data.user);
                setIsAuthenticated(false);
            }
        });
    }
    const unauthenticatedNavBar = () => {
        return (
            <>
                <NavLink className="nav-link nav-user-img" to="/login" data-toggle="modal" data-target="#login-modal" data-abc="true"><span className="login">LOGIN</span></NavLink>
            </>
        )
    }

    const authenticatedNavBar = () => {
        return (
            <>
                <NavLink className="nav-link text-lowercase" to="#" data-toggle="modal" data-target="#login-modal" data-abc="true"><span className="login" style={{ fontSize: "15px" }} onClick={signOut_handler}>SignOUT</span></NavLink>

            </>
        )
    }

    return (
        <header className="section-header">
            <section className="header-main border-bottom">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-lg-3 col-sm-4 col-md-4 col-5"> <a href="/" className="brand-wrap" data-abc="true">
                            <span className="logo">WEEE</span> </a> </div>
                        <div className="col-lg-4 col-xl-5 col-sm-8 col-md-4 d-none d-md-block">
                            {/* <form  className="search-wrap"> */}
                            <div className="input-group w-100"> <input type="text" className="form-control search-form" style={{ width: "55%" }} placeholder="Search" defaultValue={inputSearch} name="input" onChange={(e) => setInput(e.target.value)} />
                                <div className="input-group-append"> <button className="btn btn-primary search-button" type="submit" onClick={SearchButton}> <i className="fa fa-search"></i> </button>     </div>
                            </div>
                            {/* </form> */}
                        </div>
                        <div className="col-lg-5 col-xl-4 col-sm-8 col-md-4 col-7">
                            <div className="d-flex justify-content-end">

                                <NavLink to="/" data-abc="true" className="nav-link widget-header"> <i className="fas fa fa-home"></i></NavLink> <span className="vl"></span>

                               
                                {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <nav className="navbar navbar-expand-md navbar-main border-bottom">
                <div className="container-fluid">
                    <div className="d-md-none my-2">
                        <div className="input-group"> <input type="search" name="search" defaultValue={inputSearch} className="form-control" placeholder="Search" required=""  onChange={(e) => setInput(e.target.value)} />
                            <div className="input-group-append"> <button type="submit" className="btn btn-secondary" onClick={SearchButton}> <i className="fa fa-search"></i> </button> </div>
                        </div>
                    </div>
                     <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#dropdown6" aria-expanded="false"> <i className="fa fa-bars" /> </button>
                    <div className="navbar-collapse collapse" id="dropdown6">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item"> <NavLink activeClassName="text-white bg-primary" className="nav-link" exact to="/" data-abc="true">Resource</NavLink> </li>
                            {/* <li className="nav-item"> <NavLink activeClassName="text-white bg-primary " className="nav-link" to="/freeconsultancy" data-abc="true">Free Consultancy</NavLink> </li> */}
                            <li className="nav-item"> <NavLink activeClassName="text-white bg-primary" className="nav-link" to="/Feed" data-abc="true">Feed</NavLink> </li>
                            {/* <li className="nav-item"> <NavLink activeClassName="text-white bg-primary " className="nav-link" to="/registration" data-abc="true">Registration</NavLink> </li> */}
                            {/* <li className="nav-item"> <NavLink activeClassName="text-white bg-primary " className="nav-link" to="/CoronaLive" data-abc="true">Corona Live</NavLink> </li> */}
                            <li className="nav-item"> <NavLink activeClassName="text-white bg-primary " className="nav-link" to="/contactus" data-abc="true">Get in Touch</NavLink> </li>
                            <li className="nav-item"> <NavLink activeClassName="text-white bg-primary " className="nav-link" to="/Twitter" data-abc="true">E-Waste Bot</NavLink> </li>
                            <li className="nav-item"> <NavLink activeClassName="text-white bg-primary " className="nav-link" to="/about" data-abc="true">About</NavLink> </li>
                            {!isAuthenticated ? null : <>
                                <li className="nav-item"> <NavLink activeClassName="text-white bg-primary " className="nav-link" to="/userSupplies" data-abc="true">Your Supplies</NavLink> </li><li className="nav-item"> <NavLink activeClassName="text-white bg-primary " className="nav-link" to="/userNews" data-abc="true">Your Feed</NavLink> </li><li className="nav-item nav-link font-smaller"> {user.email} </li></>}

                        </ul>
                    </div>
                </div>
            </nav>

        </header>
    );

}

export default Navbar;