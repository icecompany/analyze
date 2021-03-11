'use strict';

import React from "react";

window.Tablesort = require('tablesort');
window.bootstrap = require('bootstrap');
require('tablesort/src/sorts/tablesort.number');

const formatter = new Intl.NumberFormat("ru", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2
});

export default class Compare extends React.Component {
    constructor(props) {
        super(props);
    }

    getTitleKey(i) {
        return (i > 0) ? 'full' : 'short';
    }

    getColumns() {
        return {
            full: {
                square: 'Кв. м.',
                money: 'Руб.',
                percent_square: 'Динамика кв. м.',
                percent_money: 'Динамика руб.'
            },
            short: {
                square: 'Кв. м.',
                money: 'Руб.'
            }
        }
    }

    getHeads() {
        let column_width = Math.round(80 / (4 * Object.keys(this.props.projects).length) - 2);
        let projects = Object.keys(this.props.projects).map((projectID, i) => {
            let colspan = (i > 0) ? 4 : 2;
            return (<th key={projectID} colSpan={colspan}>{this.props.projects[projectID].title}</th>)
        });

        let columns = this.getColumns();

        let params = Object.keys(this.props.projects).map((projectID, i) => {
            let key = this.getTitleKey(i);
            return Object.keys(columns[key]).map((param, j) => {
                let total = 0;
                switch(param) {
                    case 'square': {
                        total = Math.round(this.props.total.by_squares[projectID][this.props.place][this.props.finance_type][this.props.square_type][param]);
                        break;
                    }
                    case 'money': {
                        total = formatter.format(this.props.total.by_squares[projectID][this.props.place][this.props.finance_type][this.props.square_type][param]);
                        break;
                    }
                    default: {
                        total = this.props.total.by_squares[projectID][this.props.place][this.props.finance_type][this.props.square_type][param] + "%";
                    }
                }
                return (<th key={j} width={`${column_width}%`}>{total} {columns[key][param]}</th>)
            })
        });
        return (
            <thead>
            <tr>
                <th rowSpan={3} width="20%">Компания</th>
                {projects}
            </tr>
            <tr>
                {params}
            </tr>
            </thead>
        )
    }

    getCompanyURL(companyID, title) {
        const url = encodeURI(`/administrator/index.php?option=com_companies&task=company.edit&id=${companyID}`);
        return (
            <a href={url} target="_blank" title="Открыть компанию в CRM">{title}</a>
        );
    }

    getData() {
        return (
            Object.keys(this.props.companies).map((companyID, i) => {
                let total = this.props.total.by_companies[companyID];
                if ((total[this.props.place][this.props.finance_type][this.props.square_type]['square'] !== 0 && total[this.props.place][this.props.finance_type][this.props.square_type]['money'] !== 0) ||
                    (total[this.props.place][this.props.finance_type][this.props.square_type]['square'] !== 0 && total[this.props.place][this.props.finance_type][this.props.square_type]['money'] === 0)) {
                    return (
                        <tr key={companyID}>
                            <td>{this.getCompanyURL(companyID, this.props.companies[companyID])}</td>
                            {Object.keys(this.props.projects).map((projectID, j) => {
                                let data = this.props.data;
                                return Object.keys(data[companyID][projectID][this.props.place][this.props.finance_type][this.props.square_type]).map((column, c) => {
                                    let value = 0;
                                    switch (column) {
                                        case 'square': {
                                            value = `${Math.round(data[companyID][projectID][this.props.place][this.props.finance_type][this.props.square_type][column])} кв. м.`;
                                            break;
                                        }
                                        case 'money': {
                                            value = formatter.format(data[companyID][projectID][this.props.place][this.props.finance_type][this.props.square_type][column]);
                                            break;
                                        }
                                        case 'percent_square':
                                        case 'percent_money': {
                                            value = `${data[companyID][projectID][this.props.place][this.props.finance_type][this.props.square_type][column]}%`
                                            break;
                                        }
                                        default: {
                                            value = data[companyID][projectID][this.props.place][this.props.finance_type][this.props.square_type][column];
                                        }
                                    }
                                    return (
                                        <td key={column}>{value}</td>
                                    )
                                })
                            })}
                        </tr>
                    )
                }
            })
        )
    }

    render() {
        const heads = this.getHeads()
        const data = this.getData()
        return (
            <table className="table table-bordered">
                {heads}
                <tbody>{data}</tbody>
            </table>
        )
    }
}