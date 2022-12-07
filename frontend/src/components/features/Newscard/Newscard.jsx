import React,{useRef,useContext} from "react";
import "./Newscard.css"
import Admin_Del from '../js_features/Admin_Del'
import timeAgo from "../js_features/timeAgo"
import { NavLink, useHistory, useLocation } from "react-router-dom"

import ImageZoom from 'react-medium-image-zoom'

const Newscard = (news_props) =>{
    const baseURL = window.location.origin;
    const ImgZoom = useRef(null);
    return (
<div className="container mt-5 mb-5">
    <div className="row d-flex">
        <div className="col-md-8">
            <div className="d-flex flex-row"></div>
            <div className="row news-card p-3 bg-white-news">
                <div className="col-md-4">
                    <div className="feed-image"><ImageZoom ref={ImgZoom}
        image={{
          src: `uploads/thumbnail/${news_props.news_image}`,
          alt: `${news_props.news_image}`,
          className: 'news-feed-image rounded img-fluid img-responsive',
          style: { width: '50em' }
        }}
        zoomImage={{
          src: `uploads/${news_props.news_image}`,
          alt: `${news_props.news_image}`,
        }
        }
        shouldReplaceImage={false}
        // defaultStyles={{zoomImage:100}}
        zoomMargin={10}
        // shouldRespectMaxDimension={true}
      />
      </div>
                </div>
                <div className="col-md-8">
                    <div className="news-feed-text" style={{wordBreak:"break-all"}}>
                
                        <h5 className="d-sm-inline">{(news_props.news_title)}</h5>🔹<span style={{fontSize:"13px"}}> {timeAgo(new Date(news_props.news_ID))}</span><br/>
                        <span dangerouslySetInnerHTML={{__html:news_props.news_box }}></span>
                        <div className="d-flex flex-row align-items-center mt-2">

                           <a className="pr-3" href={`https://api.whatsapp.com/send?text=${baseURL}/search?input=${news_props.news_image}`} data-action="share/whatsapp/share" target="_blank"><i className="fa fa-whatsapp share text-success"></i></a> 

                           {/* <a className="pr-3" href={`https://www.facebook.com/sharer/sharer.php?u=${baseURL}/search?input=${news_props.news_image}`} data-action="share/facebook/share" target="_blank"><i className="fa fa-facebook share blue"></i></a>  */}

                           <a className="pr-3"  href={`http://twitter.com/share?url=${baseURL}/search?input=${news_props.news_image}`} data-action="share/twitter/share"  target="_blank"><i className="fa fa-twitter share text-primary"></i></a> 
                        <h5 className="font-italic" style={{fontSize:"13px"}} >from : {(news_props.email)}</h5>
                        </div>
                    </div>
                </div>
            </div>
            {Admin_Del(news_props.news_ID,200,news_props.email)}
        </div>
    </div>
</div>
        
    )

}

export default Newscard;