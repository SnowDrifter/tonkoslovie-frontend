import React from "react";
import {Form} from "react-bootstrap";
import {Field} from "formik";

function ValidationForm({as, md, controlId, label, name, type}) {

    return <Field name={name}>
        {({field, form}) => {
            const isValid = !form.errors[field.name];
            const isInvalid = form.touched[field.name] && !isValid;

            return <Form.Group as={as} md={md} controlId={controlId}>
                <Form.Label>{label}<span style={{color: "red"}}> *</span></Form.Label>
                <Form.Control {...field} type={type}
                              isInvalid={isInvalid}
                              isValid={form.touched[field.name] && isValid}/>
                <Form.Control.Feedback type="invalid">{form.errors[field.name]}</Form.Control.Feedback>
            </Form.Group>
        }}
    </Field>
}

export default ValidationForm;