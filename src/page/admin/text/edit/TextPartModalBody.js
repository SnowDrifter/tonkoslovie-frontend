import React from "react";
import {Form} from "react-bootstrap";

function TextPartModalBody({textPart, changeTextPart}) {

    function onChangeData(newData) {
        changeTextPart({...textPart, data: newData})
    }

    return <Form.Group>
        <Form.Label>Текст</Form.Label>
        <Form.Control as="textarea" defaultValue={textPart.data} onChange={e => onChangeData(e.target.value)}/>
    </Form.Group>

}

export default TextPartModalBody;
