import React, { useEffect, useState,useContext } from "react";
import axios from "axios"
import { toast } from 'react-toastify';
import { ResendResource } from '../Resource';

const SearchSuppliers = () => {
    const { SetSendResource  } = useContext(ResendResource);
    const [State, setState] = useState({});
    const [District, setDistrict] = useState(0);
    const [Resource_data, setResource_data] = useState({District_One:"",State_One:"",Resource_One:""});
    const Resource_handler = (e) => {
        const { name, value } = e.target;
        setResource_data({ ...Resource_data, [name]: value })
    }
    const SearchClick = () => {
        axios.post("/searchResource", Resource_data)
            .then((res) => {
            SetSendResource(res.data.resourceTable)
            })
           .catch((err) => { toast.error(err, { position: toast.POSITION.BOTTOM_LEFT }) })
        }

    const states_json = "states_and_districts.json";
    useEffect(()=>{
        let isMounted = true;
        axios
        (states_json,{
            headers: {
              'Content-Type': 'application/json',"X-Content-Type-Options": "nosniff"
            }}).then(async (response)=>{
                if (isMounted){
            setState(() => response.data["states"])}
        })
        return () => { isMounted = false };
    },[])

    useEffect(() => {
        document.getElementById('district_change').getElementsByTagName('option')[0].selected = 'selected';
    }, [District])

    return (
        <div id="searchsplr" className="tab-pane active">
            <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12">
                    {/* <form id="searchform"> */}
                        <div className="box box-primary"
                            style={{ marginBottom: "0px", borderTopColor: "#2439b0" }}>

                            <div className="box-body">
                                <label style={{ marginTop: "3%" }} className="text-info fs-17">Search By Entering Details 💙</label>
                                <div className="row">
                                    <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12"
                                        style={{ marginTop: "2%", "display": "flex", "flexWrap": "wrap" }}>
                                        <div className="col-md-4 col-sm-4 col-xs-12 col-lg-4">
                                            <div className="form-group">
                                                <label>Ewaste Resource<span
                                                    className="error">*</span></label>
                                                <select name="Resource_One" onChange={Resource_handler} className="form-control"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Laptop">Laptop</option>
                                                    <option value="Mobile phones">Mobile phones</option>
                                                    <option value="Electronic">Electronic</option>
                                                    <option value="Medical">Medical</option>
                                                    <option value="Computer">Computer</option>
                                                    <option value="HouseHold">HouseHold</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-4 col-xs-12 col-lg-4">
                                            <div className="form-group">
                                                <label>State<span className="error">*</span></label>
                                                <select id="state_select" name="State_One" className="form-control" onChange={(e) => { Resource_handler(e)
                                                 setDistrict(() => (e.target.value !== "") ? State[e.target.value]["districts"] : {}) }}>
                                                    <option value="" defaultChecked>Select</option>
                                                    {
                                                        Object.keys(State).map((a, i) => {
                                                            var z = 
                                                                <option key={a} value={a}>{State[a]["state"]}
                                                                </option>
                                                            ;

                                                            return z;
                                                        })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-4 col-xs-12 col-lg-4">
                                            <div className="form-group">
                                                <label>District(Optional)</label>
                                                <select id="district_change" name="District_One" onChange={Resource_handler} className="form-control" >
                                                    <option value="" defaultChecked>Select</option>
                                                    {
                                                        Object.keys(District).map((a, i) => {
                                                            var z = 
                                                                <option key={a} >{District[a]}
                                                                </option>
                                                            ;

                                                            return z;
                                                        })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-4 col-xs-12 col-lg-4"></div>
                                    </div>




                                </div>
                            </div>

                            <div className="box-footer ptb-0">
                                <div className="col-md-4 col-sm-4 col-xs-12 col-lg-4">
                                    <button type="submit" onClick={SearchClick} className="btn btn-success searchbtn" style={{ "background": "#2439b0" }}><a href="#res_result" className="text-decoration-none text-white">Search</a></button>
                                </div>

                            </div>


                            <br />
                        </div>

                    {/* </form> */}
                </div>

            </div>
        </div>


    )


}

export default SearchSuppliers;