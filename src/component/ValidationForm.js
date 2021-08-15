import React from "react";
import {Form} from "react-bootstrap";

class ValidationForm extends React.Component {

    render() {
        const {label, inputRef, checked, valid, message, type} = this.props;
        const className = checked ? (valid ? "is-valid" : "is-invalid") : null;

        return <Form.Group>
            <Form.Label>{label}<span style={{color: "red"}}> *</span></Form.Label>
            <Form.Control ref={inputRef} className={className} type={type}/>
            <Form.Control.Feedback type="invalid">{message}</Form.Control.Feedback>
        </Form.Group>
    }
}

export default ValidationForm;