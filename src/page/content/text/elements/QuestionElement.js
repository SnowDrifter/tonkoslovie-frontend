import React from "react";
import {Form} from "react-bootstrap";
import {CORRECT_ANSWER} from "/constant/AnswerStatus";


function QuestionElement({part, index, changeUserAnswer}) {

    function calculateInputLength(part) {
        const maxLength = Math.max(part.data.length, part.placeholder.length);
        return maxLength <= 3 ? 50 : (maxLength * 8 + 18)
    }

    return <Form.Group className="text-element">
        <Form.Control onChange={e => changeUserAnswer(index, e.target.value)}
                      style={{width: calculateInputLength(part)}}
                      className={part.answerStatus?.validationClass}
                      type="text"
                      size="sm"
                      disabled={part.answerStatus === CORRECT_ANSWER}
                      placeholder={part.placeholder}
                      maxLength={part.data.length}/>
    </Form.Group>;
}

export default QuestionElement;