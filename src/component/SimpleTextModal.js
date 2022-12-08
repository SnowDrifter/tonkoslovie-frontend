import React from "react";
import {Modal} from "react-bootstrap";
import DOMPurify from "dompurify";

function SimpleTextModal({showModal, onHide, title, text}) {

    return <Modal show={showModal} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}}/>
        </Modal.Body>
    </Modal>
}

export default SimpleTextModal;
