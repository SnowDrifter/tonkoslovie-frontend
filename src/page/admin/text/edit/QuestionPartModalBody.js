import React from "react";
import {Form} from "react-bootstrap";

class QuestionPartModalBody extends React.Component {

    render() {
        return <>
            <Form.Group>
                <Form.Label>Текст</Form.Label>
                <Form.Control as="textarea" ref={this.props.dataInput} defaultValue={this.props.data}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Подсказка</Form.Label>
                <Form.Control ref={this.props.placeholderInput} defaultValue={this.props.placeholder}/>
            </Form.Group>
        </>
    }
}

export default QuestionPartModalBody;
