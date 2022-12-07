import React, { useEffect, useState, useContext, useRef } from "react"
import { Button } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { AuthContext } from '../../../Context/AuthContext';
import axios from "axios"
import { toast } from 'react-toastify';
toast.configure();
const PostSuppliers = () => {

    const buttonRef = useRef();
    const history = useHistory();
    const { isAuthenticated, user } = useContext(AuthContext);
    const [ResourceData, setResourceData] = useState({
        Address: "", Address_one: "", Resource_One: ""
    });
    const [AuthUser, setAuthUser] = useState({});

    // const [District, setDistrict] = useState(0);
    const ResourceInputs = (e) => {
        const { name, value } = e.target;
        setResourceData({ ...ResourceData, [name]: value })

    }
    const submitResource = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            axios
            .post("/postResource", ResourceData).then(async (res) => {
                toast.success(res.data.message, { position: toast.POSITION.BOTTOM_LEFT })
                buttonRef.current.disabled = true; 
                setTimeout(() => {
                    history.push('/userSupplies');
                }, 2000)
            }).catch((err) => { toast.error(err.response.data.error, { position: toast.POSITION.BOTTOM_LEFT }) })

        }
    }
    useEffect( () => {
        let isMounted = true; 
        if (isAuthenticated) {
            axios
                .post("/userDetail", user).then(async (res) => {
                    if (isMounted) setAuthUser(res.data);
                })
        }
        return () => { isMounted = false };
    }, [isAuthenticated,user])
    return (

        <div id="menu1" className="tab-pane fade">
            <div className="containfder">
                <div className=" text-center">
                </div>
                <div className="row ">
                    <div className="col-lg-7 mx-auto">
                        <div className="mt-2 mx-auto p-2" style={{ backgroundColor: "none" }}>
                            <div className="card-body">
                                {!isAuthenticated ? <div><div className="alert alert-danger" role="alert">
                                    Sorry! but we Require User Detail <span className="alert-link">To Add Suppliers</span>. Registration is easy as Changing a TV Channel <span className="alert-link">Why are you wasting your time here Go and JUST DO IT.</span>
                                </div><NavLink to="/login"><Button>Sign-In</Button></NavLink>


                                </div> :
                                    <div>

                                        <div className="alert alert-primary" role="alert">
                                            Sorry! but we Require User Detail <span className="alert-link">To Add Suppliers</span>. Registration is easy as Changing a TV Channel <span className="alert-link">Why are you wasting your time here Go and JUST DO IT.</span>
                                        </div>
                                        <form id="contact-form" method="post">
                                            <div className="controls">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group"> <label htmlFor="form_name">State</label> <input id="form_name" type="text" defaultValue={AuthUser.user_State} disabled className="form-control" /> </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group"> <label htmlFor="form_name2">District</label> <input id="form_name2" type="text" defaultValue={AuthUser.user_City} disabled className="form-control" /> </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group"> <label htmlFor="form_name3">Address</label> <textarea id="form_name3" type="textarea" defaultValue={AuthUser.Address} onChange={ResourceInputs} name="Address" className="form-control" placeholder="Please enter Full Address" rows="5" /> </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group"> <label htmlFor="form_name4">Resource Address</label> <textarea id="form_name4" defaultValue={AuthUser.Address_one} onChange={ResourceInputs} type="textarea" name="Address_one" className="form-control" placeholder="Like Flat Number,House No," rows="5" /> </div>
                                                    </div>


                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Covid Resource<span
                                                                className="error">*</span></label>
                                                            <select name="Resource_One" onChange={ResourceInputs} className="form-control"
                                                            >
                                                                <option value="">Select</option>
                                                    <option value="Laptop">Laptop</option>
                                                    <option value="Mobile phones">Mobile phones</option>
                                                    <option value="Electronic">Electronic</option>
                                                    <option value="Medical">Medical</option>
                                                    <option value="Computer">Computer</option>
                                                    <option value="HouseHold">HouseHold</option>
                                                            </select>
                                                        </div>

                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group"> <label htmlFor="form_name">Contact</label> <input id="form_name6" type="text" defaultValue={AuthUser.user_Contact} disabled className="form-control" /> </div>
                                                    </div>
                                                </div>
                                                <div className="row">

                                                    <div className="col-md-12"> <input ref={buttonRef} onClick={submitResource} type="submit" className="btn btn-primary btn-send pt-2 btn-block font-weight-bolder " value="Submit Resource" /> </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )


}

export default PostSuppliers;