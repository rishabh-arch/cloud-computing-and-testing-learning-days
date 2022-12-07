import React, { useEffect, useState, useContext } from 'react'
import UserResTable from './components/User_ResTable '
import axios from "axios"
import { AuthContext } from '../components/Context/AuthContext';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Helmet } from "react-helmet";
toast.configure();



export default function User_Resource() {
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);

    const [NewsData, setNewsData] = useState({});
    const [SelectedInp, SetSelectedInp] = useState([]);

    useEffect(() => {
        axios.post("/userResourceData", user)
            .then(res => {
                setNewsData(res.data.NewsData)

            })
    }, [isAuthenticated, user])
    useEffect(() => {
        let isMounted = true;
        if (SelectedInp.length > 0) {
            confirmAlert({
                title: 'Confirm Delete',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            axios.post("/DeleteuserResourceData", {
                                user, SelectedInp
                            })
                                .then(res => {
                                    if (isMounted){
                                    // setNewsData(res.data.NewsData)
                                    SetSelectedInp([]);
                                    setNewsData(res.data.NewsData)
                                    toast.success(res.data.Message, { position: toast.POSITION.BOTTOM_LEFT });
                                }})
                                .catch(err =>
                                    toast.success(err.respnse.data.error, { position: toast.POSITION.BOTTOM_LEFT })
                                )
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => { }
                    }
                ]
            })
            return () => { isMounted = false };
        }
    }, [SelectedInp])



    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Your Resource</title>
            </Helmet>
            <div className="container mt-5">
                <div className="table-responsive">
                    {(NewsData.length > 0) ?
                        <>
                            <span onClick={() => {
                                const todo = [...document.querySelectorAll('.inp:checked')].map(e => e.value);
                                SetSelectedInp(todo);
                            }}><span className="text-danger h4"><i className="pl-2 fa fa-trash h2"></i></span></span>
                            <table className="table table-striped table-primary text-white table-hover">
                                <thead>
                                    <tr>
                                        <th className="text-center"><input onChange={(e) => {
                                            let checkboxes = document.querySelectorAll(".inp");
                                            checkboxes.forEach(function (ele) {
                                                if (!e.target.checked)
                                                    ele.checked = false;
                                                else
                                                    ele.checked = true;
                                            });
                                        }} type="checkbox" /></th>
                                        <th colspan="2">Covid Resource</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(NewsData).map((a, i) =>
                                    <UserResTable props={NewsData[a]} />)}
                                </tbody>
                            </table>
                        </> : <>
                            <div className="container p-3 my-3 bg-primary text-white text-center h5">Your Covid Resource wiil Show Here</div>
                        </>
                    }</div>
            </div>
        </div>
    )
}
