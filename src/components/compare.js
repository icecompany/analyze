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
        this.state = {table_id: `table-${this.props.place}_${this.props.finance_type}_${this.props.square_type}`}
    }

    getHeadSqm() {
        return (this.props.mode === 'squares') ? 'кв. м.' : 'шт.'
    }

    getTitleKey(i) {
        return (i > 0) ? 'full' : 'short';
    }

    getColumns() {
        return {
            full: {
                square: this.getHeadSqm(),
                money: 'Руб.',
                percent_square: `Динамика ${this.getHeadSqm()}`,
                percent_money: 'Динамика руб.'
            },
            short: {
                square: this.getHeadSqm(),
                money: 'руб.'
            }
        }
    }

    getHeads() {
        let column_width = Math.round(80 / (4 * Object.keys(this.props.projects).length) - 2);
        let projects = Object.keys(this.props.projects).map((projectID, i) => {
            let colspan = (i > 0) ? 4 : 2;
            return (<th data-sort-method='none' key={projectID} colSpan={colspan}>{this.props.projects[projectID].title}</th>)
        });

        let columns = this.getColumns();

        let params = Object.keys(this.props.projects).map((projectID, i) => {
            let key = this.getTitleKey(i);
            return Object.keys(columns[key]).map((param, j) => {
                let total = 0;
                let sort_method = 'none;'
                let value = "";
                if (this.props.mode === 'equipment') {
                    value = this.props.total[projectID][param];
                }
                else {
                    value = this.props.total.by_squares[projectID][this.props.place][this.props.finance_type][this.props.square_type][param];
                }
                switch(param) {
                    case 'square': {
                        total = Math.round(value);
                        sort_method = 'number';
                        break;
                    }
                    case 'money': {
                        total = formatter.format(value);
                        sort_method = 'number';
                        break;
                    }
                    default: {
                        total = value + "%";
                        sort_method = 'number';
                    }
                }
                return (<th style={{cursor: 'pointer'}} data-sort-method={sort_method} key={j} width={`${column_width}%`}>{total} {columns[key][param]}</th>)
            })
        });
        let head_title = (this.props.mode === 'equipments') ? 'Пункт прайса' : 'Компания';
        return (
            <thead>
            <tr>
                <th>&nbsp;</th>
                <th width="20%">&nbsp;</th>
                {projects}
            </tr>
            <tr>
                <th width="1%" data-sort-default="" style={{cursor: 'pointer'}}>№п/п</th>
                <th width="20%" style={{cursor: 'pointer'}}>{head_title}</th>
                {params}
            </tr>
            </thead>
        )
    }

    getCompanyURL(companyID, title) {
        const url = encodeURI(`/administrator/index.php?option=com_companies&task=company.edit&id=${companyID}`);
        if (this.props.mode === 'squares' || this.props.mode === 'equipment') {
            return (
                <a href={url} target="_blank" title="Открыть компанию в CRM">{title}</a>
            );
        }
        else if (this.props.mode === 'equipments') {
            return (
                <a href="#" data-equipment={companyID} data-company={title} data-finance={this.props.finance_type} data-sponsor={this.props.square_type} onClick={this.props.onClickEquipment}>{title}</a>
            )
        }
        else {
            return (
                title
            );
        }
    }

    getData() {
        let sc = 0;
        return (
            Object.keys(this.props.companies).map((companyID, i) => {
                let total = (this.props.mode === 'equipment') ? 0 : this.props.total.by_companies[companyID];
                if (this.props.mode === 'equipment' || (this.props.mode !== 'equipment' && ((total[this.props.place][this.props.finance_type][this.props.square_type]['square'] !== 0 && total[this.props.place][this.props.finance_type][this.props.square_type]['money'] !== 0) ||
                    (total[this.props.place][this.props.finance_type][this.props.square_type]['square'] !== 0 && total[this.props.place][this.props.finance_type][this.props.square_type]['money'] === 0)))) {
                    sc++;
                    return (
                        <tr key={companyID}>
                            <td>{sc}</td>
                            <td data-sort={this.props.companies[companyID]}>{this.getCompanyURL(companyID, this.props.companies[companyID])}</td>
                            {Object.keys(this.props.projects).map((projectID, j) => {
                                let data = this.props.data;
                                let items = (this.props.mode === 'equipment') ? data[companyID][projectID] : data[companyID][projectID][this.props.place][this.props.finance_type][this.props.square_type];
                                return Object.keys(items).map((column, c) => {
                                    let value = 0;
                                    let data_sort = items[column];
                                    switch (column) {
                                        case 'square': {
                                            value = `${Math.round(data_sort)} ${this.getHeadSqm()}`;
                                            break;
                                        }
                                        case 'money': {
                                            value = formatter.format(data_sort);
                                            break;
                                        }
                                        case 'percent_square':
                                        case 'percent_money': {
                                            value = `${data_sort}%`
                                            break;
                                        }
                                        default: {
                                            value = data_sort;
                                        }
                                    }
                                    return (
                                        <td key={column} data-sort={data_sort}>{value}</td>
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
            <table className="table table-bordered" id={this.state.table_id}>
                {heads}
                <tbody>{data}</tbody>
            </table>
        )
    }

    componentDidMount() {
        let tbl = new Tablesort(document.querySelector(`#${this.state.table_id}`));
        tbl.refresh();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let tbl = new Tablesort(document.querySelector(`#${this.state.table_id}`));
        tbl.refresh();
    }
}