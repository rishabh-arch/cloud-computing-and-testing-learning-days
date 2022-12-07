import React,{useEffect} from "react";
import Carousel1 from "./features/carousel/Carousel1"
import Exfeature from "./features/Exfeature/Exfeature"
import { Helmet } from "react-helmet";
const About = () =>{
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
            <title>About</title>
        </Helmet>
<Carousel1/>
<Exfeature/>
</div>
        
    )

}

export default About;