import React, { useEffect, useState } from 'react'
import { NavLink, useHistory, useLocation } from "react-router-dom"
import Table_search from './features/Table/Table_search.jsx'
import News from './News.jsx'
import axios from 'axios'
import { Helmet } from "react-helmet";

export default function SearchPage() {
    const [fromResource, setFromResource] = useState([])
    const [fromNews, setFromNews] = useState([])
    const d = useLocation();
    const search = d.pathname
    const search1 = d.search;
    const params = new URLSearchParams(search1).get('input');

    useEffect(() => {
        axios
            .get(`/inputSearch?input=${params}`)
            .then(res => {
                setFromResource(res.data.fromResource);
                setFromNews(res.data.fromNews);
            })
            .catch(err => console.log(err))
    }, [params])
    return (<>
        {/* {fromNews.length===1?<><Helmet>
            <meta charSet="utf-8" />
            <title>hfghgf</title>
            <link rel="canonical" href="http://mysite.com/example" />
        </Helmet></>:<><Helmet>
            <meta charSet="utf-8" />
            <title>gfhfgh</title>
            <link rel="canonical" href="http://mysite.com/example" />

        </Helmet></>} */}
        {fromResource.length > 0 ?
            <div>
                <Table_search props={fromResource} />

            </div> : <div className="container p-3 my-3 bg-primary text-white text-center h5">Sorry! But We Found Nothing from Covid Resource</div>}
        {fromNews > 0 ?
            <div>
                <News props={params} />

            </div> : <div className="container p-3 my-3 bg-primary text-white text-center h5">Sorry! But We Found Nothing from News</div>}
    </>

    )
}
