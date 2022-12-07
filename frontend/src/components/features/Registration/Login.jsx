import { NavLink, useHistory, useLocation } from "react-router-dom"
import React, { useEffect, useState, useContext, useRef } from "react"
import AuthService from '../../Services/AuthService';
import { AuthContext } from '../../Context/AuthContext';
// import useScrollToTop from '../js_features/useScrollTop'
import Spinner from 'react-bootstrap/Spinner';
import { Helmet } from "react-helmet";

import './Registration.css';
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

const Login = props => {
    const focusPoint = useRef(false);
    const [loading, setloading] = useState(false);

    const history = useHistory();
    const [user, setUser] = useState({
        email: "", pwd: ""
    })
    const authContext = useContext(AuthContext);
    const handle_user_inputs = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }


    const submitData = async (e) => {
        e.preventDefault();

        if (!user.email || !user.pwd)
            return toast.error("Fill the fields", { position: toast.POSITION.BOTTOM_LEFT });

        setloading(true)

        AuthService.login(user).then(data => {
            const { isAuthenticated, user } = data;
            if (isAuthenticated) {
                authContext.setUser(user);
                authContext.setIsAuthenticated(isAuthenticated);

                focusPoint.current.disabled = true;
                toast.success("Successfully Login", { position: toast.POSITION.BOTTOM_LEFT });
                history.push('/');
            }
            else {
                setloading(false);
                setInterval(() => {
                    try {
                        focusPoint.current.disabled = false;
                    } catch {
                        clearInterval();
                    }
                }, 3000)
                toast.error("Check your email and password", { position: toast.POSITION.BOTTOM_LEFT })
            }
        });
    }
    useEffect(() => {
        const body = document.querySelector('#root');
        body.scrollIntoView({
            behavior: 'smooth'
        }, 500)
    }, [])

    return (
        <div className="wrapper">
            <Helmet>
                <meta charSet="utf-8" />
                <title>LOGIN</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <form className="form-right">
                <h2 className="text-uppercase">Login form</h2>

                <div className="mb-3">
                    <label>Your Email</label>
                    <input autoComplete="On" type="email" className="input-field" name="email" onChange={handle_user_inputs} required />
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <input autoComplete="On" type="password" name="pwd" id="pwd" className="input-field" onChange={handle_user_inputs} required />
                </div>
                <NavLink to="/forgotPassword">forgot Password?</NavLink>
                <div className="form-field">
                    <input autoComplete="On" type="submit" value="Login" ref={focusPoint} className="register" name="register" onClick={submitData} />
                    {
                        loading ? <>
                            <span className="p-2"><Spinner animation="border" variant="primary" />
                            </span>
                        </> : null
                    }
                </div>
            </form>
            <div className="form-left">
                <h2 className="text-uppercase">information</h2>
                <p className="text-white">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et molestie ac feugiat sed. Diam volutpat commodo.
                </p>
                <p className="text-white">
                    <span>Sub Head:</span>
                    Vitae auctor eu augudsf ut. Malesuada nunc vel risus commodo viverra. Praesent elementum facilisis leo vel.
                </p>
                <div className="form-field">
                    <NavLink to="/registration"><input autoComplete="On" type="button" className="account" value="Click to Register" /></NavLink>
                </div>
            </div>
        </div>


    )

}

export default Login;
