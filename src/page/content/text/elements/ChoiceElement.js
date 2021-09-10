import React, {createRef} from "react";
import {Form} from "react-bootstrap";
import {WRONG_ANSWER, CORRECT_ANSWER} from "/constant/AnswerStatus";


class ChoiceElement extends React.Component {

    constructor(props) {
        super(props);

        this[`form-${props.index}`] = createRef();
    }

    checkAnswer() {
        const part = this.props.part;
        const answer = this[`form-${this.props.index}`].current.value;

        if (this.checkChoiceVariant(answer, part.choiceVariants)) {
            part.answerStatus = CORRECT_ANSWER;
        } else {
            part.answerStatus = WRONG_ANSWER;
        }

        return part;
    }

    checkChoiceVariant(currentVariant, variants) {
        return variants.some(value => {
            if (value.title === currentVariant) {
                return !!value.correct;
            }
        });
    }

    render() {
        const part = this.props.part;
        const variants = part.choiceVariants.map((value, index) => {
            return <option key={index} value={value.title}>{value.title}</option>
        });

        return <Form.Group className="text-element">
            <Form.Control as="select"
                          className={part.answerStatus?.validationClass}
                          size="sm"
                          disabled={part.answerStatus === CORRECT_ANSWER}
                          ref={this[`form-${this.props.index}`]}>
                <option key={-1} value="-1" hidden>Выберите правильный вариант</option>
                {variants}
            </Form.Control>
        </Form.Group>
    }
}

export default ChoiceElement;