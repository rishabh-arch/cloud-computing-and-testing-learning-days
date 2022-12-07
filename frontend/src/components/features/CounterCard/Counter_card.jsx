import React from "react";
import './Counter_card.css';

const CounterCard = () =>{

    return (
<div className="container">
    <div className="row">
        <div className="four col-md-3">
            <div className="counter-box colored"> <i className="fa fa-thumbs-o-up"></i> <span className="counter">-</span>
                <p>Total Items</p>
            </div>
        </div>
        <div className="four col-md-3">
            <div className="counter-box"> <i className="fa fa-group"></i> <span className="counter">-</span>
                <p>Communities</p>
            </div>
        </div>
        <div className="four col-md-3">
            <div className="counter-box"> <i className="fa fa-shopping-cart"></i> <span className="counter">-</span>
                <p>instant Buy</p>
            </div>
        </div>
        <div className="four col-md-3">
            <div className="counter-box"> <i className="fa fa-user"></i> <span className="counter">-</span>
                <p>Saved Trees</p>
            </div>
        </div>
    </div>
</div>
        
    )

}

export default CounterCard;