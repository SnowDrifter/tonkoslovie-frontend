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
import {toast} from "react-toastify";

class CreatePartModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: partTypes.TEXT,
            choicesCount: 1
        };

        this.dataInput = createRef();
        this.placeholderInput = createRef();
    }

    saveTextPart() {
        let type = this.state.type;

        let textPart = {};
        textPart.type = type;

        if (type === partTypes.TEXT) {
            textPart.data = this.dataInput.current.value;
        }

        if (type === partTypes.QUESTION) {
            textPart.data = this.dataInput.current.value;
            textPart.placeholder = this.placeholderInput.current.value;
        }

        if (type === partTypes.CHOICE) {
            if (this.checkRightAnswer()) {
                const choiceVariants = [];
                const choiceCount = this.state.choicesCount;

                for (let i = 0; i < choiceCount; i++) {
                    let choiceVariant = {};
                    choiceVariant.title = this["form-" + i].current.value;
                    choiceVariant.right = this["right-" + i].current.checked;
                    choiceVariants.push(choiceVariant);
                }

                textPart.choiceVariants = choiceVariants;
            } else {
                toast.error("Необходим хотя бы один правильный ответ");
                return;
            }
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

    checkRightAnswer() {
        const choiceCount = this.state.choicesCount;

        for (let i = 0; i < choiceCount; i++) {
            if (this["right-" + i].current.checked) {
                return true;
            }
        }

        return false;
    }

    render() {
        let body;
        let type = this.state.type;

        if (type === partTypes.TEXT) {
            body = <Form.Group controlId="textForm">
                <Form.Label>Текст</Form.Label>
                <Form.Control as="textarea" ref={this.dataInput}/>
            </Form.Group>
        } else if (type === partTypes.QUESTION) {
            body = <div>
                <Form.Group>
                    <Form.Label>Текст</Form.Label>
                    <Form.Control as="textarea" ref={this.dataInput}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Подсказка</Form.Label>
                    <Form.Control ref={this.placeholderInput}/>
                </Form.Group>
            </div>
        } else if (type === partTypes.CHOICE) {
            const choiceForms = [];

            for (let i = 0; i < this.state.choicesCount; i++) {
                this["right-" + i] = createRef();
                this["form-" + i] = createRef();

                choiceForms.push(
                    <InputGroup key={i} className="admin-text-choice-part-input">
                        <InputGroup.Prepend>
                            <Form.Check name="right-variant" type="radio" ref={this["right-" + i]}/>
                        </InputGroup.Prepend>
                        <Form.Control ref={this["form-" + i]}/>
                    </InputGroup>
                );
            }

            body = <div>
                <Form.Group>
                    <Form.Label>Варианты</Form.Label>
                    {choiceForms}
                </Form.Group>

                <Button onClick={this.increaseChoicesCount.bind(this)}>Добавить вариант</Button>
                <Button onClick={this.decreaseChoicesCount.bind(this)}>Удалить вариант</Button>
            </div>
        }

        return <Modal show={this.props.showModal} onHide={this.props.hideModal.bind(this)} size="large">
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
                                                       defaultValue={partTypes.TEXT}>
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
                            className="float-right" variant="success">Сохранить</Button>
                </Form>
            </Modal.Body>
        </Modal>
    }
}

export default CreatePartModal;
