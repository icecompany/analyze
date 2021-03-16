import React from "react";

export default class Start extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button type="submit" className="btn btn-outline-primary" disabled={this.props.disabled}>Загрузить</button>
        )
    }
}