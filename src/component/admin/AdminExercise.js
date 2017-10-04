import React from "react";
import ReactDOM from "react-dom";
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
    Glyphicon
} from "react-bootstrap";
import style from './AdminExercise.less'
import client from "../../util/client";


class AdminExercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            type: null,
            original: null,
            answersCount: 1,
            answers: []
        };

        if (this.props.params.exerciseId) {
            this.loadExercise(this.props.params.exerciseId)
        }
    }

    loadExercise(exerciseId) {
        client.get('/api/content/exercise', {
            params: {
                id: exerciseId
            }
        }).then(response => {
            const exercise = response.data;

            const answersCount = exercise.answers ? exercise.answers.length : 1;

            this.setState({
                id: exercise.id,
                answersCount: answersCount,
                answers:  exercise.answers || []
            });

            ReactDOM.findDOMNode(this.original).value = exercise.original;
        })
    }

    saveExercise() {
        const answers = [];

        for (let i = 0; i < this.state.answersCount; i++) {
            answers.push(ReactDOM.findDOMNode(this['answer-' + i]).value);
        }

        client.post('/api/content/exercise', {
            id: this.state.id,
            original: ReactDOM.findDOMNode(this.original).value,
            answers: answers
        }).then((response) => {
            this.setState({
                id: response.data.id,
            });

            alert("Сохранено");
        })
    }

    increaseAnswersCount() {
        let answersCount = this.state.answersCount;
        answersCount++;
        this.setState({answersCount: answersCount})
    }

    decreaseAnswersCount() {
        if (this.state.answersCount > 1) {
            let answersCount = this.state.answersCount;
            answersCount--;
            this.setState({answersCount: answersCount});
        }
    }

    render() {
        const answerForms = [];
        const answersCount = this.state.answersCount;

        for (let i = 0; i < answersCount; i++) {
                answerForms.push(<FormControl className="admin-exercise-answer-form" key={i} ref={part => {
                        this['answer-' + i] = part
                    }}  defaultValue={this.state.answers[i] || ""}/>
                );
        }

        return (<Panel>
                <Jumbotron>
                    <h3>Оригинал</h3>
                    <FormGroup>
                        <FormControl
                            inputRef={original => {
                                this.original = original
                            }}
                        />
                    </FormGroup>

                    <div className="admin-exercise-answer-panel">
                        <FormGroup>
                            <ControlLabel><h4>Ответы</h4></ControlLabel>
                            {answerForms}
                        </FormGroup>
                        <Button onClick={this.increaseAnswersCount.bind(this)}>Добавить ответ</Button>
                        <Button onClick={this.decreaseAnswersCount.bind(this)}>Удалить ответ</Button>
                    </div>
                </Jumbotron>
                <Button onClick={this.saveExercise.bind(this)} className="pull-right"
                        bsStyle="success">Сохранить</Button>
            </Panel>
        );
    }
}

export default AdminExercise;