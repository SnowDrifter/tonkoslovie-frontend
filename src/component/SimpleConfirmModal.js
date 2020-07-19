import React from "react";
import {Button, Modal} from "react-bootstrap";

class SimpleConfirmModal extends React.Component {
    render() {
        return <Modal show={this.props.showModal} onHide={this.props.hideModal.bind(this)}>
            <Modal.Header closeButton>
                <Modal.Title>Подтверждение</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4 className="text-center">{this.props.modalTitle}</h4>

                <div className="text-center">
                    <Button onClick={() => this.props.confirmFunction(true)} variant="success" size="lg">Да</Button>
                    {" "}
                    <Button onClick={() => this.props.negativeFunction()} size="lg">Нет</Button>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default SimpleConfirmModal;
