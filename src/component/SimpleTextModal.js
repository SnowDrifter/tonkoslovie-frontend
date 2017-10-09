import React from "react";
import {
    Button,
    Modal
} from "react-bootstrap";
import DOMPurify from "dompurify";

class SimpleTextModal extends React.Component {
    render() {
        return <Modal show={this.props.showModal} onHide={this.props.hideModal.bind(this)}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.props.text || "Текст отсутствует")}}></div>
            </Modal.Body>
        </Modal>
    }
}

export default SimpleTextModal;
