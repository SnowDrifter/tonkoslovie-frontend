import React from "react";
import {Modal} from "react-bootstrap";
import DOMPurify from "dompurify";

class SimpleTextModal extends React.Component {
    render() {
        const {showModal, hideModal, title, text} = this.props;

        return <Modal show={showModal} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}}/>
            </Modal.Body>
        </Modal>
    }
}

export default SimpleTextModal;
