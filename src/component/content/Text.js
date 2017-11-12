import React from "react";
import ReactDOM from "react-dom";
import {
    Panel,
    PageHeader,
    FormGroup,
    ControlLabel,
    FormControl,
    Button,
    ButtonToolbar,
    ButtonGroup,
    Modal,
    Form,
    Jumbotron,
    Glyphicon,
    Grid,
    Row,
    Col
} from "react-bootstrap";
import client from "../../util/client";
import style from "./Text.less"
import * as partTypes from "./TextPartTypes";
import Helmet from "react-helmet";
import ReactPlayer from "react-player";
import Loader from "../Loader";

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

        if (this.props.params.textId) {
            this.loadText(this.props.params.textId)
        }
    }

    loadText(textId) {
        client.get("/api/content/text", {
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
            if (part.type == partTypes.QUESTION || part.type == partTypes.CHOICE) {
                this["part-" + index].checkAnswer();
            }
        });

        this.setState({textParts: textParts});
    }

    render() {
        let components = [];
        let title = this.state.title + " | Тонкословие";

        this.state.textParts.map((part, index) => {
            switch (part.type) {
                case partTypes.TEXT: {
                    components.push(<dev className="text-part" key={index}>{part.data}</dev>);
                    break;
                }
                case partTypes.LINE_BREAK: {
                    components.push(<div className="clearfix" key={index}/>);
                    break;
                }
                case partTypes.QUESTION: {
                    components.push(<QuestionPart ref={instance => {
                        this["part-" + index] = instance;
                    }} key={index} part={part} index={index}/>);
                    break;
                }
                case partTypes.CHOICE: {
                    components.push(<ChoicePart ref={instance => {
                        this["part-" + index] = instance;
                    }} part={part} key={index} index={index}/>);
                    break;
                }
            }
        });

        let soundComponent;
        if (this.state.soundFileName) {
            soundComponent = <div className="center-block">
                <h4>Прослушать текст</h4>
                <ReactPlayer
                    width="100%"
                    height={40}
                    controls={true}
                    url={process.env.MEDIA_ENDPOINT + "/tonkoslovie/sounds/" + this.state.soundFileName}/>
            </div>
        }

        let body = <Panel>
            <Helmet title={title}/>
            <PageHeader style={{textAlign: "center"}}>{this.state.title}</PageHeader>

            <Jumbotron className="text-body" style={{textAlign: "justify"}}>
                <form className="form-inline">
                    {components}
                    <br style={{lineHeight: "40px"}}/>
                    <Button bsSize="large" type="submit" onClick={this.checkAnswers.bind(this)} className="pull-right"
                            bsStyle="success">Проверить</Button>
                </form>
            </Jumbotron>

            {soundComponent}
        </Panel>;

        if (this.state.loaded) {
            return body;
        } else if (this.state.failed) {
            return <Jumbotron><h2 style={{color: "red", textAlign: "center"}}>Текст не найден</h2></Jumbotron>;
        } else {
            return <Loader/>;
        }
    }
}

class QuestionPart extends React.Component {

    checkAnswer() {
        const part = this.props.part;
        let answer = ReactDOM.findDOMNode(this["form-" + this.props.index]).value;
        answer = answer.trim().toLowerCase();

        if (answer == part.data.toLowerCase()) {
            part.success = true;
        } else {
            part.error = true;
        }
    }

    calculateInputLength(part) {
        if(part.data.length > part.placeholder.length) {
            if(part.data.length <= 3) {
                return 70;
            } else {
                return (part.data.length  + 1) * 8 + 10;
            }
        } else {
            if(part.placeholder.length <= 3) {
                return 70;
            } else {
                return (part.placeholder.length  + 1) * 8 + 10;
            }
        }
    }

    render() {
        const part = this.props.part;
        let validateState;
        let disabled = false;

        if (part.success) {
            validateState = "success";
            disabled = true;
        } else if (part.error) {
            validateState = "error";
        }

        return <FormGroup className="text-part" validationState={validateState}>
            <FormControl
                ref={part => {
                    this["form-" + this.props.index] = part
                }}
                style={{width: this.calculateInputLength(part)}}
                type="text"
                bsSize="small"
                disabled={disabled}
                placeholder={part.placeholder}
                maxLength={part.data.length}
            />
        </FormGroup>;
    }
}

class ChoicePart extends React.Component {

    checkAnswer() {
        const part = this.props.part;
        let answer = ReactDOM.findDOMNode(this["form-" + this.props.index]).value;

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
            if (value.title == currentVariant) {
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

        let validateState;
        let disabled = false;
        if (part.success) {
            validateState = "success";
            disabled = true;
        } else if (part.error) {
            validateState = "error"
        }

        return <FormGroup className="text-part" validationState={validateState}>
            <FormControl componentClass="select"
                         bsSize="small"
                         disabled={disabled}
                         ref={part => {
                             this["form-" + this.props.index] = part
                         }}>
                {variants}
            </FormControl>
        </FormGroup>
    }
}

export default Text;
