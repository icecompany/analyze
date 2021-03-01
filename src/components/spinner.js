'use strict';

import React from "react";

export default class Spinner extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`spinner-border text-${this.props.type}`} role="status">
                <span className="visually-hidden">{this.props.text}</span>
            </div>
        )
    }
}
