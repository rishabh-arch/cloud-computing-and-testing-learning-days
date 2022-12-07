import React from 'react'
import Card from "react-bootstrap/Card"
export default function UserResTable(userNews) {
    userNews = userNews.props;
    return (


        <tr>
            <td className="text-center"><input className="inp" value={userNews.Res_ID} type="checkbox" /></td>
            <td
                style={
                    { "width": "100%" }
                }
                className="sorting_1">
                <p className="text-dark">
                    <label>Organization Name:
                </label>
                    {
                        userNews.OrgName
                    }</p>
                <p className="text-dark">
                    <label>Mobile No:
                </label>
                    <a href={
                        `tel:${userNews.contact
                        }`
                    }>
                        {
                            userNews.contact
                        }</a>
                </p>
                <p className="text-dark">
                    <label>Covid Resource:
                </label>
                    <a href={
                        `/search?input=${userNews.Resource_One
                        }`
                    }>
                        {
                            userNews.Resource_One
                        }</a>
                </p>
                <p className="text-dark">
                    <label>District:
                </label>
                    <a href={
                        `/search?input=${userNews.City
                        }`
                    }>
                        {
                            userNews.City
                        }</a>
                </p>
                <p className="text-dark">
                    <label>Address One:
                </label>
                    {
                        userNews.Address_one
                    } </p>
                <p className="text-dark">
                    <label>Address:
                </label>
                    {
                        userNews.Address
                    } </p>
            </td>

        </tr>


    )
}