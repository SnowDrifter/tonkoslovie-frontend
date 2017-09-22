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
import client from "../util/client";
import * as partTypes from  './TextPartTypes'
import styles from './Text.less';
import Helmet from "react-helmet";
import ReactPlayer from 'react-player'

class LessonText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
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
        client.get('/api/content/text', {
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
            if (part.type == partTypes.QUESTION) {
                let answer = ReactDOM.findDOMNode(this['form-' + index]).value;
                answer = answer.trim().toLowerCase();

                if (answer == part.data.toLowerCase()) {
                    part.success = true;
                } else {
                    part.error = true;
                }
            } if (part.type == partTypes.CHOICE) {
                let answer = ReactDOM.findDOMNode(this['form-' + index]).value;

                if(this.checkChoiceVariant(answer, part.choiceVariants)) {
                    part.success = true;
                } else {
                    part.error = true;
                }
            }
        });

        this.setState({textParts: textParts});
    }

    checkChoiceVariant(currentVariant, variants) {
       return variants.some(value => {
            if(value.title == currentVariant) {
                return !!value.right;
            }
        });
    }

    render() {
        let components = [];
        let title = this.state.title + " | Тонкословие";

        this.state.textParts.map((part, index) => {
            switch (part.type) {
                case partTypes.TEXT:
                    components.push(<dev className="text-part" key={index}>{part.data}</dev>);
                    break;
                case partTypes.LINE_BREAK:
                    components.push(<div className="clearfix" key={index}/>);
                    break;
                case partTypes.QUESTION: {
                    let validateState;
                    let disabled = false;
                    if (part.success) {
                        validateState = "success";
                        disabled = true;
                    } else if (part.error) {
                        validateState = "error";
                    }

                    components.push(<FormGroup key={index} validationState={validateState} className="text-part">
                        <FormControl
                            ref={part => {
                                this['form-' + index] = part
                            }}
                            style={{width: part.data.length * 15 + 15}}
                            type="text"
                            bsSize="small"
                            disabled={disabled}
                            placeholder={part.placeholder}
                            maxLength={part.data.length}
                        />
                        <FormControl.Feedback />
                    </FormGroup>);
                    break;
                }
                case partTypes.CHOICE: {
                    const variants = [];
                    variants.push(<option key={-1} value="-1">Выберите правильный вариант</option>);

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

                    components.push( <FormGroup  validationState={validateState} key={index}>
                        <FormControl componentClass="select"
                                     placeholder="select"
                                     bsSize="small"
                                     disabled={disabled}
                                     ref={part => {
                                         this['form-' + index] = part
                                     }}>
                            {variants}
                        </FormControl>
                    </FormGroup>);
                    break;
                }
            }
        });

        let soundComponent;
        if (this.state.soundFileName) {
            soundComponent = <div className="center-block">
                <h4>Прослушать текст</h4>
                <ReactPlayer
                    height={40}
                    controls={true}
                    url={process.env.NGINX_ENDPOINT + '/tonkoslovie/sounds/' + this.state.soundFileName}/>
            </div>
        }

        let content = <Panel>
            <Helmet title={title}/>
            <PageHeader style={{textAlign: "center"}}>{this.state.title}</PageHeader>

            <Jumbotron style={{textAlign: "justify"}}>
                <form className="form-inline">
                    {components}
                    <Button type="submit" onClick={this.checkAnswers.bind(this)} className="pull-right"
                            bsStyle="success">Проверить</Button>
                </form>
            </Jumbotron>

            {soundComponent}
        </Panel>;

        if (this.state.loaded) {
            return content;
        } else if (this.state.failed) {
            return <Jumbotron><h2 style={{color: "red", textAlign: "center"}}>Текст не найден</h2></Jumbotron>;
        } else {
            return null;
        }
    }
}

export default LessonText;
