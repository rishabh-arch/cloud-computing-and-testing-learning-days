import React from 'react'
import Card from "react-bootstrap/Card"
export default function User_table(userResource) {
    userResource = userResource.props;
    return (
      
                
                <tr>
                    <td className="text-center"><input className="inp" value={userResource.news_ID} type="checkbox"/></td>
                    <td colSpan="2">
                        <h6 className="text-dark h5">{userResource.news_title} <Card.Text dangerouslySetInnerHTML={{__html:userResource.news_box }}></Card.Text></h6>
                    </td>
                    <td>
                        <div className="d-flex align-items-center"><img className="rounded-circle" src={`../uploads/thumbnail/${userResource.news_image}`} width="30"/></div>
                    </td>
                </tr>
                
                
    )
}