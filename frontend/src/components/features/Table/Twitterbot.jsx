import React from "react";
import "./Twitterbot.css"
const Twitterbot = () => {
    return (

        <div className="row d-flex justify-content-center mt-5 mr-0 ml-0">
            <div className="col-md-4">
                <div className="card">
                    <div className="card-body text-center">
                        <h4 className="card-title">Select Checkboxes</h4>
                        <p className="card-description h5">Tweets should have these words:</p>
                        <input id="city" type="text" className="inp form-control" placeholder="Enter City Name" />
                        <br />
                        <label className="check">
                            <input className="inp" value="Laptop" type="checkbox" />
                            <span>Laptop</span>
                        </label>
                        <label className="check">
                            <input className="inp" value="phone" type="checkbox" />
                            <span>phone</span>
                        </label>
                        <label className="check">
                            <input className="inp" value="Electronic" type="checkbox" />
                            <span>Electronic</span>
                        </label>
                        <label className="check">
                            <input className="inp" value="household" type="checkbox" />
                            <span>household</span>
                        </label>
                        <label className="check">
                            <input className="inp" value="computer" type="checkbox" />
                            <span>computer</span>
                        </label>
                        <label className="check">
                            <input className="inp" value="household" type="checkbox" />
                            <span>household</span>
                        </label>
                        <label className="check">
                            <input className="inp" value="dispensers" type="checkbox" />
                            <span> dispensers</span>
                        </label>
                        <label className="check">
                            <input className="inp" value="Medical" type="checkbox" />
                            <span>Medical</span>
                        </label>
                        <label className="check">
                            <input className="inp" value="sports" type="checkbox" />
                            <span> sports </span>
                        </label>
                        <label className="check">
                            <input className="inp" value="Electrical" type="checkbox" />
                            <span>Electrical</span>
                        </label>
                        <label className="check">
                            <input className="inp" value="telecommunications" type="checkbox" />
                            <span>telecommunications</span>
                        </label><br />
                        <input id="topbox" type="text" className="inp form-control" placeholder="Other(Optional)" defaultValue="" />

                        <p className="card-description h5">Tweets should NOT have these words:</p>
                        <label className="check">
                            <input className="inp2" id="notVer" value="Waste" type="checkbox" />
                            <span>Waste</span>
                        </label>
                        <label className="check">
                            <input className="inp2" id="Need" value="Ewaste" type="checkbox" />
                            <span>Ewaste</span>
                        </label>
                        <label className="check">
                            <input className="inp2" id="Req" value="E-waste" type="checkbox" />
                            <span>E-waste</span>
                        </label>
                        <input id="bottombox" type="text" className="inp form-control" placeholder="Other(Optional)" defaultValue="" />

                        <br />

                        <button className="btn btn-primary p-2 mt-2" onClick={() => {

                            const todo = [...document.querySelectorAll('.inp:checked')].map(e => e.value);
                            const Nottodo = [...document.querySelectorAll('.inp2:checked')].map(e => e.value);
                            const todo_arr = todo.reduce((r, a) => r.concat(a, "OR"), [0]).slice(1, -1)
                            const Nottodo_arr = Nottodo.reduce((r, a) => r.concat(a, "-"), [0]).slice(1, -1)
                            const Nottodo_arr_split = Nottodo_arr.join(" ");
                            const todo_arr_split = todo_arr.join(" ");

                            const cityname = document.getElementById("city").value;
                            const topbox = document.getElementById("topbox").value;
                            const bottombox = document.getElementById("bottombox").value;

                            let TwitterUrl = `ewaste ${cityname} (${todo_arr_split})-${Nottodo_arr_split}&f=live`;
                            if (topbox !== "" && topbox !== " ") {
                                TwitterUrl = `ewaste ${cityname} (${todo_arr_split} OR ${topbox})-${Nottodo_arr_split}&f=live`
                            }
                            if (bottombox !== "" && bottombox !== " ") {
                                TwitterUrl = `ewaste ${cityname} (${todo_arr_split})-${Nottodo_arr_split}-${bottombox}&f=live`
                            }
                            if ((bottombox !== "" && bottombox !== " ") && (topbox !== "" && topbox !== " ")) {
                                TwitterUrl = `ewaste ${cityname} (${todo_arr_split} OR ${topbox})-${Nottodo_arr_split}-${bottombox}&f=live`
                            }
                           
                            if (cityname !== "") {
                                TwitterUrl = "https://twitter.com/search?q=" + encodeURI(TwitterUrl)
                                window.open(TwitterUrl)
                            }
                            else alert("fill the city name")

                        }}>Goto Link</button>

                    </div>
                </div>
            </div>
        </div>

    )

}

export default Twitterbot;
