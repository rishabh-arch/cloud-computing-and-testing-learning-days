import React, { useContext, useState, useMemo } from "react";
import { TableHeader, Pagination, Search } from "./components/DataTable";
import { ShareResource } from '../../Home';
import ResourceTable from './ResourceTable';
import './HomeTable.css'
import { AuthContext } from '../../Context/AuthContext';

const Table = () => {
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);
    const { SendResource } = useContext(ShareResource);
    // const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
  

    const ITEMS_PER_PAGE = 50;

    const headers = [
        { name: "Resources", field: "id", sortable: true },

    ];
  
    const commentsData = useMemo(() => {
        let computedComments = SendResource;

        if (search) {
            computedComments = computedComments.filter(
                comment =>
                   comment.Resource_One.toLowerCase().includes(search.toLowerCase()) || comment.Address.toLowerCase().includes(search.toLowerCase()) || comment.Address_one.toLowerCase().includes(search.toLowerCase())
                
            );
        }

        setTotalItems(computedComments.length);
        //Current Page slice
        return computedComments.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [SendResource, currentPage, search]);

    return (
        <>

            <div className="container mt-1">
                <div className="row py-5">
                    <div className="col-lg-10 mx-auto">
                        <div className="card rounded shadow border-0">
                            <div className="card-body bg-white rounded p-0">
                                <div className="table-responsive overflow-hidden p-2">
                        <div className="col-md-6 d-flex justify-content-between " style={{maxWidth:"100%"}}>
                            <Pagination
                                total={totalItems}
                                itemsPerPage={ITEMS_PER_PAGE}
                                currentPage={currentPage}
                                onPageChange={page => setCurrentPage(page)}
                            />
                            <Search
                                onSearch={value => {
                                    setSearch(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <table className="table table-striped p-2" id="res_result">
                        <TableHeader
                            headers={headers}
                        />
                        <tbody>
                        {commentsData.length>0?
                        Object.keys(commentsData).map((a, i) => <ResourceTable props={commentsData[a]}/>
                        ):
                        <>
                            <tr>
                                <td className="text-center text-white bg-primary h3">
                                    Your Search Result will show here if it is present.
                                </td>
                            </tr>


                        </>}

                        </tbody>

                    </table>
                </div>
                </div>
                </div>
                </div>
            </div>
        </>
    );

}

export default Table;
