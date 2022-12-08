import React from "react";
import {Form} from "react-bootstrap";
import {CORRECT_ANSWER} from "/constant/AnswerStatus";


function ChoiceElement({part, index, changeUserAnswer}) {

    const variants = part.choiceVariants.map((value, index) => {
        return <option key={index} value={value.title}>{value.title}</option>
    });

    return <Form.Group className="text-element">
        <Form.Control as="select"
                      className={part.answerStatus?.validationClass}
                      size="sm"
                      disabled={part.answerStatus === CORRECT_ANSWER}
                      defaultValue={part.userAnswer}
                      onChange={e => changeUserAnswer(index, e.target.value)}>
            <option key={-1} value="-1" hidden>Выберите правильный вариант</option>
            {variants}
        </Form.Control>
    </Form.Group>
}

export default ChoiceElement;