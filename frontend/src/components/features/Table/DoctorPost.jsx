import React,{useState} from "react"
import "./DoctorPost.css"
const DoctorPost = () =>{
    const [user, setUser] = useState({
        D_Name: "", Contact: "", Status: "", Known_For: ""
    })
    const UploadData = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }
    const submitData = async (e) => {
        e.preventDefault()
    }
return  <section className="login-block">
<div className="container-fluid">
    <div className="row">
        <div className="col-sm-12">
            <form className="md-float-material form-material">
                <div className="auth-box card">
                    <div className="card-block">
                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="text-center"><i className="fa fa-phone-square text-primary f-56"></i></h3>
                                <h3 className="text-center contact-us">Add Your Details Too</h3>
                                <h6 className="text-center respond">(May be the atleast one person can Gets Help from you)</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group form-primary"> <input type="text" name="D_Name" onChange={UploadData} className="form-control text-left" placeholder="Name" required="" /> </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group form-primary"> <input type="text" name="Contact" onChange={UploadData} className="form-control text-left" placeholder="Contact" required="" /> </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group form-primary"> <input type="text" name="Status" onChange={UploadData} className="form-control text-left" placeholder="Status" required="" /> </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group form-primary"> <input type="text" name="Known_For" onChange={UploadData} className="form-control text-left" placeholder="Known For" required="" /> </div>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-12">
                                <button type="button" onClick={submitData} className="btn btn-primary btn-md btn-block waves-effect text-center m-b-20"><i className="fa fa-phone"></i> Click To Serve </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
</section>


}

export default DoctorPost;