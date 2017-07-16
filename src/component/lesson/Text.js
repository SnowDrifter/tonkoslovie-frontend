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
import axios from "axios";
import * as partTypes from  '../TextPartTypes'
import styles from './Text.less';

class LessonText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: undefined,
            textParts: []
        };

        this.checkAnswers = this.checkAnswers.bind(this);

        if (this.props.params.textId) {
            this.loadText(this.props.params.textId)
        }
    }

    loadText(textId) {
        axios.get('http://localhost:8080/api/content/text', {
            params: {
                id: textId
            }
        }).then(response => {
            const text = response.data;
            this.setState({
                id: text.id,
                title: text.title,
                textParts: text.parts
            });
        })
    }

    checkAnswers(event) {
        event.preventDefault();
        let textParts = this.state.textParts;

        textParts.map((part, index) => {
            if (part.type == partTypes.QUESTION) {
                let answer = ReactDOM.findDOMNode(this['form-' + index]).value;
                if (answer.toLowerCase() == part.data) {
                    part.ok = true;
                } else {
                    part.error = true;
                }
            }
        });

        this.setState({textParts: textParts});
    }

    render() {
        let components = [];

        this.state.textParts.map((part, index) => {
            switch(part.type) {
                case partTypes.TEXT:  components.push(<dev className="text-part" key={index}>{part.data}</dev>); break;
                case partTypes.LINE_BREAK: components.push(<div className="clearfix" key={index}/>); break;
                case partTypes.QUESTION: {
                    let validateState;
                    let disabled = false;
                    if (part.ok) {
                        validateState = "success";
                        disabled = true;
                    } else if (part.error) {
                        validateState = "error"
                    }

                    components.push(<FormGroup key={index} validationState={validateState} className="text-part">
                        <FormControl
                            ref={part => {
                                this['form-' + index] = part
                            }}
                            type="text"
                            bsSize="small"
                            disabled={disabled}
                            placeholder={part.placeholder}
                        />
                        <FormControl.Feedback />
                    </FormGroup>);
                    break;
                }
            }
        });

        return <Panel>
            <PageHeader>{this.state.title}</PageHeader>

            <Jumbotron style={{textAlign: "justify"}} >
                <form className="form-inline">
                    {components}
                    <Button type="submit" onClick={this.checkAnswers.bind(this)} className="pull-right" bsStyle="success">Проверить</Button>
                </form>
            </Jumbotron>
        </Panel>
    }
}

export default LessonText;
