import React from "react";
import "./loading.css"
const Loading = (posts) => {

    return (
        <div id="loader">
            <svg className="circlespinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        </div>

    )

}

export default Loading;