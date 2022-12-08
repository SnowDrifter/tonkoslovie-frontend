import React from "react";
import {Button, ButtonToolbar, Form, Modal, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {TEXT, QUESTION, CHOICE} from "/page/content/text/TextPartTypes";
import TextPartModalBody from "/page/admin/text/edit/TextPartModalBody";
import QuestionPartModalBody from "/page/admin/text/edit/QuestionPartModalBody";
import ChoicePartModalBody from "/page/admin/text/edit/ChoicePartModalBody";


function EditPartModal({textPart, changeTextPart, saveTextPartChanges, showModal, hideModal, modalTitle}) {

    function changeType(newType) {
        const textPart = {type: newType}
        if (newType === CHOICE) {
            textPart.choiceVariants = [{title: "", correct: true}]
        }
        changeTextPart(textPart)
    }

    function createBody() {
        switch (textPart.type) {
            case TEXT:
                return <TextPartModalBody changeTextPart={changeTextPart} textPart={textPart}/>
            case QUESTION:
                return <QuestionPartModalBody changeTextPart={changeTextPart} textPart={textPart}/>
            case CHOICE:
                return <ChoicePartModalBody changeTextPart={changeTextPart} textPart={textPart}/>
        }
    }

    return textPart && <Modal show={showModal} onHide={hideModal} size="lg" centered>
        <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="admin-text-modal-body">
            <Form>
                <ButtonToolbar>
                    <ToggleButtonGroup type="radio" name="options" onChange={changeType}
                                       defaultValue={textPart.type}>
                        <ToggleButton id={TEXT} value={TEXT}>Текст</ToggleButton>
                        <ToggleButton id={QUESTION} value={QUESTION}>Вопрос</ToggleButton>
                        <ToggleButton id={CHOICE} value={CHOICE}>Выбор</ToggleButton>
                    </ToggleButtonGroup>
                </ButtonToolbar>

                {createBody()}

                <Button onClick={() => saveTextPartChanges(textPart)} className="mt-3 float-end"
                        variant="success">Сохранить</Button>
            </Form>
        </Modal.Body>
    </Modal>
}

export default EditPartModal;
