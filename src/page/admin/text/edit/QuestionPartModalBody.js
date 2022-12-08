import React from "react";
import {Form} from "react-bootstrap";

function QuestionPartModalBody({textPart, changeTextPart}) {

    function onChangeData(field, value) {
        changeTextPart({...textPart, [field]: value})
    }

    return <>
        <Form.Group>
            <Form.Label>Текст</Form.Label>
            <Form.Control as="textarea" defaultValue={textPart.data}
                          onChange={e => onChangeData("data", e.target.value)}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Подсказка</Form.Label>
            <Form.Control defaultValue={textPart.placeholder}
                          onChange={e => onChangeData("placeholder", e.target.value)}/>
        </Form.Group>
    </>
}

export default QuestionPartModalBody;
