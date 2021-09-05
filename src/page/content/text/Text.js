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
            loaded: false,
            failed: false
        };

        this.checkAnswers = this.checkAnswers.bind(this);

        if (props.match.params.textId) {
            this.loadText(props.match.params.textId)
        }
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
                loaded: true
            });
        }).catch(() => {
            this.setState({
                failed: true
            });
        })
    }

    checkAnswers(event) {
        event.preventDefault();
        let textParts = this.state.textParts;

        textParts.map((part, index) => {
            if (part.type === partTypes.QUESTION || part.type === partTypes.CHOICE) {
                this[`element-${index}`].current.checkAnswer();
            }
        });

        this.setState({textParts: textParts});
    }

    render() {
        let elements = [];
        const title = `${this.state.title} | Тонкословие`;

        this.state.textParts.map((part, index) => {
            switch (part.type) {
                case partTypes.TEXT: {
                    elements.push(<div className="text-element" key={index}>{part.data}</div>);
                    break;
                }
                case partTypes.LINE_BREAK: {
                    elements.push(<div className="text-content-line-break" key={index}/>);
                    break;
                }
                case partTypes.QUESTION: {
                    this[`element-${index}`] = createRef();
                    elements.push(<QuestionElement ref={this[`element-${index}`]}
                                                   part={part} key={index} index={index}/>);
                    break;
                }
                case partTypes.CHOICE: {
                    this[`element-${index}`] = createRef();
                    elements.push(<ChoiceElement ref={this[`element-${index}`]}
                                                 part={part} key={index} index={index}/>);
                    break;
                }
            }
        });

        let body = <Card>
            <Card.Header style={{textAlign: "center"}}><h2>{this.state.title}</h2></Card.Header>
            <Helmet title={title}/>

            <Card.Body>
                <Jumbotron className="text-body" style={{textAlign: "justify"}}>
                    <Form inline id="text-body-form" className="text-content">
                        {elements}
                    </Form>
                    <Button form="text-body-form" size="lg" type="submit" onClick={this.checkAnswers.bind(this)}
                            className="float-right text-check-button" variant="success">Проверить</Button>
                </Jumbotron>

                <SoundPlayer soundFileName={this.state.soundFileName}/>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else if (this.state.failed) {
            return <ErrorPanel text="Текст не найден"/>;
        } else {
            return <Loader/>;
        }
    }
}

export default Text;
