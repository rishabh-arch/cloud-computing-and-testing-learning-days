import {useHistory, useLocation} from "react-router-dom"
import React, {useEffect, useState, useRef} from "react"
import Spinner from 'react-bootstrap/Spinner';
import './Registration.css';
import axios from "axios"
import {toast} from 'react-toastify';
import useScrollToTop from '../js_features/useScrollTop'
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
export default function ForgotPass() {
    const focusPoint = useRef(null);

    const history = useHistory();
    const [email, setEmail] = useState("");
    const [loading, setloading] = useState(false);


    const submitData = async (e) => {
        e.preventDefault();
        setloading(true)
        focusPoint.current.disabled = true;

        axios.post('/forgotUserPassword', {email}).then(res => {
            toast.success(res.data.msg, {position: toast.POSITION.BOTTOM_LEFT})
            history.push('/');
        }).catch(err => {
            setloading(false)
            focusPoint.current.disabled = false;
            toast.error(err.response.data.msg, {position: toast.POSITION.BOTTOM_LEFT})
        })
    } 
    useScrollToTop();

    return (
        <div>
            <div className="wrapper">
                <form className="form-right">
                    <h2 className="text-uppercase">Forogot Password</h2>

                    <div className="mb-3">
                        <label>Your Email</label>
                        <input autoComplete="Off" type="email" className="input-field" name="email"
                            onChange={
                                (e) => setEmail(e.target.value)
                            }
                            required/>
                    </div>

                    <div className="form-field">
                        <input autoComplete="Off" type="submit"
                            ref={focusPoint}
                            value="Submit"
                            className="register"
                            name="register"
                            onClick={submitData}/> {
                        loading ? <>
                            <span className="p-2"><Spinner animation="border" variant="primary"/>
                            </span>
                        </> : null
                    } </div>
                </form>
            </div>
        </div>
    )
}
