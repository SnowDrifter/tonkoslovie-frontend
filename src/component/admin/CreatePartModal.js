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
import * as  partTypes from "../TextPartTypes";

class CreatePartModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: partTypes.TEXT,
            choicesCount: 1
        };
    }

    saveTextPart() {
        let textPart = {};
        let type = this.state.type;

        textPart.type = type;

        if (type == partTypes.TEXT) {
            textPart.data = ReactDOM.findDOMNode(this.data).value;
        }

        if (type == partTypes.QUESTION) {
            textPart.data = ReactDOM.findDOMNode(this.data).value;
            textPart.placeholder = ReactDOM.findDOMNode(this.placeholder).value;
        }

        if (type == partTypes.CHOICE) {
            const choiceVariants = [];
            const choiceCount = this.state.choicesCount;

            for (let i = 0; i < choiceCount; i++) {
                choiceVariants.push(ReactDOM.findDOMNode(this['form-' + i]).value);
            }

            textPart.choiceVariants = choiceVariants;
        }

        this.props.saveTextPart(null, textPart);
        this.setState({type: partTypes.TEXT})
    }

    changeType(type) {
        this.setState({type: type})
    }

    increaseChoicesCount() {
        let choicesCount = this.state.choicesCount;
        choicesCount++;
        this.setState({choicesCount: choicesCount})
    }

    decreaseChoicesCount() {
        if (this.state.choicesCount > 1) {
            let choicesCount = this.state.choicesCount;
            choicesCount--;
            this.setState({choicesCount: choicesCount});
        }
    }

    render() {
        let body;
        let type = this.state.type;

        if (type == partTypes.TEXT) {
            body = <FormGroup controlId="formInlineName">
                <ControlLabel>Текст</ControlLabel>
                <FormControl
                    inputRef={data => {
                        this.data = data
                    }}
                    componentClass="textarea"
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
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Подсказка</ControlLabel>
                    <FormControl
                        inputRef={placeholder => {
                            this.placeholder = placeholder
                        }}
                    />
                </FormGroup>
            </div>
        } else if (type == partTypes.CHOICE) {
            const choiceForms = [];
            const choiceCount = this.state.choicesCount;

            for (let i = 0; i < choiceCount; i++) {
                choiceForms.push(<FormControl key={i}
                        ref={part => {
                            this['form-' + i] = part
                        }}/>
                );
            }

            body = <div>
                <FormGroup>
                    <ControlLabel>Варианты</ControlLabel>
                    {choiceForms}
                </FormGroup>

                <Button onClick={this.increaseChoicesCount.bind(this)}>Добавить вариант</Button>
                <Button onClick={this.decreaseChoicesCount.bind(this)}>Удалить вариант</Button>
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
                                                       defaultValue={partTypes.TEXT}>
                                        <ToggleButton value={partTypes.TEXT}>Текст</ToggleButton>
                                        <ToggleButton value={partTypes.QUESTION}>Вопрос</ToggleButton>
                                        <ToggleButton value={partTypes.CHOICE}>Выбор</ToggleButton>
                                    </ToggleButtonGroup>
                                </ButtonToolbar>

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

export default CreatePartModal;
