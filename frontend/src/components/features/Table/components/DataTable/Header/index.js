import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({ headers }) => {

    return (
        <thead>
            <tr>
                {headers.map(({ name }) => (
                    <th
                        key={name}>
                        {name}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default Header;
