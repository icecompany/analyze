'use strict';

import React from "react";

window.Tablesort = require('tablesort');
window.bootstrap = require('bootstrap');
require('tablesort/src/sorts/tablesort.number');

export default class Compare extends React.Component {
    constructor(props) {
        super(props);
    }

    getHeads() {
        let projects = Object.keys(this.props.projects).map((projectID, i) => {
            return (<th key={projectID} colSpan={(i > 0) ? 4 : 2}>{this.props.projects[projectID]}</th>)
        });

        let titles = {
            full: {
                square: 'Площадь (кв. м.)',
                money: 'Деньги (руб.)',
                percent_square: 'Площадь (%)',
                percent_money: 'Деньги (%)'
            },
            short: {
                square: 'Площадь (кв. м.)',
                money: 'Деньги (руб.)'
            }
        }

        let params = Object.keys(this.props.projects).map((projectID, i) => {
            return Object.keys(titles[(i > 0) ? 'full' : 'short']).map((param, j) => {
                return (<th key={j}>{titles[(i > 0) ? 'full' : 'short'][param]}</th>)
            })
        });
        return (
            <thead>
            <tr>
                <th rowSpan={2}>Компания</th>
                {projects}
            </tr>
            <tr>
                {params}
            </tr>
            </thead>
        )
    }

    render() {
        const heads = this.getHeads();
        return (
            <table className="table table-bordered">
                {heads}
                <tbody></tbody>
                <tfoot></tfoot>
            </table>
        )
    }
}