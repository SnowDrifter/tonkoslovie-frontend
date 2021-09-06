import React, {createRef} from "react";
import {Button, Card, Form, Jumbotron} from "react-bootstrap";
import Client from "/util/Client";
import * as partTypes from "./TextPartTypes";
import Helmet from "react-helmet";
import ErrorPanel from "/component/ErrorPanel";
import Loader from "/component/Loader";
import QuestionElement from "./elements/QuestionElement";
import ChoiceElement from "./elements/ChoiceElement";
import "./Text.less"
import SoundPlayer from "/component/sound/SoundPlayer";

class Text extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            title: null,
            textParts: [],
            soundFileName: null,
            loading: false,
            failed: false
        };

        this.checkAnswers = this.checkAnswers.bind(this);

        this.loadText(props.match.params.textId)
    }

    loadText(textId) {
        Client.get("/api/content/text", {
            params: {
                id: textId
            }
        }).then(response => {
            const text = response.data;
            this.setState({
                id: text.id,
                title: text.title,
                textParts: text.parts,
                soundFileName: text.soundFileName,
                loading: false
            });
        }).catch(() => {
            this.setState({
                failed: true,
                loading: false
            });
        })
    }

    checkAnswers(event) {
        event.preventDefault();

        const textParts = this.state.textParts.map((part, index) => {
            if (part.type === partTypes.QUESTION || part.type === partTypes.CHOICE) {
                return this[`element-${index}`].current.checkAnswer();
            } else {
                return part;
            }
        });

        this.setState({textParts});
    }

    createElements() {
        return this.state.textParts.map((part, index) => {
            switch (part.type) {
                case partTypes.TEXT: {
                    return <div className="text-element" key={index}>{part.data}</div>;
                }
                case partTypes.QUESTION: {
                    this[`element-${index}`] = createRef();
                    return <QuestionElement ref={this[`element-${index}`]} part={part} key={index} index={index}/>
                }
                case partTypes.CHOICE: {
                    this[`element-${index}`] = createRef();
                    return <ChoiceElement ref={this[`element-${index}`]} part={part} key={index} index={index}/>
                }
                case partTypes.LINE_BREAK: {
                    return <div className="text-content-line-break" key={index}/>
                }
            }
        });
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        } else if (this.state.failed) {
            return <ErrorPanel text="Текст не найден"/>;
        }

        const elements = this.createElements();

        return <Card>
            <Card.Header style={{textAlign: "center"}}><h2>{this.state.title}</h2></Card.Header>
            <Helmet title={`${this.state.title || ""} | Тонкословие`}/>

            <Card.Body>
                <Jumbotron className="text-body">
                    <Form inline id="text-body-form" className="text-content">
                        {elements}
                    </Form>
                    <Button form="text-body-form" size="lg" type="submit" onClick={this.checkAnswers.bind(this)}
                            className="float-right text-check-button" variant="success">Проверить</Button>
                </Jumbotron>

                <SoundPlayer soundFileName={this.state.soundFileName}/>
            </Card.Body>
        </Card>;
    }
}

export default Text;
