import React from "react";
import ReactDOM from "react-dom";
import {
    FormGroup,
    Row,
    Col,
    ControlLabel,
    FormControl,
    Button,
    ButtonToolbar,
    ButtonGroup,
    Modal,
    Form,
    Jumbotron,
    Glyphicon
} from "react-bootstrap";
import * as  partTypes from '../TextPartTypes'

class EditPartModal extends React.Component {
    constructor(props) {
        super(props);

    }

    saveTextPart() {
        let textPart = this.props.currentPart;
        textPart.data = ReactDOM.findDOMNode(this.data).value;
        textPart.placeholder = ReactDOM.findDOMNode(this.placeholder).value;
        this.props.saveTextPart(this.props.currentPartIndex, textPart)
    }

    render() {
        let type = this.props.currentPart ? this.props.currentPart.type : undefined;
        let body;

        if (type == partTypes.TEXT) {
            body = <FormGroup>
                <ControlLabel>Текст</ControlLabel>
                <FormControl
                    inputRef={data => {
                        this.data = data
                    }}
                    componentClass="textarea"
                    defaultValue={this.props.currentPart ? this.props.currentPart.data : ""}
                />
            </FormGroup>
        } else if (type == partTypes.QUESTION) {
            body = <div>
                <FormGroup>
                    <ControlLabel>Текст</ControlLabel>
                    <FormControl
                        inputRef={data => {
                            this.data = data
                        }}
                        componentClass="textarea"
                        defaultValue={this.props.currentPart ? this.props.currentPart.data : ""}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Подсказка</ControlLabel>
                    <FormControl
                        inputRef={placeholder => {
                            this.placeholder = placeholder
                        }}
                        defaultValue={this.props.currentPart ? this.props.currentPart.placeholder : ""}
                    />
                </FormGroup>
            </div>
        }

        return <Modal show={this.props.showModal} onHide={this.props.hideModal.bind(this)} bsSize="large">
            <Modal.Header closeButton>
                <Modal.Title>{this.props.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="admin-text-modal-body">
                <Form>
                    <FormGroup>
                        <Row>
                            <Col md={12}>
                                {body}
                            </Col>
                        </Row>
                    </FormGroup>

                    <Button
                        onClick={this.saveTextPart.bind(this)}
                        className="pull-right" bsStyle="success">Сохранить</Button>
                </Form>
            </Modal.Body>
        </Modal>
    }
}

export default EditPartModal;
