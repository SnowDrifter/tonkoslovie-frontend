import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {
    Panel,
    Jumbotron,
    FormGroup,
    Row,
    Col,
    ControlLabel,
    FormControl,
    Button,
    Form,
    Glyphicon,
    ListGroup,
    ListGroupItem
} from "react-bootstrap";


class Lesson extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: undefined,
            relatedTexts: [],
            foundTexts: []
        };

        if (this.props.params.lessonId) {
            this.loadLesson(this.props.params.lessonId)
        }

        this.removeText = this.removeText.bind(this);
        this.addText = this.addText.bind(this);
    }

    loadLesson(lessonId) {
        axios.get('http://localhost:8080/api/content/lesson', {
            params: {
                id: lessonId
            }
        }).then(response => {
            const lesson = response.data;
            this.setState({
                id: lesson.id,
                relatedTexts: lesson.relatedTexts
            });

            ReactDOM.findDOMNode(this.title).value = lesson.title;
        })
    }

    saveLesson() {
        axios.post('http://localhost:8080/api/content/lesson', {
            id: this.state.id,
            title: ReactDOM.findDOMNode(this.title).value,
            relatedTexts: this.state.relatedTexts ? this.state.relatedTexts : []
        }).then(() => {
            alert("Сохранено"); // TODO
        })
    }

    searchText() {
        let searchTitle = ReactDOM.findDOMNode(this.textTitle).value;

        axios.get('http://localhost:8080/api/content/texts/findByTitle', {
            params: {
                title: searchTitle
            }
        }).then(response => {
            const texts = response.data;
            this.setState({
                foundTexts: texts
            });
        })
    }

    addText(index) {
        let text = this.state.foundTexts[index];

        let foundTexts = this.state.foundTexts;
        foundTexts.splice(index, 1);
        this.setState({foundTexts: foundTexts});

        this.setState({relatedTexts: this.state.relatedTexts.concat(text)});
    }

    removeText(textId) {
        let relatedTexts = this.state.relatedTexts;
        relatedTexts.splice(textId, 1);
        this.setState({relatedTexts: relatedTexts});
    }

    render() {
        let texts = [];

        this.state.relatedTexts.map((text, index) => {
            texts.push(<ListGroupItem bsStyle="info" key={index}>
                {text.title}
                <Button className="pull-right" onClick={() => this.removeText(index)} bsSize="xsmall"
                        bsStyle="danger"><Glyphicon glyph="remove"/></Button>
            </ListGroupItem>);
        });

        let foundTexts = [];

        this.state.foundTexts.map((text, index) => {
            foundTexts.push(<ListGroupItem onClick={() => this.addText(index)} key={index}>
                {text.title}
            </ListGroupItem>);
        });

        return <Panel>
            <Jumbotron>
                <FormGroup>
                    <ControlLabel>Заголовок</ControlLabel>
                    <FormControl
                        inputRef={title => {
                            this.title = title
                        }}
                    />
                </FormGroup>


                <h3>Добавленные тексты</h3>
                <ListGroup>
                    {texts}
                </ListGroup>

                <Panel>
                    <FormGroup>
                        <ControlLabel>Поиск текста</ControlLabel>
                        <FormControl
                            type="text"
                            inputRef={textTitle => {
                                this.textTitle = textTitle
                            }}
                            placeholder="Начните вводить данные для выбора"
                            onChange={this.searchText.bind(this)}
                        />
                    </FormGroup>

                    <ListGroup>
                        {foundTexts}
                    </ListGroup>
                </Panel>

            </Jumbotron>
            <Button onClick={this.saveLesson.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
        </Panel>
    }
}

export default Lesson;