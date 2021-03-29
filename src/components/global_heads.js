'use strict';

import React from "react";

export default class Global_heads extends React.Component {
    constructor(props) {
        super(props);
    }

    getTitleKey(i) {
        return (i > 0) ? 'full' : 'short';
    }

    getHeadSqm() {
        return (this.props.mode === 'squares') ? 'Кв. м.' : 'Шт.'
    }

    getColumns() {
        return {
            full: {
                square: this.getHeadSqm(),
                money: 'Руб.',
                percent_square: 'Динамика кв. м.',
                percent_money: 'Динамика руб.'
            },
            short: {
                square: this.getHeadSqm(),
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
                return (<th key={j} width={`${column_width}%`}>{columns[key][param]}</th>)
            })
        });
        return (
            <thead>
            <tr className="text-center">
                <th rowSpan={3} width="20%">Площадь</th>
                {projects}
            </tr>
            <tr>
                {params}
            </tr>
            </thead>
        )
    }

    render() {
        const head = this.getHeads();
        return (
            <table className="table table-borderless">
                {head}
            </table>
        );
    }
}