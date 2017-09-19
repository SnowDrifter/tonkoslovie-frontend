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

class EditPartModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: undefined,
            choiceVariants: []
        };

        this.increaseChoicesCount = this.increaseChoicesCount.bind(this);
        this.decreaseChoicesCount = this.decreaseChoicesCount.bind(this);
    }

    increaseChoicesCount() {
        let choiceVariants = this.state.choiceVariants;
        choiceVariants.push("");
        this.setState({choiceVariants: choiceVariants})
    }

    decreaseChoicesCount() {
        if (this.state.choicesCount > 1) {
            let choiceVariants = this.state.choiceVariants;
            choiceVariants.pop();
            this.setState({choiceVariants: choiceVariants})
        }
    }

    componentWillReceiveProps(props) {
        const currentPart = props.currentPart;

        if (currentPart != null) {

            this.setState({type: currentPart.type});

            if (currentPart.type == partTypes.CHOICE) {
                this.setState({choiceVariants: currentPart.choiceVariants, choicesCount: currentPart.choiceVariants.length});
            }
        }
    }

    saveTextPart() {
        let textPart = this.props.currentPart;
        let type = this.state.type || this.props.currentPart.type;

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
            const choiceCount = this.state.choiceVariants.length;

            for (let i = 0; i < choiceCount; i++) {
                choiceVariants.push(ReactDOM.findDOMNode(this['form-' + i]).value);
            }

            textPart.choiceVariants = choiceVariants;
        }

        this.props.saveTextPart(this.props.currentPartIndex, textPart)
    }

    changeType(type) {
        this.setState({type: type});
    }

    render() {
        let type = this.state.type;
        const currentPart = this.props.currentPart;

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
        } else if (type == partTypes.CHOICE) {
            const choiceForms = [];

            this.state.choiceVariants.map((value, index) => {
                choiceForms.push(<FormControl
                        key={index}
                        ref={part => {
                            this['form-' + index] = part
                        }}
                        defaultValue={value}
                    />
                );
            });

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
                                                       defaultValue={type}>
                                        <ToggleButton value={partTypes.TEXT}>Текст</ToggleButton>
                                        <ToggleButton value={partTypes.QUESTION}>Вопрос</ToggleButton>
                                        <ToggleButton value={partTypes.CHOICE}>Выбор</ToggleButton>
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
