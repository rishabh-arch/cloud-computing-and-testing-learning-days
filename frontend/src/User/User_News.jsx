import React, { useEffect, useState, useContext } from 'react'
import User_table from './components/User_Newstable'
import axios from "axios"
import { AuthContext } from '../components/Context/AuthContext';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Helmet } from "react-helmet";
toast.configure();
export default function User_News() {
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);
    const [NewsData, setNewsData] = useState({});
    const [SelectedInp, SetSelectedInp] = useState([]);
    useEffect(() => {
        axios.post("/userNewsData", user).then(res => {
            setNewsData(res.data.NewsData)
        })
    }, [isAuthenticated, user])
    useEffect(() => {
        if (SelectedInp.length > 0) {
            confirmAlert({
                title: 'Confirm Delete',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            axios.post("/DeleteuserNewsData", { user, SelectedInp }).then(res => { // setNewsData(res.data.NewsData)
                                SetSelectedInp([]);
                                setNewsData(res.data.NewsData)
                                toast.success(res.data.Message, { position: toast.POSITION.BOTTOM_LEFT });
                            }).catch(err => toast.success(err.response.data.error, { position: toast.POSITION.BOTTOM_LEFT }))
                        }
                    }, {
                        label: 'No',
                        onClick: () => { }
                    }
                ]
            })

        }
    }, [SelectedInp])
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Your Feed</title>
            </Helmet>
            <div className="container mt-5">
                <div className="table-responsive">
                    {
                        (NewsData.length > 0) ? <>
                            <span onClick={
                                () => {
                                    const todo = [...document.querySelectorAll('.inp:checked')].map(e => e.value);
                                    SetSelectedInp(todo);
                                }
                            }>
                                <span className="h4">
                                    <i className="pl-2 text-danger fa fa-trash"></i>
                                </span>
                            </span>
                            <table className="table table-striped table-primary text-white table-hover">
                                <thead>
                                    <tr>
                                        <th className="text-center"><input onChange={
                                            (e) => {
                                                let checkboxes = document.querySelectorAll(".inp");
                                                checkboxes.forEach(function (ele) {
                                                    if (!e.target.checked)
                                                        ele.checked = false;
                                                    else
                                                        ele.checked = true;
                                                });
                                            }
                                        }
                                            type="checkbox" /></th>
                                        <th colSpan="2">News</th>
                                        <th>Image</th>
                                    </tr>
                                </thead>
                                <tbody>{Object.keys(NewsData).map((a, i) => <User_table key={i} props={
                                        NewsData[a]} />)}</tbody>
                            </table>
                        </> : <>
                            <div className="container p-3 my-3 bg-primary text-white text-center h5">Your Feed wiil Show Here</div>
                        </>
                    }</div>
            </div>
        </div>
    )
}
