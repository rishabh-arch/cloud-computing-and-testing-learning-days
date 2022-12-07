import React, { useState,useEffect } from "react";
import "./covidTable.css";

const Covidtable = () =>{
    const [count,setCount]=useState({});

    const url ="https://api.covid19india.org/data.json";
useEffect(()=>{
    const body = document.querySelector('#root');
    body.scrollIntoView({
        behavior: 'smooth'
    }, 500)
    let isMounted = true
    fetch(url).then((response)=>response.json()).then((data)=>{
        if (isMounted) setCount(data["statewise"]);
    })
    .catch(err=>alert("Data not Found"));
    return () => { isMounted = false };
},[]);

    return (
<div>
<section className="content-info">
    <div className="container paddings-mini mt-3">
        <div className="row">
            <div className="col-lg-12">
                <table className="table-striped table-responsive table-hover result-point font-weight-bolder" style={{backgroundColor:"#d6d3d3"}}>
                    <thead className="point-table-head display-4 text-uppercase">
                        <tr style={{backgroundColor:"rgb(0 123 255)"}}>
                            <th className="text-center text-light" style={{fontSize:"20px"}} >S.no</th>
                            <th className="text-center text-light" >state</th>
                            <th className="text-center text-light">active</th>
                            <th className="text-center text-light">confirmed</th>
                            <th className="text-center text-light">recovered</th>
                            <th className="text-center text-light">deaths</th>
                            <th className="text-center text-light">migrated other</th>
                            <th className="text-center text-light">state code</th>
                            <th className="text-center text-light">last updated time</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                    {Object.keys(count).map((a,i)=>{
                        var z = <tr key={i}>
                            <td className="text-left number" style={{backgroundColor:"rgb(0 123 155)"}}>{a}</td>
                            <td className="text-left"> <span>{count[a]["state"]}</span> </td>
                            <td style={{backgroundColor:"rgb(3 160 3 / 58%)"}}>{parseInt(count[a]["active"]).toLocaleString('en-IN')}</td>
                            <td>{parseInt(count[a]["confirmed"]).toLocaleString('en-IN')}</td>
                            <td>{parseInt(count[a]["recovered"]).toLocaleString('en-IN')}</td>
                            <td style={{backgroundColor:"rgb(255 112 112)"}}>{parseInt(count[a]["deaths"]).toLocaleString('en-IN')}</td>
                            <td>{parseInt(count[a]["migratedother"]).toLocaleString('en-IN')}</td>
                            <td>{count[a]["statecode"]}</td>
                            <td>{count[a]["lastupdatedtime"]}</td>
                        </tr>;
                        
                        return z;
                    })}
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
</div>
        
    )

}

export default Covidtable;