import React, {createRef} from "react";
import {
    Button,
    ButtonToolbar,
    Col,
    Form,
    InputGroup,
    Modal,
    Row,
    ToggleButton,
    ToggleButtonGroup
} from "react-bootstrap";
import * as partTypes from "../content/TextPartTypes";

class EditPartModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: undefined,
            choiceVariants: []
        };

        this.dataInput = createRef();
        this.placeholderInput = createRef();

        this.increaseChoicesCount = this.increaseChoicesCount.bind(this);
        this.decreaseChoicesCount = this.decreaseChoicesCount.bind(this);
    }

    increaseChoicesCount() {
        let choiceVariants = this.state.choiceVariants;
        this["right-" + choiceVariants.length] = createRef();
        this["form-" + choiceVariants.length] = createRef();
        choiceVariants.push("");
        this.setState({choiceVariants: choiceVariants})
    }

    decreaseChoicesCount() {
        if (this.state.choiceVariants.length > 1) {
            let choiceVariants = this.state.choiceVariants;
            choiceVariants.pop();
            this.setState({choiceVariants: choiceVariants})
        }
    }

    componentWillReceiveProps(props) {
        const currentPart = props.currentPart;

        if (currentPart != null) {
            this.setState({type: currentPart.type});

            if (currentPart.type === partTypes.CHOICE) {
                this.setState({
                    choiceVariants: currentPart.choiceVariants,
                    choicesCount: currentPart.choiceVariants.length
                });
            }
        }
    }

    saveTextPart() {
        let type = this.state.type || this.props.currentPart.type;

        let textPart = this.props.currentPart;
        textPart.type = type;

        if (type === partTypes.TEXT) {
            textPart.data = this.dataInput.current.value;
        }

        if (type === partTypes.QUESTION) {
            textPart.data = this.dataInput.current.value;
            textPart.placeholder = this.placeholderInput.current.value;
        }

        if (type === partTypes.CHOICE) {
            const choiceVariants = [];
            const choiceCount = this.state.choiceVariants.length;

            for (let i = 0; i < choiceCount; i++) {
                let choiceVariant = {};
                choiceVariant.title = this["form-" + i].current.value;
                choiceVariant.right = this["right-" + i].current.checked;
                choiceVariants.push(choiceVariant);
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

        if (type === partTypes.TEXT) {
            body = <Form.Group>
                <Form.Label>Текст</Form.Label>
                <Form.Control as="textarea" ref={this.dataInput}
                              defaultValue={currentPart ? currentPart.data : ""}
                />
            </Form.Group>
        } else if (type === partTypes.QUESTION) {
            body = <div>
                <Form.Group>
                    <Form.Label>Текст</Form.Label>
                    <Form.Control as="textarea" ref={this.dataInput}
                                  defaultValue={currentPart ? currentPart.data : ""}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Подсказка</Form.Label>
                    <Form.Control ref={this.placeholderInput}
                                  defaultValue={currentPart ? currentPart.placeholder : ""}
                    />
                </Form.Group>
            </div>
        } else if (type === partTypes.CHOICE) {
            const choiceForms = [];

            this.state.choiceVariants.map((value, index) => {
                this["right-" + index] = createRef();
                this["form-" + index] = createRef();

                choiceForms.push(
                    <InputGroup key={index} className="admin-text-choice-part-input">
                        <InputGroup.Prepend>
                            <Form.Check name="right-variant" type="radio"
                                        ref={this["right-" + index]}
                                        defaultChecked={value.right}/>
                        </InputGroup.Prepend>
                        <Form.Control ref={this["form-" + index]}
                                      defaultValue={value.title}/>
                    </InputGroup>
                );
            });

            body = <div>
                <Form.Group>
                    <Form.Label>Варианты</Form.Label>
                    {choiceForms}
                </Form.Group>

                <Button onClick={this.increaseChoicesCount.bind(this)}>Добавить вариант</Button>
                <Button onClick={this.decreaseChoicesCount.bind(this)}>Удалить вариант</Button>
            </div>
        }

        return <Modal show={this.props.showModal} onHide={this.props.hideModal.bind(this)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{this.props.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="admin-text-modal-body">
                <Form>
                    <Form.Group>
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
                    </Form.Group>

                    <Button onClick={this.saveTextPart.bind(this)}
                            className="fliat" variant="success">Сохранить</Button>
                </Form>
            </Modal.Body>
        </Modal>
    }
}

export default EditPartModal;
