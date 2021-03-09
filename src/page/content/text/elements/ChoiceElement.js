import React, {createRef} from "react";
import {Form} from "react-bootstrap";


class ChoiceElement extends React.Component {

    constructor(props) {
        super(props);
        this[`form-${this.props.index}`] = createRef();
    }

    checkAnswer() {
        const part = this.props.part;
        let answer = this[`form-${this.props.index}`].current.value;

        if (this.checkChoiceVariant(answer, part.choiceVariants)) {
            part.success = true;
            return true;
        } else {
            part.error = true;
            return false;
        }
    }

    checkChoiceVariant(currentVariant, variants) {
        return variants.some(value => {
            if (value.title === currentVariant) {
                return !!value.right;
            }
        });
    }

    render() {
        const part = this.props.part;
        const variants = [];
        variants.push(<option key={-1} value="-1" hidden>Выберите правильный вариант</option>);

        part.choiceVariants.map((value, index) => {
            variants.push(<option key={index} value={value.title}>{value.title}</option>);
        });

        let validationClass;
        let disabled = false;

        if (part.success) {
            validationClass = "is-valid";
            disabled = true;
        } else if (part.error) {
            validationClass = "is-invalid";
        }

        return <Form.Group className="text-element">
            <Form.Control as="select"
                          className={validationClass}
                          size="sm"
                          disabled={disabled}
                          ref={this[`form-${this.props.index}`]}>
                {variants}
            </Form.Control>
        </Form.Group>
    }
}

export default ChoiceElement;