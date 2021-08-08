import React from "react";
import {Button, Form, InputGroup} from "react-bootstrap";

class ChoicePartModalBody extends React.Component {

    render() {
        const choiceForms = this.props.choiceFormsData.map((value, index) => {
            return <InputGroup key={index} className="admin-text-choice-part-input">
                <InputGroup.Prepend>
                    <Form.Check name="right-variant" type="radio"
                                ref={value.rightRef} defaultChecked={value.right}/>
                </InputGroup.Prepend>
                <Form.Control ref={value.titleRef} defaultValue={value.title}/>
            </InputGroup>
        });

        return <>
            <Form.Group>
                <Form.Label>Варианты</Form.Label>
                {choiceForms}
            </Form.Group>

            <Button onClick={this.props.increaseChoicesCount}>Добавить вариант</Button>
            <Button onClick={this.props.decreaseChoicesCount}>Удалить вариант</Button>
        </>
    }
}

export default ChoicePartModalBody;
