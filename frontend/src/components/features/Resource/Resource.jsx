import React, { useContext, createContext } from "react"
import PostSuppliers from "./Searchtable/PostSuppliers"
import SearchSuppliers from "./Searchtable/SearchSuppliers"
import { ShareResource } from '../../Home';
export const ResendResource = createContext();

const Resource = () => {
    const { SendResource, SetSendResource } = useContext(ShareResource);
    return (

        <div className="content-wrapper">
            <div className="container mt-5">

                <section className="content mb-20">
                    <ul className="nav nav-tabs">
                        <li className="active"><a data-toggle="tab" className="btn btn-default" href="#searchsplr">
                            Search Data
                            </a></li>
                        <li><a data-toggle="tab" href="#menu1" className="btn btn-default" >
                            Add Suppliers
                            </a></li>
                    </ul>

                    <div className="tab-content" style={{ backgroundColor: "#007bff24" }}>
                        <PostSuppliers />
                        <ResendResource.Provider value={{ SendResource, SetSendResource }}>
                            <SearchSuppliers />
                        </ResendResource.Provider>

                    </div>




                </section>

            </div>

        </div>

    )


}

export default Resource;