import React, {createRef} from "react";
import {Form} from "react-bootstrap";


class QuestionElement extends React.Component {

    constructor(props) {
        super(props);

        this[`form-${props.index}`] = createRef();
    }

    checkAnswer() {
        const part = this.props.part;
        let answer = this[`form-${this.props.index}`].current.value;
        answer = answer.trim().toLowerCase();

        if (answer === part.data.toLowerCase()) {
            part.success = true;
        } else {
            part.error = true;
        }
    }

    calculateInputLength(part) {
        if (part.data.length > part.placeholder.length) {
            if (part.data.length <= 3) {
                return 70;
            } else {
                return (part.data.length + 1) * 8 + 10;
            }
        } else {
            if (part.placeholder.length <= 3) {
                return 70;
            } else {
                return (part.placeholder.length + 1) * 8 + 10;
            }
        }
    }

    render() {
        const part = this.props.part;
        let validationClass;
        let disabled = false;

        if (part.success) {
            validationClass = "is-valid";
            disabled = true;
        } else if (part.error) {
            validationClass = "is-invalid";
        }

        return <Form.Group className="text-element">
            <Form.Control
                ref={this[`form-${this.props.index}`]}
                style={{width: this.calculateInputLength(part)}}
                className={validationClass}
                type="text"
                size="sm"
                disabled={disabled}
                placeholder={part.placeholder}
                maxLength={part.data.length}
            />
        </Form.Group>;
    }
}


export default QuestionElement;