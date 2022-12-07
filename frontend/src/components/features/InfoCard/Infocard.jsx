import React from "react";
import "./Infocard.css"
const Infocard = () =>{

    return (

<div className="container-fluid mt-2">
    <div className="row justify-content-center">
        <div className="col-12 col-md-5 col-sm-12 col-xs-12">
            <div className="card-info px-2 py-3 p-md-4 text-white">
                <div className="row">
                    <div className="col-3 col-md-3 text-center"> <img src="https://i.imgur.com/CFDCwbv.png" alt="" height="60px" width="70px" className=""/> </div>
                    <div className="col-9 col-md-9">
                        <h6 className="font-weight-bold mb-3">Show others that you are safe</h6>
                        <p>If you approve your profile with BankID, you are perceived as a safer person to trade with.</p> <button className="btn bg-white text-center px-3 font-weight-bold">Get started</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    )

}

export default Infocard;