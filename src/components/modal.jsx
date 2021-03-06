import React from "react";
import Spinner from "./spinner";

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
    }

    getHead() {
        return (
            <div className="modal-header">
                <h5 className="modal-title" id="modal-title">{this.props.title}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
        )
    }

    getBody() {
        return (
            <div className="modal-body">
                {this.props.data}
            </div>
        )
    }

    componentDidMount() {
        let modal = new bootstrap.Modal(document.querySelector(`#${this.props.id}`), {
            keyboard: false
        });
        modal.show();
    }

    render() {
        return (
            <div className="modal fade" id={this.props.id} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-fullscreen">
                    <div className="modal-content">
                        {this.getHead()}
                        {this.getBody()}
                    </div>
                </div>
            </div>
        )
    }
}