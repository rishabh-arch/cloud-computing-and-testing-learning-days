import React from "react";
import Covidtable from "./features/Table/covidTable.jsx"
import { Helmet } from "react-helmet";
const Coronolive = () =>{
  return (
<div>
      <Helmet>
                  <meta charSet="utf-8" />
                  <title>Corona-Live-Cases</title>
              </Helmet>
<div className="alert alert-primary" role="alert">
  This Page Reflects <span className="alert-link">Live Covid Cases</span>. Stay Home,Stay Safe <span className="alert-link">And Dont try to increase these Numbers.</span> 
</div>
<Covidtable/>
</div>
        
    )

}

export default Coronolive;