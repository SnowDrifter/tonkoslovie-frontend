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

class CreatePartModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: partTypes.TEXT,
        }
    }

    saveTextPart() {
        let textPart = {};
        textPart.type = ReactDOM.findDOMNode(this.type).value;
        textPart.data = ReactDOM.findDOMNode(this.data).value;
        this.props.saveTextPart(null, textPart)
    }

    changeType() {
        this.setState({type: ReactDOM.findDOMNode(this.type).value})
    }

    render() {
        let body;
        let type = this.state.type;

        if (type == partTypes.QUESTION || type == partTypes.TEXT){
            body = <FormGroup controlId="formInlineName">
                <ControlLabel>Текст</ControlLabel>
                <FormControl
                    inputRef={data => {
                        this.data = data
                    }}
                    componentClass="textarea"
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

                                <FormGroup>
                                    <FormControl componentClass="select" placeholder="select" inputRef={type => {
                                        this.type = type
                                    }} onChange={this.changeType.bind(this)}>
                                        <option value={partTypes.TEXT}>Текст</option>
                                        <option value={partTypes.QUESTION}>Вопрос</option>
                                    </FormControl>
                                </FormGroup>
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

export default CreatePartModal;
