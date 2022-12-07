import React,{useContext} from 'react'
import axios from "axios"
import { AuthContext } from '../../Context/AuthContext';
import { confirmAlert } from 'react-confirm-alert'; // Import
import {toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure() ;
export default function Admin_Del(id,postLink,ref_email) {
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);

        if (isAuthenticated && user.role === 'admin')
            return <><td className="fa fa-trash text-danger h3" onClick={() => {
                confirmAlert({
                    title: 'Confirm Delete (Admin Only)?',
                    message: 'Are you sure to do this.',
                    buttons: [
                        {
                            label: 'Yes',
                            onClick: () => {
                                axios
                                    .post(`/admin_Control?action=${postLink}`, {user,reference:id})
                                .then(res => { toast.success(res.data.msg,{position: toast.POSITION.BOTTOM_LEFT})

                                }
                                )
                                .catch(err=> toast.error(err.response.data.msg,{position: toast.POSITION.BOTTOM_LEFT}))
                            }
                        },
                        {
                            label: 'No',
                            onClick: () => { }
                        },
                        { 
                            label: 'Delete This User',
                            onClick: () => {
                                axios
                                    .post(`/admin_Control?action=${300}`, {user,reference:ref_email})
                                .then(res => { toast.success(res.data.msg,{position: toast.POSITION.BOTTOM_LEFT})
                                }
                                )
                                .catch(err=> toast.error(err.response.data.msg,{position: toast.POSITION.BOTTOM_LEFT}))
                            },
                            className:"bg-danger"
                        }
                    ]
                })


            }} /></>
        else
            return null
}
