'use strict';

import React from "react";
import Compare from "./compare";

class Place extends React.Component {
    constructor(props) {
        super(props);
    }

    getItems() {
        let result = '';
        //Шаг 2. Рендерим аккордеон для каждого типа места
        if (this.props.type === 'finance_types') {
            result = <Places structure={this.props.structure} type="finance_types" place={this.props.place} id={`accordion-${this.props.place}`} data={this.props.data} />;
        }
        //Шаг 4. Рендерим аккордеон для каждого типа площади
        if (this.props.type === 'square_types') {
            result = <Places structure={this.props.structure} type="square_types" place={this.props.place} finance_type={this.props.finance_type} id={`accordion-${this.props.place}_${this.props.finance_type}`} data={this.props.data} />;
        }
        //Шаг 6. Рендерим таблицу с данными
        if (this.props.type === 'square_type') {
            result = (<Compare projects={this.props.data.projects} companies={this.props.data.companies} />)
        }
        return result;
    }

    render() {
        let items = this.getItems();
        let head_id = `accordion-heading-${this.props.id}`;
        return (
            <div className="accordion-item">
                <h4 className="accordion-header" id={head_id}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${this.props.id}`} aria-expanded={this.props.expand} aria-controls={`collapse-${this.props.id}`}>
                        {this.props.title}
                    </button>
                </h4>
                <div id={`collapse-${this.props.id}`} className="accordion-collapse collapse" aria-labelledby={head_id}
                     data-bs-parent={`#${this.props.accordion}`}>
                    <div className="accordion-body" data-place={this.props.place} data-finance_type={this.props.finance_type} data-square_type={this.props.square_type}>
                        {items}
                    </div>
                </div>
            </div>
        )
    }
}

export default class Places extends React.Component {
    constructor(props) {
        super(props);
    }

    getItems() {
        let result = '';
        //Шаг 1. Рендерим 3 места: павильон, улица и 2 этаж
        if (this.props.type === 'places') {
            result = Object.keys(this.props.structure).map((place, i) => {
                return (<Place id={place} type="finance_types" structure={this.props.structure[place]} data={this.props.data} place={place} key={i} title={this.props.data.places[place]} accordion={this.props.id} />);
            });
        }
        //Шаг 3. Рендерим Каждый элемент аккордеона с типом коммерции (коммерческий и нет) для тех мест, где это нужно
        if (this.props.type === 'finance_types') {
            result = Object.keys(this.props.structure).map((finance_type, i) => {
                return (<Place id={`${this.props.place}_${finance_type}`} type="square_types" structure={this.props.structure[finance_type]} data={this.props.data} place={this.props.place} finance_type={finance_type} title={this.props.data.finance_types[finance_type]} accordion={this.props.id} key={i} />);
            });
        }
        //Шаг 5. Рендерим Каждый элемент аккордеона с каждым типом площади
        if (this.props.type === 'square_types' && this.props.structure !== undefined) {
            result = this.props.structure.map((square_type, i) => {
                return (<Place id={`${this.props.place}_${this.props.finance_type}_${square_type}`} type="square_type" data={this.props.data} square_type={square_type} place={this.props.place} finance_type={this.props.finance_type} title={this.props.data.square_types[square_type]} accordion={this.props.id} key={i} />);
            });
        }
        return result;
    }

    render() {
        let items = this.getItems();

        return (
            <div className="accordion" id={this.props.id}>
                {items}
            </div>
        )
    }
}
