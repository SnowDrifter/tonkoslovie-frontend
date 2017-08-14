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
    Glyphicon,
    ToggleButtonGroup,
    ToggleButton
} from "react-bootstrap";
import * as  partTypes from '../TextPartTypes'

class EditPartModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: undefined
        }
    }

    saveTextPart() {
        let textPart = this.props.currentPart;
        let type = this.state.type || this.props.currentPart.type;

        textPart.type = type;
        textPart.data = ReactDOM.findDOMNode(this.data).value;

        if (type == partTypes.QUESTION) {
            textPart.placeholder = ReactDOM.findDOMNode(this.placeholder).value;
        }

        this.props.saveTextPart(this.props.currentPartIndex, textPart)
    }

    changeType(type) {
        this.setState({type: type});
    }

    render() {
        let type;
        const currentPart = this.props.currentPart;

        if (this.state.type) {
            type = this.state.type
        } else {
            type = this.props.currentPart ? this.props.currentPart.type : undefined;
        }

        let body;

        if (type == partTypes.TEXT) {
            body = <FormGroup>
                <ControlLabel>Текст</ControlLabel>
                <FormControl
                    inputRef={data => {
                        this.data = data
                    }}
                    componentClass="textarea"
                    defaultValue={currentPart ? currentPart.data : ""}
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
                        defaultValue={currentPart ? currentPart.data : ""}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Подсказка</ControlLabel>
                    <FormControl
                        inputRef={placeholder => {
                            this.placeholder = placeholder
                        }}
                        defaultValue={currentPart ? currentPart.placeholder : ""}
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
                                <ButtonToolbar>
                                    <ToggleButtonGroup type="radio" name="options" onChange={this.changeType.bind(this)}
                                                       defaultValue={type}>
                                        <ToggleButton value={partTypes.TEXT}>Текст</ToggleButton>
                                        <ToggleButton value={partTypes.QUESTION}>Вопрос</ToggleButton>
                                    </ToggleButtonGroup>
                                </ButtonToolbar>

                                {body}
                            </Col>
                        </Row>
                    </FormGroup>

                    <Button onClick={this.saveTextPart.bind(this)} className="pull-right"
                            bsStyle="success">Сохранить</Button>
                </Form>
            </Modal.Body>
        </Modal>
    }
}

export default EditPartModal;
