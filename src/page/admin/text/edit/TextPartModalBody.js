import React from "react";
import {Form} from "react-bootstrap";

class TextPartModalBody extends React.Component {

    render() {
        return <Form.Group>
            <Form.Label>Текст</Form.Label>
            <Form.Control as="textarea" ref={this.props.dataInput} defaultValue={this.props.data}/>
        </Form.Group>
    }
}

export default TextPartModalBody;
