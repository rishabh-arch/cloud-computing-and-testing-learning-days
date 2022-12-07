import React, { useEffect } from "react";
import Twitterbot from "./features/Table/Twitterbot"
import { Helmet } from "react-helmet";

const Twitter = () => {
  useEffect(() => {
    const body = document.querySelector('#root');
    body.scrollIntoView({
      behavior: 'smooth'
    }, 500)
  }, [])
  return (
    <>
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
                        3. Check everything like reply and time.
                        <br/>
                        4. Dont Try to spam and fraud.
                        <br/>
                        <strong>Admin is Not Responsible for your Fault </strong>

                    </div>
                </div>
            </div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Twitter</title>
      </Helmet>
      {/* <div className="alert alert-primary" role="alert">
        Select the Boxes For requirements <span className="alert-link">then press Goto Link button</span>. to navigate details on Twitter <span className="alert-link">Thanks.</span>
      </div> */}
      <Twitterbot />
    </>

  )

}

export default Twitter;