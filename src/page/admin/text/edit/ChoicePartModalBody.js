import React from "react";
import {Button, Form, InputGroup} from "react-bootstrap";

function ChoicePartModalBody({textPart, changeTextPart}) {

    function onChangeTitle(index, value) {
        const newChoiceVariants = textPart.choiceVariants.map((v, i) => {
            return i === index ? {...v, title: value} : v
        })

        changeTextPart({...textPart, choiceVariants: newChoiceVariants})
    }

    function onChangeCorrectVariant(index) {
        const newChoiceVariants = textPart.choiceVariants.map((v, i) => {
            return {...v, correct: i === index}
        })
        changeTextPart({...textPart, choiceVariants: newChoiceVariants})
    }

    function increaseChoicesCount() {
        const choiceVariants = textPart.choiceVariants || [];
        choiceVariants.push({title: "", correct: false});
        changeTextPart({...textPart, choiceVariants: choiceVariants})
    }

    function decreaseChoicesCount() {
        const choiceVariants = textPart.choiceVariants || [];
        if (choiceVariants.length > 1) {
            choiceVariants.pop();
            changeTextPart({...textPart, choiceVariants: choiceVariants})
        }
    }

    function createChoiceForms() {
        return textPart.choiceVariants?.map((value, index) => {
            return <InputGroup key={index} className="admin-text-choice-part-input">
                <Form.Check inline name="correct-variant" type="radio" defaultChecked={value.correct}
                            onChange={() => onChangeCorrectVariant(index)}/>
                <Form.Control defaultValue={value.title}
                              onChange={e => onChangeTitle(index, e.target.value)}/>
            </InputGroup>
        });
    }

    return <>
        <Form.Group>
            <Form.Label>Варианты</Form.Label>
            {createChoiceForms()}
        </Form.Group>

        <Button onClick={increaseChoicesCount}>Добавить вариант</Button>
        <Button onClick={decreaseChoicesCount}>Удалить вариант</Button>
    </>
}

export default ChoicePartModalBody;
