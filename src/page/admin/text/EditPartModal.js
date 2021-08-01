import React, {createRef} from "react";
import {
    Button,
    ButtonToolbar,
    Col,
    Form,
    Modal,
    Row,
    ToggleButton,
    ToggleButtonGroup
} from "react-bootstrap";
import * as partTypes from "/page/content/text/TextPartTypes";
import {toast} from "react-toastify";
import TextPartBody from "./part/TextPartBody";
import QuestionPartBody from "./part/QuestionPartBody";
import ChoicePartBody from "./part/ChoicePartBody";

class EditPartModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            textPart: props.textPart,
        };

        this.dataInput = createRef();
        this.placeholderInput = createRef();

        this.increaseChoicesCount = this.increaseChoicesCount.bind(this);
        this.decreaseChoicesCount = this.decreaseChoicesCount.bind(this);
        this.changeType = this.changeType.bind(this);
    }

    increaseChoicesCount() {
        const choiceVariants = this.state.textPart.choiceVariants || [];
        choiceVariants.push("");

        const textPart = {...this.state.textPart, choiceVariants: choiceVariants}
        this.props.changeTextPart(textPart)
    }

    decreaseChoicesCount() {
        const choiceVariants = this.state.textPart.choiceVariants || [];
        if (choiceVariants.length > 1) {
            choiceVariants.pop();
            const textPart = {...this.state.textPart, choiceVariants: choiceVariants}
            this.props.changeTextPart(textPart)
        }
    }

    static getDerivedStateFromProps(props) {
        return {textPart: props.textPart}
    }

    saveTextPart() {
        const textPart = this.state.textPart;
        const type = textPart.type;

        if (type === partTypes.TEXT) {
            textPart.data = this.dataInput.current.value;
        }

        if (type === partTypes.QUESTION) {
            textPart.data = this.dataInput.current.value;
            textPart.placeholder = this.placeholderInput.current.value;
        }

        if (type === partTypes.CHOICE) {
            if (this.checkRightAnswer()) {
                const choiceCount = this.state.textPart.choiceVariants.length;
                textPart.choiceVariants = Array(choiceCount).map(i => {
                    return {
                        title: this[`form-${i}`].current.value,
                        right: this[`right-${i}`].current.checked
                    }
                });
            } else {
                toast.error("Необходим хотя бы один правильный ответ");
                return;
            }
        }

        this.props.saveTextPartChanges(textPart)
        this.props.hideModal()
    }

    changeType(newType) {
        const textPart = {...this.state.textPart, type: newType}
        this.props.changeTextPart(textPart)
    }

    checkRightAnswer() {
        const choiceCount = this.state.textPart.choiceVariants.length;
        for (let i = 0; i < choiceCount; i++) {
            if (this[`right-${i}`].current.checked) {
                return true;
            }
        }

        return false;
    }

    createBody(textPart) {
        switch (textPart.type) {
            case partTypes.TEXT:
                return <TextPartBody dataInput={this.dataInput} data={textPart.data}/>
            case partTypes.QUESTION:
                return <QuestionPartBody dataInput={this.dataInput} data={textPart.data}
                                         placeholderInput={this.placeholderInput} placeholder={textPart.placeholder}/>
            case partTypes.CHOICE: {
                const choiceVariants = textPart.choiceVariants || [{}];
                const choiceFormsData = choiceVariants.map((value, index) => {
                    this[`right-${index}`] = createRef();
                    this[`form-${index}`] = createRef();
                    return {
                        title: value.title,
                        titleRef: this[`form-${index}`],
                        right: value.right,
                        rightRef: this[`right-${index}`]
                    }
                });

                return <ChoicePartBody choiceFormsData={choiceFormsData}
                                       increaseChoicesCount={this.increaseChoicesCount}
                                       decreaseChoicesCount={this.decreaseChoicesCount}/>
            }
        }
    }

    render() {
        const textPart = this.state.textPart;
        if (!textPart) {
            return null;
        }

        const body = this.createBody(textPart)

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
                                                       defaultValue={textPart.type}>
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

export default EditPartModal;
