import React, {Fragment} from "react";
import {Button, Modal, Row} from "react-bootstrap";

function RegistrationResultModal({showModal, errorMessage, hideModal}) {

    function splitTextLines(text) {
        return text?.split("\n").map((text, index) => (
            <Fragment key={index}>
                {text}
                <br/>
            </Fragment>))
    }

    return <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
            <Modal.Title>{errorMessage ? "Ошибка!" : "Успех!"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="text-center">{splitTextLines(errorMessage || "Регистрация прошла успешно!\nДля завершения необходимо подтвердить электронную почту.")}</div>
            <br/>
            <Row className="justify-content-center">
                <Button variant={errorMessage ? "danger" : "success"}
                        onClick={hideModal}>ОК</Button>
            </Row>
        </Modal.Body>
    </Modal>
}

export default RegistrationResultModal;