import React from "react";

export default class Modes extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <select className="form-select" id={`modes`} onChange={this.props.onChange}>
                <option value="">- Режим -</option>
                <option value="squares">Площади</option>
                <option value="equipments">Оборудование и услуги</option>
            </select>
        )
    }
}