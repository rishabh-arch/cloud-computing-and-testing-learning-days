import React from 'react'
import Admin_Del from "../js_features/Admin_Del"
import timeAgo from "../js_features/timeAgo"

export default function ResourceTable(commentsData) {
    commentsData = commentsData.props;
    return (
        <tr>
            <td
                style={
                    { "width": "100%" }
                }
                className="sorting_1">
                <p className="text-dark">
                    <label>Organization Name:
                    </label>
                    {
                        commentsData.OrgName
                    }</p>
                <p className="text-dark">
                    <label>Mobile No:
                    </label>
                    <a href={
                        `tel:${commentsData.contact
                        }`
                    }>
                        {
                            commentsData.contact
                        }</a>
                </p>
                <p className="text-dark">
                    <label>Covid Resource:
                    </label>
                    <a href={
                        `/search?input=${commentsData.Resource_One
                        }`
                    }>
                        {
                            commentsData.Resource_One
                        }</a><br/>
                            {timeAgo(new Date(commentsData.Res_ID))}

                </p>
                <p className="text-dark">
                    <label>District:
                    </label>
                    <a href={
                        `/search?input=${commentsData.City
                        }`
                    }>
                        {
                            commentsData.City
                        }</a>
                </p>
                <p className="text-dark">
                    <label>Address One:
                    </label>
                    {
                        commentsData.Address_one
                    } </p>
                <p className="text-dark">
                    <label>Address:
                    </label>
                    {
                        commentsData.Address
                    } </p>
            </td>
            {Admin_Del(commentsData.Res_ID,100,commentsData.email)}
        </tr>
    )
}
