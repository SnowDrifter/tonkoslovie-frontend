import React from "react";
import ReactDOM from "react-dom";
import Client from "../../util/Client";
import {FormGroup, Row, Col, ControlLabel, FormControl, Button, Modal, Form} from "react-bootstrap";
import "./AdminWord.less"


class Word extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: props.showModal
        };
    }

    saveWord() {
        let russianText = ReactDOM.findDOMNode(this.russianText).value;
        let polishText = ReactDOM.findDOMNode(this.polishText).value;

        Client.post("/api/content/word", {
            id: this.props.word.id,
            russianText: russianText,
            polishText: polishText
        }).then(() => {
            this.props.hideModal();
        })
    }

    componentWillReceiveProps(props) {
        this.setState({showModal: props.showModal});
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
                                        <ControlLabel>Русский текст</ControlLabel>
                                        <FormControl
                                            inputRef={russianText => {
                                                this.russianText = russianText
                                            }} defaultValue={this.props.word.russianText}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <FormGroup controlId="polishTextForm">
                                        <ControlLabel>Польский текст</ControlLabel>
                                        <FormControl ref={polishText => {
                                            this.polishText = polishText
                                        }} defaultValue={this.props.word.polishText}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </FormGroup>

                        <Button onClick={this.saveWord.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export default Word;