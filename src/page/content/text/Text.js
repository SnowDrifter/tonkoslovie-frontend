import React from "react";
import {Button, Card, Form} from "react-bootstrap";
import Client from "/util/Client";
import {TEXT, QUESTION, CHOICE, LINE_BREAK} from "./TextPartTypes";
import Helmet from "react-helmet";
import ErrorPanel from "/component/ErrorPanel";
import Loader from "/component/Loader";
import QuestionElement from "./elements/QuestionElement";
import ChoiceElement from "./elements/ChoiceElement";
import SoundPlayer from "/component/sound/SoundPlayer";
import {CORRECT_ANSWER, WRONG_ANSWER} from "/constant/AnswerStatus";
import "./Text.less"

class Text extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            text: {},
            loading: false,
            failed: false
        };

        this.loadText(props.params.textId)
    }

    loadText(textId) {
        Client.get("/api/content/text", {params: {id: textId}})
            .then(response => {
                this.setState({
                    text: response.data,
                    loading: false
                });
            })
            .catch(() => {
                this.setState({
                    failed: true,
                    loading: false
                });
            })
    }

    checkAnswers = (event) => {
        event.preventDefault();

        const parts = this.state.text.parts?.map(part => {
            switch (part.type) {
                case QUESTION:
                    return this.checkQuestionAnswer(part)
                case CHOICE:
                    return this.checkChoiceAnswer(part)
                default:
                    return part;
            }
        });

        this.updateText("parts", parts)
    }

    checkQuestionAnswer = (part) => {
        if (part.userAnswer?.toLowerCase() === part.data.toLowerCase()) {
            part.answerStatus = CORRECT_ANSWER;
        } else {
            part.answerStatus = WRONG_ANSWER;
        }

        return part;
    }

    checkChoiceAnswer = (part) => {
        if (this.checkChoiceVariant(part.userAnswer, part.choiceVariants)) {
            part.answerStatus = CORRECT_ANSWER;
        } else {
            part.answerStatus = WRONG_ANSWER;
        }

        return part;
    }

    checkChoiceVariant = (answer, variants) => {
        return variants.some(value => {
            if (value.title === answer) {
                return !!value.correct;
            }
        });
    }

    changeUserAnswer = (index, userAnswer) => {
        const parts = this.state.text.parts?.map((part, i) => {
            return i === index ? {...part, userAnswer: userAnswer} : part
        });

        this.updateText("parts", parts)
    }

    updateText = (field, value) => this.setState({text: {...this.state.text, [field]: value}});

    createElements = () => {
        return this.state.text.parts?.map((part, index) => {
            switch (part.type) {
                case TEXT:
                    return <div className="text-element" key={index}>{part.data}</div>;
                case QUESTION:
                    return <QuestionElement part={part} key={index} index={index} changeUserAnswer={this.changeUserAnswer}/>
                case CHOICE:
                    return <ChoiceElement part={part} key={index} index={index} changeUserAnswer={this.changeUserAnswer}/>
                case LINE_BREAK:
                    return <div className="text-content-line-break" key={index}/>
            }
        });
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        } else if (this.state.failed) {
            return <ErrorPanel text="Текст не найден"/>;
        }

        const {text} = this.state;

        return <Card>
            <Card.Header style={{textAlign: "center"}}><h2>{text.title}</h2></Card.Header>
            <Helmet title={`${text.title || ""} | Тонкословие`}/>

            <Card.Body>
                <div className="jumbotron text-body">
                    <Form id="text-body-form" className="text-content">
                        {this.createElements()}
                    </Form>
                    <Button form="text-body-form" size="lg" type="submit" onClick={this.checkAnswers}
                            className="float-end text-check-button" variant="success">Проверить</Button>
                </div>

                <SoundPlayer soundFileName={text.soundFileName}/>
            </Card.Body>
        </Card>;
    }
}

export default Text;
