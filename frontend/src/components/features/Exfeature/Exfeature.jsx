import React from "react";
import {NavLink} from "react-router-dom"
import './Exfeature.css';
 
const Exfeature = () =>{

    return (
<section className="section pb-0">
    <div className="container">
        <div className="row">
            <div className="col-lg-12 text-center">
                <h2 className="section-title">Exclusive features</h2>
            </div>
            <div className="col-lg-4 col-sm-6 mb-lg- mb-4">
                <div className="text-center position-relative px-4 py-5 rounded-lg shadow"> <img src="https://res.cloudinary.com/dxfq3iotg/image/upload/v1559058694/feature-1.png" className="img-fluid" alt="feature-image"/>
                    <h5 className="pt-5 pb-3 text-capitalize card-title">No Setup</h5>
                    <p className="mb-4">For what reason would it be advisable for me to think about business content? That might be little bit risky to have crew member like them.</p> 
                    {/* <NavLink className="btn-Ex btn-outline-primary" to="#" data-abc="true">read more</NavLink> */}
                </div>
            </div>
            <div className="col-lg-4 col-sm-6 mb-lg- mb-4">
                <div className="text-center position-relative px-4 py-5 rounded-lg shadow"> <img src="https://res.cloudinary.com/dxfq3iotg/image/upload/v1559058716/feature-2.png" className="img-fluid" alt="feature-image"/>
                    <h5 className="pt-5 pb-3 text-capitalize card-title">free trail</h5>
                    <p className="mb-4">For what reason would it be advisable for me to think about business content? That might be little bit risky to have crew member like them.</p> 
                    {/* <NavLink className="btn-Ex btn-outline-primary" to="#" data-abc="true">read more</NavLink> */}
                </div>
            </div>
            <div className="col-lg-4 col-sm-6 mb-lg- mb-4">
                <div className="text-center position-relative px-4 py-5 rounded-lg shadow"> <img src="https://res.cloudinary.com/dxfq3iotg/image/upload/v1559058733/feature-3.png" className="img-fluid" alt="feature-image"/>
                    <h5 className="pt-5 pb-3 text-capitalize card-title">optimized data</h5>
                    <p className="mb-4">For what reason would it be advisable for me to think about business content? That might be little bit risky to have crew member like them.</p>
                     {/* <NavLink className="btn-Ex btn-outline-primary" to="#" data-abc="true">read more</NavLink> */}
                </div>
            </div>
        </div>
    </div>
</section>
        
    )

}

export default Exfeature;