import React, { useState, useContext, useRef } from "react";
import convertText_Html from "../js_features/text_to_html";
import { AuthContext } from '../../Context/AuthContext';
import { NavLink,useHistory } from "react-router-dom"
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./postcard.css"
import { ProgressBar } from 'react-bootstrap'


const Postcard = () => {

    const focusPoint = useRef(null);
    const HashResult = useRef(null);
    const btnDisabled = useRef(null);
    const history = useHistory();

    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);
    const [newsInput, setNewsInput] = useState({
        news_title: "", news_box: "", news_image: "", news_hash: []
    })
    // const [Hash, setHash] = useState("")
    const [uploadPercentage, setUploadPercentage] = useState(0)

    const handle_News_inputs = (e) => {
        const { name, value } = e.target;
        // HashResult.current.onChange = setHash(convertText_Html(HashResult.current.value)[1]);
        setNewsInput({ ...newsInput, [name]: value, news_hash: convertText_Html(HashResult.current.value)[1] })
    }
    const handle_NewsImg_inputs = (e) => {
        const errs = [];
        const { files } = e.target;
        if (files.length > 3) {
            const msg = 'Only 1 images can be uploaded at a time'
            return toast.error(msg, { position: toast.POSITION.BOTTOM_LEFT });
        }

        const types = ['image/png', 'image/jpeg']

        // #2 Catching wrong file types on the client
        try {
            if (types.every(typeof_img => files[0].type !== typeof_img)) {
                errs.push(`'${files[0].type}' is not a supported format`)
            }

            // #3 Catching files that are too large on the client
            if (files[0].size > 15000000) {
                errs.push(`'${files[0].name}' is too large, please pick a smaller file`)
            }



            if (errs.length) {
                return errs.forEach(err => toast.error(err, { position: toast.POSITION.BOTTOM_LEFT }))
            }

            focusPoint.current.src = window.URL.createObjectURL(files[0])
            setNewsInput({ ...newsInput, news_image: files[0] })
        }
        catch (err) {
            return toast.error("Something Wrong!", { position: toast.POSITION.BOTTOM_LEFT })

        }
    }

    const changeOnClick = (e) => {
        e.preventDefault();

        const options = {

            onUploadProgress: progressEvent => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                if (percent < 100) {
                    setUploadPercentage(percent);
                }

            }
        }
        const formData = new FormData();
        formData.append("news_title", newsInput.news_title);
        formData.append("news_box", newsInput.news_box);
        formData.append("news_image", newsInput.news_image);
        formData.append("news_hash", newsInput.news_hash);

        axios.post("/Postnews", formData, options)
            .then((res) => {
                setUploadPercentage(100);
                setTimeout(() => {
                    setUploadPercentage(0);
                }, 100);
                toast.success(res.data.msg, { position: toast.POSITION.BOTTOM_LEFT });
                history.push('/userNews');
            })
            .catch((err) => {
                toast.error(err.response.data.error, { position: toast.POSITION.BOTTOM_LEFT })
                setUploadPercentage(0);
            })
    }

    const unauthenticatedNavBar = () => {
        return (
            <>
                <NavLink to="/login" style={{ textDecoration: "none" }}>  <div className="border-0 align-items-center border-left p-2 px-5 publish"><span className="ml-1">Sign In to Publish </span></div></NavLink>
            </>
        )
    }

    const authenticatedNavBar = () => {
        return (
            <>
                {
                    <button type="submit" ref={btnDisabled} className="border-0 align-items-center border-left p-2 px-5 publish" ><span className="ml-1">Publish</span></button>
                }


            </>
        )
    }
    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-center row">
                <div className="col-md-8">
                    <div className="feed">
                        <form onSubmit={changeOnClick} encType="multipart/form-data">
                            <div className="share border bg-white">
                                <div className="d-flex flex-row inputs"><input autoComplete="Off" type="text" className="border-0 form-control share-input" name="news_title" placeholder="Title" onChange={handle_News_inputs} /></div>
                                <div className="d-flex flex-row inputs"><textarea type="textarea" className="border-0 form-control share-input" name="news_box" placeholder="Share your thoughts" ref={HashResult} onChange={
                                    (e) => {
                                        const news_box_converted = { target: { value: convertText_Html(e.target.value)[0], name: "news_box" } };
                                        handle_News_inputs(news_box_converted)
                                    }
                                }

                                /></div>
                                <div className="d-flex flex-row justify-content-between border-top">
                                    <div style={{ border: "1px solid #007bff" }} className="d-flex flex-row publish-options" onClick={
                                        () => document.getElementById('post_up').click()}>
                                        <input autoComplete="Off" type="file" id="post_up" filename="news_image" accept="image/x-png ,image/jpeg" onChange={handle_NewsImg_inputs} hidden />
                                        <img src="" ref={focusPoint} id="canvas" onError={() => document.getElementById('canvas').src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Sq_blank.svg/600px-Sq_blank.svg.png'} />
                                        <div className="align-items-center border-right p-2 share"><i className="fa fa-camera text-black-50"></i><span className="ml-1">Photo</span></div>
                                    </div>
                                    <div className="publish-button">
                                        {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}

                                    </div>

                                </div>
                            </div>
                        </form>
                        <ProgressBar now={uploadPercentage}
                            striped={false}
                            label={`${uploadPercentage}%`}
                        />

                    </div>
                </div>
            </div>
        </div>
    )

}

export default Postcard;