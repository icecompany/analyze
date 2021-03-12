'use strict';

import React from "react";

export default class Courses extends React.Component {
    constructor(props) {
        super(props);
    }

    getHead() {
        const projects = Object.keys(this.props.projects).map((projectID, i) => {
            return (
                <th key={projectID}>{this.props.projects[projectID].title}</th>
            )
        })
        return (
            <tr>
                <th>Курсы валют</th>
                {projects}
            </tr>
        )
    }

    getData() {
        return ['usd', 'eur'].map((currency, i) => {
            const projects = Object.keys(this.props.projects).map((projectID, j) => {
                return (
                    <td key={projectID}>{this.props.projects[projectID].course[currency]}</td>
                )
            });
            return (
                <tr key={currency}>
                    <td>{currency}</td>
                    {projects}
                </tr>
            )
        })
    }

    render() {
        const head = this.getHead();
        const data = this.getData();
        return (
            <table className="table table-sm">
                <thead>{head}</thead>
                <tbody>{data}</tbody>
            </table>
        );
    }
}