'use strict';

import React from "react";

class FinanceType extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let items = Object.keys(this.props.structure).map((item, i) => {

        });
        return (
            <div className="accordion" id={this.props.id}>
                <div className="accordion-item">
                    <h4 className="accordion-header" id={`heading-${this.props.id}`}>
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${this.props.id}`} aria-expanded={this.props.expand} aria-controls={`collapse-${this.props.id}`}>
                            {this.props.title}
                        </button>
                    </h4>
                    <div id={`collapse-${this.props.id}`} className="accordion-collapse collapse" aria-labelledby={`heading-${this.props.id}`}
                         data-bs-parent={`#${this.props.accordion}`}>
                        <div className="accordion-body table-result" id={`table-${this.props.id}`}>

                        </div>
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

    render() {
        let items = Object.keys(this.props.structure).map((item, i) => {

        });
        return (
            <div className="accordion" id={this.props.id}>
                <div className="accordion-item">
                    <h4 className="accordion-header" id={`heading-${this.props.id}`}>
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${this.props.id}`} aria-expanded={this.props.expand} aria-controls={`collapse-${this.props.id}`}>
                            {this.props.title}
                        </button>
                    </h4>
                    <div id={`collapse-${this.props.id}`} className="accordion-collapse collapse" aria-labelledby={`heading-${this.props.id}`}
                         data-bs-parent={`#${this.props.accordion}`}>
                        <div className="accordion-body table-result" id={`table-${this.props.id}`}>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
