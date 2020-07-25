import React, {createRef} from "react";
import Client from "../../../util/Client";
import {FormGroup, Row, Col, FormLabel, FormControl, Button, Modal, Form} from "react-bootstrap";
import "./AdminWord.less"


class AdminWord extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: props.showModal
        };

        this.russianTextInput = createRef();
        this.polishTextInput = createRef();
    }

    saveWord() {
        const russianText = this.russianTextInput.current.value;
        const polishText = this.polishTextInput.current.value;

        Client.post("/api/content/word", {
            id: this.props.word.id,
            russianText: russianText,
            polishText: polishText
        }).then(() => {
            this.props.hideModal();
        })
    }

    static getDerivedStateFromProps(props, state) {
        if (props.showModal !== state.showModal) {
            return {
                showModal: props.showModal
            };
        }

        return null;
    }

    render() {
        return (
            <Modal show={this.state.showModal} onHide={this.props.hideModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="admin-word-modal-body">
                    <Form>
                        <FormGroup>
                            <Row>
                                <Col md={12}>
                                    <FormGroup controlId="russianTextForm">
                                        <FormLabel>Русский текст</FormLabel>
                                        <FormControl
                                            ref={this.russianTextInput}
                                            defaultValue={this.props.word.russianText}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <FormGroup controlId="polishTextForm">
                                        <FormLabel>Польский текст</FormLabel>
                                        <FormControl ref={this.polishTextInput}
                                                     defaultValue={this.props.word.polishText}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </FormGroup>

                        <Button onClick={this.saveWord.bind(this)} className="float-right" variant="success">Сохранить</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export default AdminWord;