import React, { useState,useRef } from "react"
import "./Contact.css"
import axios from 'axios'
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet";
toast.configure();

const Contact = () => {
    const focusPoint = useRef(false);

    const [userQuery, setUserQuery] = useState({
        Con_name: "", Con_email: "", Con_phone: "", Con_msg: ""
    })
    const ContactHandler = (e) => {
        const { name, value } = e.target;
        setUserQuery({ ...userQuery, [name]: value })
    }

    const submitQuery = () => {
        axios.post('/personQuery', userQuery)
            .then((res) =>{
            focusPoint.current.disabled = true;
                toast.success(res.data.msg, { position: toast.POSITION.BOTTOM_LEFT })}
            )
            .catch(err => toast.error(err.response.data.msg, { position: toast.POSITION.BOTTOM_LEFT }))

    }
    return (
        <div className="container d-flex justify-content-center">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Get in Touch</title>
            </Helmet>
            <div className="row">
                <div className="col-md-6">
                    <img src="https://hayatrecyclers.com/wp-content/uploads/2018/07/E-waste-Disposal.png" alt="IMG" />
                </div>
                <div className="col-md-6">
                    <h2 className="form-title">Contact us</h2>
                    <p className="justify text-muted">Have an enquiry or would like to give us feedback?<br />Fill out the form below to contact our team.</p>
                    <form>
                        <div className="form-group pt-2 pl-1">
                            <label htmlFor="exampleInputName">Your name</label>
                            <input type="text" className="form-control" onChange={ContactHandler} name="Con_name" id="exampleInputName" />
                        </div>
                        <div className="form-group pl-1">
                            <label htmlFor="exampleInputEmail1">Your email address</label>
                            <input type="email" className="form-control" onChange={ContactHandler} name="Con_email" id="exampleInputEmail1" />
                        </div>
                        <div className="form-group pl-1">
                            <label htmlFor="exampleInputPhone">Phone(Optional)</label>
                            <input type="tel" className="form-control" onChange={ContactHandler} name="Con_phone" id="exampleInputPhone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" />
                        </div>
                        <div className="form-group pl-1">
                            <label htmlFor="exampleFormControlTextarea1">Your message</label>
                            <textarea className="form-control" onChange={ContactHandler} name="Con_msg" id="exampleFormControlTextarea1" rows="5"></textarea>
                        </div>
                        <div className="row">
                            <div className="col-md-3 offset-md-9">
                                <button type="submit" ref={focusPoint} onClick={submitQuery} className="btn btn-Contact btn-primary">Send</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    )
}
export default Contact;
