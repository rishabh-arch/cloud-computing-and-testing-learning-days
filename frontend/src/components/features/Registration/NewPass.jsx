import {useHistory, useLocation } from "react-router-dom"
import React, { useEffect, useState, useContext } from "react"
import './Registration.css';
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();
// const useScrollToTop = () => {
//     useEffect(() => {
//         window.scrollTo({behavior: 'smooth', top: 0 });
//         // scroll to the top of the browser window when changing route
//         // the window object is a normal DOM object and is safe to use in React.
//     }, [location]);
// };
export default function NewPass() {
    
    useEffect(()=>{
        const body = document.querySelector('#root');
        body.scrollIntoView({
            behavior: 'smooth'
        }, 500)
      },[])
  
    const location = useLocation();
    const search = location.pathname
    const search1 = location.search;
    const params = new URLSearchParams(search1).get('token');
    const history = useHistory();
    const [user, setUser] = useState({
        pwd: "", cpwd: ""
    })
    const [verified, setVerified] = useState(false)

    const handle_user_inputs = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }

    useEffect(() => {
        axios.post('/NewUserPassword', { token: params })
            .then(res => {
                toast.success(res.data.msg, { position: toast.POSITION.BOTTOM_LEFT });
                setVerified("true")
            })
            .catch(err => {
                history.push('/');
                toast.error(err.response.data.msg, { position: toast.POSITION.BOTTOM_LEFT })
            })
    }, [])


    const submitData = async (e) => {
        e.preventDefault();
        axios.post('/NewUserPasswordVerified',{token:params,user:user})
            .then(res => {
                toast.success(res.data.msg, { position: toast.POSITION.BOTTOM_LEFT });
                history.push('/');
            })
            .catch(err => toast.error(err.response.data.msg, { position: toast.POSITION.BOTTOM_LEFT }))
    }

    // useScrollToTop();

    const accessField = () => {
        return <>
            <div className="wrapper">
                <form className="form-right">
                    <h2 className="text-uppercase">New Password</h2>

                    <div className="mb-3">
                        <label>Password</label>
                        <input autoComplete="Off" type="password" name="pwd" id="pwd" className="input-field" onChange={handle_user_inputs} required />
                    </div>
                    <div className="mb-3">
                        <label>Confirm Password</label>
                        <input autoComplete="Off" type="password" name="cpwd" id="cpwd" className="input-field" onChange={handle_user_inputs} required />
                    </div>

                    <div className="form-field">
                        <input autoComplete="Off" type="submit" value="Submit" className="register" name="register" onClick={submitData} />
                    </div>
                </form>
            </div>
        </>
    }

    return (
        <div>
            {accessField()}
        </div>
    )
}
