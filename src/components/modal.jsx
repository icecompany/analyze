import React from "react";

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
    }

    getHead() {
        return (
            <div className="modal-header">
                <h5 className="modal-title" id="modal-title">{this.props.title}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">Закрыть</button>
            </div>
        )
    }

    getBody() {
        return (
            <div className="modal-body">
                Content
            </div>
        )
    }

    render() {
        return (
            <div className="modal fade modal-dialog-scrollable modal-dialog-centered" id={this.props.id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        {this.getHead()}
                        {this.getBody()}
                    </div>
                </div>
            </div>
        )
    }
}