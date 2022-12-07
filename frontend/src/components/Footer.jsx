import React,{useContext} from "react";
import {NavLink} from "react-router-dom"
import { AuthContext } from './Context/AuthContext';
 
const Footer = () =>{
    const { isAuthenticated} = useContext(AuthContext);

    return (
<footer className="bg-white">
     <div className="container py-5 al">
         <div className="row py-3">
             <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
                 <h6 className="text-uppercase font-weight-bold mb-4">About</h6>
                 <ul className="list-unstyled mb-0">
                     <li className="mb-2"><NavLink to="/contactus" className="text-muted">Contact Us</NavLink></li>
                     <li className="mb-2"><NavLink to="about" className="text-muted">About Us</NavLink></li>
                     <li className="mb-2"><a target="_blank" href="https://www.linkedin.com/in/rishabhgargln" className="fa fa-linkedin text-primary " > Profile</a></li>
                 </ul>
             </div>
             <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
                 <h6 className="text-uppercase font-weight-bold mb-4">Website</h6>
                 <ul className="list-unstyled mb-0">
                 
                     <li className="mb-2"><NavLink to="/Twitter" className="text-muted">Twitter Bot</NavLink></li>
                
                     <li className="mb-2"><NavLink to="/news" className="text-muted">News Feed</NavLink></li>
                     {/* <li className="mb-2"><NavLink to="/LinkUrl" className="text-muted">LinkUrl</NavLink></li> */}
                 </ul>
             </div>
             {/* <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
                 <h6 className="text-uppercase font-weight-bold mb-4">Policy</h6>
                 <ul className="list-unstyled mb-0">
                     <li className="mb-2"><NavLink to="#" className="text-muted">Return Policy</NavLink></li>
                     <li className="mb-2"><NavLink to="#" className="text-muted">Terms Of Use</NavLink></li>
                     <li className="mb-2"><NavLink to="#" className="text-muted">Security</NavLink></li>
                     <li className="mb-2"><NavLink to="#" className="text-muted">Privacy</NavLink></li>
                 </ul>
             </div> */}
             <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
                 <h6 className="text-uppercase font-weight-bold mb-4">WEEE</h6>
                 <ul className="list-unstyled mb-0">
                     <li className="mb-2"><NavLink to="/login" className="text-muted">Login</NavLink></li>
                     <li className="mb-2"><NavLink to="/registration" className="text-muted">Register</NavLink></li>
                     
                     {isAuthenticated?<><li className="mb-2"><NavLink to="/changepassword" className="text-muted">Change Password</NavLink></li></>:<><li className="mb-2"><NavLink to="/forgotpassword" className="text-muted">Forgot Password</NavLink></li></>}


                     {/* <li className="mb-2"><NavLink to="#" className="text-muted"></NavLink></li> */}
                 </ul>
             </div>
             <div className="col-lg-4 col-md-6 mb-lg-0">
                 {/* <h6 className="text-uppercase font-weight-bold mb-4">Registered Office Address</h6>
                 <p className="text-muted mb-4">Here , write the complete address of the Registered office address along with telephone number.</p> */}
                 <ul className="list-inline mt-4">
                     <li className="list-inline-item"><NavLink to="#" target="_blank" title="twitter"><i className="fab fa-2x fa-twitter"></i></NavLink></li>
                     <li className="list-inline-item"><NavLink to="#" target="_blank" title="facebook"><i className="fab fa-2x fa-facebook-f"></i></NavLink></li>
                     <li className="list-inline-item"><NavLink to="#" target="_blank" title="instagram"><i className="fab fa-2x fa-instagram"></i></NavLink></li>
                     <li className="list-inline-item"><NavLink to="#" target="_blank" title="pinterest"><i className="fab fa-2x fa-youtube"></i></NavLink></li>
                     <li className="list-inline-item"><NavLink to="#" target="_blank" title="vimeo"><i className="fab fa-2x fa-google"></i></NavLink></li>
                 </ul>
             </div>
         </div>
     </div>
     <hr className="p-0 m-0 b-0"/>
     <div className="bg-light py-2">
         <div className="container text-center">
             <p className="text-muted mb-0 py-2">© 2022 WEEE All rights reserved.</p>
         </div>
     </div>
 </footer>
        
    )

}

export default Footer;