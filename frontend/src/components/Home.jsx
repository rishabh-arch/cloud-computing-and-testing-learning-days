import React, {useEffect, createContext, useState} from "react";
import Exfeature from "./features/Exfeature/Exfeature.jsx"
import CounterCard from "./features/CounterCard/Counter_card.jsx"
import Resource from "./features/Resource/Resource.jsx"
import Infocard from "./features/InfoCard/Infocard.jsx"
import Table from "./features/Table/Table.jsx"
import {Helmet} from "react-helmet";
export const ShareResource = createContext();
const Home = () => {
    const [SendResource, SetSendResource] = useState([]);
    useEffect(() => {
        const body = document.querySelector('#root');

        body.scrollIntoView({
            behavior: 'smooth'
        }, 500)

    }, []);

    return (
        <div>
            <div class="alert alert-danger alert-dismissable">
                <div class="alertwrapper clearfix">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <div class="alerticon dangerous">
                        <span class="fa fa-warning"></span>
                    </div>
                    <div class="alertcontent">
                        <h4>Beware!</h4>
                        1. Do
                        <strong> Not </strong>
                        make advanced payments unless you are 100% sure.
                        <br/>
                        2. Verify it before any Deal.
                        <br/>
                        3. Make sure search the results are Not so Old.
                        <br/>
                        4. Dont Try to spam and fraud.
                        <br/>
                        <strong>Admin is Not Responsible for your Fault </strong>
                    </div>
                </div>
            </div>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Home</title>

            </Helmet>
            {/* <Infocard /> */}
            <ShareResource.Provider value={
                {SendResource, SetSendResource}
            }>
                <Resource/>
            <div class="alert alert-primary alert-dismissable">
                <div class="alertwrapper clearfix">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <div class="alerticon dangerous">
                        <span class="fa fa-info"></span>
                    </div>
                    <div class="alertcontent">
                        <h4>Note</h4>
                        This information isn't true yet a publicly supported exertion of volunteers according to data gathered by them actually/telephonically/on the Web. Asset contact details Should not to be public ones. If it's not too much trouble, continue adding and refreshing. 

Utilization of prescriptions/assets should be done with regards to specialist's recommendation and Govt strategy. Costs offered should be really predominant ones and portrayal of the equivalent isn't a blessing.
                    </div>
                </div>
            </div>
                <Table/>
            </ShareResource.Provider>
            <CounterCard/>
            <Exfeature/>
        </div>

    )

}

export default Home;
