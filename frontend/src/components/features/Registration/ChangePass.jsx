import { useHistory, useLocation } from "react-router-dom"
import React, { useEffect, useState, useContext,useRef } from "react"
import { AuthContext } from '../../Context/AuthContext';
import './Registration.css';
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import useScrollToTop from '../js_features/useScrollTop'
import Spinner from 'react-bootstrap/Spinner';

toast.configure();

export default function ChangePass() {
    const [loading, setloading] = useState(false);
    const focusPoint = useRef(null);

    const { isAuthenticated,user } = useContext(AuthContext);
    const history = useHistory();
    useEffect(() => {
        if (!isAuthenticated)
            history.push('/')
    }, [])

    const [newPwd, setnewPwd] = useState({
       opwd:"", pwd: "", cpwd: ""
    })
    const [verified, setVerified] = useState(false)

    const handle_user_inputs = (e) => {
        const { name, value } = e.target;
        setnewPwd({ ...newPwd, [name]: value })
    }

    const submitData = async (e) => {
        e.preventDefault();
        setloading(true)
        focusPoint.current.disabled = true;
        axios.post('/ChangeToNewPassword', { user: user,newPwd:newPwd })
        .then(res => {
            toast.success(res.data.msg, { position: toast.POSITION.BOTTOM_LEFT });
            history.push('/');
        })
        .catch(err => {
            setloading(false)
            setInterval(()=> 
            {
                try{
                focusPoint.current.disabled = false;
                }catch{
                    clearInterval();
                }
           },3000)
                toast.error(err.response.data.msg, { position: toast.POSITION.BOTTOM_LEFT })})
    }
    // useEffect(()=>{useScrollToTop();},[])
    useEffect(()=>{
        const body = document.querySelector('#root');
        body.scrollIntoView({
            behavior: 'smooth'
        }, 500)
      },[])
    return (
        isAuthenticated?<><div>
            <div className="wrapper">
                <form className="form-right">
                    <h2 className="text-uppercase">Change Password</h2>

                    <div className="mb-3">
                        <label>Old Password</label>
                        <input autoComplete="Off" type="password" name="opwd" id="opwd" className="input-field" onChange={handle_user_inputs} required />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input autoComplete="Off" type="password" name="pwd" id="pwd" className="input-field" onChange={handle_user_inputs} required />
                    </div>
                    <div className="mb-3">
                        <label>Confirm Password</label>
                        <input autoComplete="Off" type="password" name="cpwd" id="cpwd" className="input-field" onChange={handle_user_inputs} required />
                    </div>

                    <div className="form-field">
                        <input autoComplete="Off" type="submit" ref={focusPoint} value="Submit" className="register" name="register" onClick={submitData} />
                    {loading ? <>
                            <span className="p-2"><Spinner animation="border" variant="primary"/>
                            </span>
                        </> : null
                    }
                    </div>
                </form>
            </div>
        </div></>:null
    )
}
