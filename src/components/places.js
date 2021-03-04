'use strict';

import React from "react";

class Place extends React.Component {
    constructor(props) {
        super(props);
    }

    getItems() {
        let result = '';
        if (this.props.type === 'finance_types') {
            result = <Places structure={this.props.structure} type="finance_types" place={this.props.place} id={`head_${this.props.place}`} />;
        }
        if (this.props.type === 'finance_type') {
            console.log(`Place - finance type: `, this.props.structure);
            result = Object.keys(this.props.structure).map((finance_type, i) => {
                return (<Places structure={this.props.structure} type="finance_type" finance_type={finance_type} id={`heading-${finance_type}`} key={i} />)
            });
        }
        return result;
    }

    render() {
        let items = this.getItems();
        return (
            <div className="accordion-item">
                <h4 className="accordion-header" id={`heading-${this.props.id}`}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${this.props.id}`} aria-expanded={this.props.expand} aria-controls={`collapse-${this.props.id}`}>
                        {this.props.title}
                    </button>
                </h4>
                <div id={`collapse-${this.props.id}`} className="accordion-collapse collapse" aria-labelledby={`heading-${this.props.id}`}
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
        if (this.props.type === 'places') { //3 элемента: павильон, улица и 2 этаж
            result = Object.keys(this.props.structure).map((place, i) => {
                return (<Place id={place} type="finance_types" structure={this.props.structure[place]} place={place} key={i} title={place} accordion={this.props.id} />);
            });
        }
        if (this.props.type === 'finance_types') { //2 элемента: Коммерция и некоммерция
            result = Object.keys(this.props.structure).map((finance_type, i) => {
                return (<Place id={`${this.props.place}_${finance_type}`} type="finance_type" structure={this.props.structure[finance_type]} place={this.props.place} title={finance_type} accordion={this.props.id} key={i} />);
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
