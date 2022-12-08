import React from "react";
import {Button, Modal} from "react-bootstrap";

function SimpleConfirmModal({showModal, title, text, onHide, onConfirm, onNegative}) {

        return <Modal show={showModal} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title || "Подтверждение"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4 className="text-center">{text}</h4>

                <div className="text-center">
                    <Button variant="success" onClick={onConfirm}>Да</Button>{" "}
                    <Button variant="danger" onClick={onNegative}>Нет</Button>
                </div>
            </Modal.Body>
        </Modal>
}

export default SimpleConfirmModal;
