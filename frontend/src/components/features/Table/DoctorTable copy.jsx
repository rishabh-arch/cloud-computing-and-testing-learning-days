import React from "react";
import DoctorPost from "./DoctorPost";
import './DoctorTable.css'
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

const Doctortable = () => {

    $(document).ready(function () {
        $('#example').DataTable();
    });

    return (<div className="container">
        <form action="controller" method="get" className="d-md-flex d-sm-block justify-content-between">
            <input type="hidden" name="command" value="select-orders"/>
            <h1 className="h5 align-self-center col-3">Search Order</h1>
            <div className="btn-group align-self-center col-12 col-sm-12 col-md-8 col-lg-6">
                <select name="searchType" className="btn btn-outline-dark col-3 col-sm-3">
                    <option value="orderId">Order ID</option>
                    <option value="created">Created</option>
                    <option value="customer">Customer</option>
                    <option value="status">Status</option>
                </select>
                <input type="search" name="searchBy" className="col-6 col-sm-6"/>
                <input type="submit" value="Search" className="btn btn-outline-dark col-3 col-sm-3"/>

                </div>
            </form>
            <div className="d-md-flex d-none justify-content-md-between justify-content-sm-center align-content-center border-bottom border-2 my-2 bg-primary text-light p-3 rounded-3">
                <div className="col-2 text-sm-center text-md-start align-self-center">
                    <h1 className="h5 fw-bold">Order ID</h1>
                </div>
                <div className="col-2 align-self-center">
                    <h1 className="h5 fw-bold">Created</h1>
                </div>
                <div className="col-3 align-self-center">
                    <h1 className="h5 fw-bold">Customer</h1>
                </div>
                <div className="col-2 align-self-center">
                    <h1 className="h5 fw-bold">Show details</h1>
                </div>
                <div className="col-2 align-self-center">
                    <h1 className="h5 fw-bold">Status</h1>
                </div>
            </div>
            <div className="d-md-flex d-sm-block justify-content-md-between justify-content-sm-center text-center border-bottom border-2 my-2 bg-light p-2 rounded-3">
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">2F456DA</h1>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">04/12/2021 3:15:24:299</h1>
                </div>
                <div className="col-md-3 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">Robert Tailor Hamonovych</h1>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <a className="btn btn-outline-dark w-100" href="#">Details</a>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <form method="get" action="controller" className="d-flex btn-group">
                        <input type="hidden" name="command" value="refresh-order-status"/>
                        <select name="status" className="btn btn-outline-dark">
                            <option value="REGISTERED" className="form-select-button">REGISTERED</option>
                            <option value="PAID" className="form-select-button">PAID</option>
                            <option value="CANCELED" className="form-select-button">CANCELED</option>
                        </select>
                        <input type="submit" className="btn btn-outline-dark" value="OK"/>
                    </form>
                </div>
            </div>
            <div className="d-md-flex d-sm-block justify-content-md-between justify-content-sm-center text-center border-bottom border-2 my-2 bg-light p-2 rounded-3">
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">D2903WE</h1>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">03/09/2021 3:15:24:299</h1>
                </div>
                <div className="col-md-3 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">Jason Tailor Hamonovych</h1>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <a className="btn btn-outline-dark w-100" href="#">Details</a>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <form method="get" action="controller" className="d-flex btn-group">
                        <input type="hidden" name="command" value="refresh-order-status"/>
                        <select name="status" className="btn btn-outline-dark">
                            <option value="REGISTERED" className="form-select-button">REGISTERED</option>
                            <option value="PAID" className="form-select-button">PAID</option>
                            <option value="CANCELED" className="form-select-button">CANCELED</option>
                        </select>
                        <input type="submit" className="btn btn-outline-dark" value="OK"/>
                    </form>
                </div>
            </div>
            <div className="d-md-flex d-sm-block justify-content-md-between justify-content-sm-center text-center border-bottom border-2 my-2 bg-light p-2 rounded-3">
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">5463783D</h1>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">19/10/2021 3:34:24:299</h1>
                </div>
                <div className="col-md-3 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">Mike Orley Hemington</h1>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <a className="btn btn-outline-dark w-100" href="#">Details</a>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <form method="get" action="controller" className="d-flex btn-group">
                        <input type="hidden" name="command" value="refresh-order-status"/>
                        <select name="status" className="btn btn-outline-dark">
                            <option value="REGISTERED" className="form-select-button">REGISTERED</option>
                            <option value="PAID" className="form-select-button">PAID</option>
                            <option value="CANCELED" className="form-select-button">CANCELED</option>
                        </select>
                        <input type="submit" className="btn btn-outline-dark" value="OK"/>
                    </form>
                </div>
            </div>
            <div className="d-md-flex d-sm-block justify-content-md-between justify-content-sm-center text-center border-bottom border-2 my-2 bg-light p-2 rounded-3">
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">324516AD</h1>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">03/02/2021 22:45:44:999</h1>
                </div>
                <div className="col-md-3 text-sm-center text-md-start align-self-center my-2">
                    <h1 className="h6">Jessy Koper Fauer</h1>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <a className="btn btn-outline-dark w-100" href="#">Details</a>
                </div>
                <div className="col-md-2 text-sm-center text-md-start align-self-center my-2">
                    <form method="get" action="controller" className="d-flex btn-group">
                        <input type="hidden" name="command" value="refresh-order-status"/>
                        <select name="status" className="btn btn-outline-dark">
                            <option value="REGISTERED" className="form-select-button">REGISTERED</option>
                            <option value="PAID" className="form-select-button">PAID</option>
                            <option value="CANCELED" className="form-select-button">CANCELED</option>
                        </select>
                        <input type="submit" className="btn btn-outline-dark" value="OK"/>
                    </form>
                </div>
            </div>
            </div>
        )
                
                }
                
                export default Doctortable;
