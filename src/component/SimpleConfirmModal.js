import React from "react";
import {Button, Modal} from "react-bootstrap";

class SimpleConfirmModal extends React.Component {
    render() {
        const {showModal, modalTitle, modalText, hideModal, confirmFunction, negativeFunction} = this.props;

        return <Modal show={showModal} onHide={() => hideModal()} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle || "Подтверждение"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4 className="text-center">{modalText}</h4>

                <div className="text-center">
                    <Button variant="success" onClick={() => confirmFunction()}>Да</Button>
                    {" "}
                    <Button variant="danger" onClick={() => negativeFunction()}>Нет</Button>
                </div>
            </Modal.Body>
        </Modal>
    }
}

export default SimpleConfirmModal;
