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

        this.state = {
            type:  this.props.currentPart ?  this.props.currentPart.type : partTypes.TEXT
        }
    }

    saveTextPart() {
        let textPart = this.props.currentPart;
        textPart.data = ReactDOM.findDOMNode(this.data).value;
        this.props.saveTextPart(this.props.currentPartIndex, textPart)
    }

    render() {
        let type = this.state.type;
        let body;

        if (type == partTypes.QUESTION || type == partTypes.TEXT){
            body = <FormGroup controlId="formInlineName">
                <ControlLabel>Текст</ControlLabel>
                <FormControl
                    inputRef={data => {
                        this.data = data
                    }}
                    componentClass="textarea"
                    defaultValue={this.props.currentPart ? this.props.currentPart.data : ""}
                />
            </FormGroup>
        }

        return <Modal show={this.props.showModal} onHide={this.props.hideModal.bind(this)} bsSize="large">
            <Modal.Header closeButton>
                <Modal.Title>{this.props.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="word-modal-body">
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
