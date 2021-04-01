import React from "react";

export default class Equipments extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <select className="form-select" id="select-equipment" onChange={this.props.onChange} defaultValue="" style={{width: '100%', maxWidth: '95%'}}>
                <option value="">- Все услуги -</option>
                {Object.keys(this.props.equipments).map((equipmentID, i) => {
                    return (<option value={equipmentID} key={equipmentID}>{this.props.equipments[equipmentID].title}</option> )
                })}
            </select>
        )
    }
}