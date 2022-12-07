import React,{useEffect} from "react";
import Carousel1 from "./features/carousel/Carousel1"
import { Helmet } from "react-helmet";

const Contactus = () =>{
    useEffect(() => {
        const body = document.querySelector('#root');
        body.scrollIntoView({
            behavior: 'smooth'
        }, 500)
    }, [])
    return (
<div>
<Helmet>
            <meta charSet="utf-8" />
            <title>Get-in-touch</title>
        </Helmet>
<Carousel1/>
    <p>aboutme </p>
    <h1>my name is Rishabh</h1>
</div>
        
    )

}

export default Contactus;