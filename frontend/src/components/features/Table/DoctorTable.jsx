import React from "react";
import DoctorPost from "./DoctorPost";
import './DoctorTable.css'

const Doctortable = () => {

   

    return (<div>
        <div className="page-content page-container" id="page-content">
            <div className="padding">
                <div className="row container d-flex justify-content-center">
                    <div className="col-lg-8 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Basic Hoverable Table</h4>
                     
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Product</th>
                                                <th>Sale</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Hitesh Chauhan</td>
                                                <td>Engine</td>
                                                <td className="text-danger"> 18.76% <i className="fa fa-arrow-down"></i></td>
                                                <td><label className="badge badge-danger">Pending</label></td>
                                            </tr>
                                            <tr>
                                                <td>Samso Palto</td>
                                                <td>Brakes</td>
                                                <td className="text-danger"> 11.06% <i className="fa fa-arrow-down"></i></td>
                                                <td><label className="badge badge-warning">In progress</label></td>
                                            </tr>
                                            <tr>
                                                <td>Tiplis mang</td>
                                                <td>Window</td>
                                                <td className="text-danger"> 35.00% <i className="fa fa-arrow-down"></i></td>
                                                <td><label className="badge badge-info">Fixed</label></td>
                                            </tr>
                                            <tr>
                                                <td>Pter parker</td>
                                                <td>Head light</td>
                                                <td className="text-success"> 22.00% <i className="fa fa-arrow-up"></i></td>
                                                <td><label className="badge badge-success">Completed</label></td>
                                            </tr>
                                            <tr>
                                                <td>Ankit Dave</td>
                                                <td>Back light</td>
                                                <td className="text-success"> 28.05% <i className="fa fa-arrow-up"></i></td>
                                                <td><label className="badge badge-warning">In progress</label></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <DoctorPost />
    </div>)

}

export default Doctortable;
