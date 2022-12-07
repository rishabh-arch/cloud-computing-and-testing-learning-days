import React, { Suspense, useEffect, useState } from "react";
import Newscard from "./features/Newscard/Newscard.jsx"
import Postcard from "./features/Newscard/postcard.jsx"
import axios from "axios"
// const Calendar = React.lazy(() => import('./features/Newscard/Newscard.jsx'));

const News_container = ({posts}) => {

    return (
        <div>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            {
               posts.map((a, i) => {
                    var z =<Newscard key={a._id} news_image={a.news_image} news_title={a.news_title} news_box={a.news_box} news_ID={a.news_ID} email={a.email} />;
                    return z;
                })
            }
            {/* </Suspense> */}
        </div>

    )

}

export default News_container;