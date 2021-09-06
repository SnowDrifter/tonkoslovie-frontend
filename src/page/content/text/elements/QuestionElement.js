import React, {createRef} from "react";
import {Form} from "react-bootstrap";
import * as answerStatuses from "/page/content/text/TextPartAnswerStatus";


class QuestionElement extends React.Component {

    constructor(props) {
        super(props);

        this[`form-${props.index}`] = createRef();
    }

    checkAnswer() {
        const part = this.props.part;
        const answer = this[`form-${this.props.index}`].current.value.trim().toLowerCase();

        if (answer === part.data.toLowerCase()) {
            part.answerStatus = answerStatuses.CORRECT_ANSWER;
        } else {
            part.answerStatus = answerStatuses.WRONG_ANSWER;
        }

        return part;
    }

    calculateInputLength(part) {
        const maxLength = Math.max(part.data.length, part.placeholder.length);
        return maxLength <= 3 ? 50 : (maxLength * 8 + 18)
    }

    render() {
        const part = this.props.part;

        return <Form.Group className="text-element">
            <Form.Control ref={this[`form-${this.props.index}`]}
                          style={{width: this.calculateInputLength(part)}}
                          className={part.answerStatus?.validationClass}
                          type="text"
                          size="sm"
                          disabled={part.answerStatus === answerStatuses.CORRECT_ANSWER}
                          placeholder={part.placeholder}
                          maxLength={part.data.length}/>
        </Form.Group>;
    }
}


export default QuestionElement;