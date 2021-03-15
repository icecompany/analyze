import React from "react";

export default class Pavilions extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <select className="form-select" id="select-pavilion" onChange={this.props.onChange} defaultValue="">
                <option value="">- Все павильоны -</option>
                {Object.keys(this.props.pavilions).map((pavilionID, i) => {
                    return (<option value={pavilionID} key={pavilionID}>{this.props.pavilions[pavilionID].title}</option> )
                })}
            </select>
        )
    }
}