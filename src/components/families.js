import React from "react";

export default class Families extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <select className="form-select" id="select-family" onChange={this.props.onChange} defaultValue="">
                <option value="">- Семейство проектов -</option>
                {Object.keys(this.props.families).map((familyID, i) => {
                    return (<option value={familyID} key={familyID}>{this.props.families[familyID].title}</option> )
                })}
            </select>
        )
    }
}