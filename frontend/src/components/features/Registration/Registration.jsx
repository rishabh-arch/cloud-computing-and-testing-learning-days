import React, { useEffect, useContext, useState, useRef } from "react";
import './Registration.css';
import { NavLink, useHistory } from "react-router-dom"
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../../Services/AuthService';
import { AuthContext } from '../../Context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';

// import useScrollToTop from '../js_features/useScrollTop'

toast.configure();
const Registration = () => {
    const [loading, setloading] = useState(false);
    const focusPoint = useRef(false);

    const history = useHistory();
    const [State, setState] = useState("");
    const [District, setDistrict] = useState(0);
    const [user, setUser] = useState({
        first_name: "", last_name: "", email: "", State: "", City: "", pwd: "", cpwd: "", agree: "", contact: ""
    })
    const authContext = useContext(AuthContext);

    const handle_user_inputs = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }

    const states_json = "states_and_districts.json";

    fetch(states_json, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(async (response) => await response.json()).then((data) => {
        setState(() => data["states"]);
    })

    useEffect(() => {
        document.getElementById('district_change').getElementsByTagName('option')[0].selected = 'selected';
    }, [District])
    let timerID = useRef(null);

    useEffect(() => {
        return () => {
            clearTimeout(timerID);
        }
    }, []);
    const resetForm = () => {
        setUser({ username: "", password: "", role: "" });
    }

    useEffect(() => {
        const body = document.querySelector('#root');
        body.scrollIntoView({
            behavior: 'smooth'
        }, 500)
    }, [])
    // const body = JSON.stringify(user);
    const submitData = async (e) => {
        e.preventDefault();
        focusPoint.current.disabled = true;
        setloading(true)
        const res = await axios.post("/userregistration", user)
            .then(res => {
                AuthService.login({ email: user.email, pwd: user.pwd }).then(data => {
                    const { isAuthenticated, user } = data;
                    if (isAuthenticated) {
                        authContext.setUser(user);
                        authContext.setIsAuthenticated(isAuthenticated);
                        toast.success("Success,Will be redirect to Home", { position: toast.POSITION.BOTTOM_LEFT })
                        resetForm();
                        focusPoint.current.disabled = true;
                        timerID = setTimeout(() => {
                            history.push('/');
                        }, 2000)
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
            })
            .catch(err => {
                if (err.response) {
                    toast.error(err.response.data.message.msgBody, { position: toast.POSITION.BOTTOM_LEFT })
                }
            })
    }
    return (
        <div className="wrapper">
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
                    <NavLink to="/login"><input autoComplete="On" type="button" className="account" value="Have an Account ?" /></NavLink>
                </div>
            </div>
            <form method="POST" className="form-right">
                <h2 className="text-uppercase">Registration form</h2>
                <div className="text-danger" id="error"></div>
                <div className="row">
                    <div className="col-sm-6 mb-3">
                        <label>First Name<span>*</span></label>
                        <input autoComplete="On" type="text" name="first_name" id="first_name" className="input-field" onChange={handle_user_inputs} required />
                    </div>
                    <div className="col-sm-6 mb-3">
                        <label>Last Name<span>*</span></label>
                        <input autoComplete="On" type="text" name="last_name" id="last_name" className="input-field" onChange={handle_user_inputs} required />
                    </div>
                </div>
                <div className="mb-3">
                    <label>Your Email<span>*</span></label>
                    <input autoComplete="On" type="email" className="input-field" name="email" onChange={handle_user_inputs} required />
                </div>
                <div>
                    <div className="form-group">
                        <label>State<span>*</span>
                        </label>
                        <select id="state_select" className="input-field" name="State"
                            onChange={
                                (e) => {
                                    const state_result = { target: { value: State[e.target.value]["state"], name: "State" } };
                                    handle_user_inputs(state_result)
                                    setDistrict(() => (e.target.value !== "") ? State[e.target.value]["districts"] : {})
                                }
                            } required>
                            <option value="" defaultChecked>Select</option>
                            {
                                Object.keys(State).map((a, i) => {
                                    var z = <>
                                        <option key={i}
                                            value={a}>
                                            {
                                                State[a]["state"]
                                            } </option>
                                    </>;

                                    return z;
                                })
                            } </select>
                    </div>
                </div>
                <div>
                    <div className="form-group">
                        <label>District<span>*</span></label>
                        <select id="district_change" className="input-field" name="City" onChange={handle_user_inputs} required>
                            <option value="" defaultChecked>Select</option>
                            {
                                Object.keys(District).map((a, i) => {
                                    var z = <>
                                        <option key={i}>
                                            {
                                                District[a]
                                            } </option>
                                    </>;

                                    return z;
                                })
                            } </select>
                    </div>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-12 col-lg-4"></div>

                <div>
                    <label>Contact No.<span>*</span></label>
                    <input autoComplete="On" type="text" name="contact" className="input-field" onChange={handle_user_inputs} placeholder="959XXXXXX6" required />
                </div>
                <div>
                    <label>Password<span>*</span></label>
                    <input autoComplete="On" type="password" name="pwd" id="pwd" className="input-field" onChange={handle_user_inputs} required />
                </div>
                <div>
                    <label>Current Password<span>*</span></label>
                    <input autoComplete="On" type="password" name="cpwd" id="cpwd" className="input-field" onChange={handle_user_inputs} required />
                </div>
                <div className="mb-3 mt-2">
                    <label className="option">I agree to the
                        <a href="#"> Terms and Conditions<span>*</span></a>
                        <input autoComplete="On" type="checkbox" id="agreeBtn" name="agree" defaultValue="false" onChange={() => {
                            const agree = { target: { value: (document.getElementById("agreeBtn").checked), name: "agree" } };
                            handle_user_inputs(agree)
                        }} required />
                        <span className="checkmark"></span>
                    </label>
                </div>
                <div className="form-field">
                    <input autoComplete="On" type="submit" value="Register" ref={focusPoint} className="register" name="register" onClick={submitData} />
                    {
                        loading ? <>
                            <span className="p-2"><Spinner animation="border" variant="primary"/>
                            </span>
                        </> : null
                    } 
                </div>
            </form>
        </div>


    )

}

export default Registration;
