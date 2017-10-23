import React from "react";
import ReactDOM from "react-dom";
import {
    Panel,
    FormGroup,
    Row,
    Col,
    ControlLabel,
    FormControl,
    Button,
    ButtonToolbar,
    ButtonGroup,
    FieldGroup,
    ProgressBar,
    Modal,
    Form,
    Jumbotron,
    Glyphicon,
    ListGroup,
    ListGroupItem,
    Checkbox
} from "react-bootstrap";
import client from "../../util/client";

class AdminTheme extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            published: false,
            exercises: [],
            foundExercises: []
        };

        if (this.props.params.themeId) {
            this.loadTheme(this.props.params.themeId)
        }

        this.removeExercise = this.removeExercise.bind(this);
        this.addExercise = this.addExercise.bind(this);
        this.handExerciseChange = this.handExerciseChange.bind(this);
    }

    loadTheme(themeId) {
        client.get('/api/content/theme', {
            params: {
                id: themeId
            }
        }).then(response => {
            const theme = response.data;

            this.setState({
                id: theme.id,
                exercises: theme.exercises,
                published: theme.published
            });

            ReactDOM.findDOMNode(this.title).value = theme.title;
        })
    }

    saveTheme() {
        client.post('/api/content/theme', {
            id: this.state.id,
            title: ReactDOM.findDOMNode(this.title).value,
            published: this.state.published,
            exercises: this.state.exercises || []
        }).then((response) => {
            this.setState({
                id: response.data.id
            });

            alert("Сохранено");
        })
    }

    searchExercise() {
        let searchTitle = ReactDOM.findDOMNode(this.exerciseTitle).value;

        client.get('/api/content/exercises/findByTitle', {
            params: {
                title: searchTitle
            }
        }).then(response => {
            const exercises = response.data;
            this.setState({
                foundExercises: exercises
            });
        })
    }

    checkExerciseAlreadyAdded(exercise) {
        let alreadyAdded = false;
        this.state.exercises.forEach(function (oldExercise, index, array) {
            if (oldExercise.id == exercise.id) {
                alreadyAdded = true;
            }
        });

        return alreadyAdded;
    }

    addExercise(index) {
        let exercise = this.state.foundExercises[index];

        let foundExercises = this.state.foundExercises;
        foundExercises.splice(index, 1);
        this.setState({foundExercises: foundExercises});

        this.setState({exercises: this.state.exercises.concat(exercise)});
    }

    removeExercise(exerciseId) {
        let exercises = this.state.exercises;
        exercises.splice(exerciseId, 1);
        this.setState({exercises: exercises});
    }

    handExerciseChange(exercise) {
        this.setState({
            exercise: exercise
        });
    }

    togglePublished() {
        this.setState({published: !this.state.published});
    }

    render() {
        let exercises = [];

        this.state.exercises.map((exercise, index) => {
            exercises.push(<ListGroupItem bsStyle="info" key={index}>
                {exercise.title}
                <Button className="pull-right" onClick={() => this.removeExercise(index)} bsSize="xsmall"
                        bsStyle="danger"><Glyphicon glyph="remove"/></Button>
            </ListGroupItem>);
        });

        let foundExercises = [];

        if (this.state.foundExercises.length > 0) {
            this.state.foundExercises.map((exercise, index) => {
                if (!this.checkExerciseAlreadyAdded(exercise)) {
                    foundExercises.push(<ListGroupItem onClick={() => this.addExercise(index)} key={index}>
                        {exercise.title}
                    </ListGroupItem>);
                }
            });
        } else {
            foundExercises.push(<span key={0}>Ничего не найдено</span>);
        }

        return <Panel>
            <Jumbotron>
                <FormGroup>
                    <ControlLabel><h4>Заголовок</h4></ControlLabel>
                    <FormControl
                        inputRef={title => {
                            this.title = title
                        }}
                    />
                </FormGroup>

                <h3>Добавленные упражнения</h3>
                <ListGroup>
                    {exercises}
                </ListGroup>

                <Panel>
                    <FormGroup>
                        <ControlLabel>Поиск упражнения</ControlLabel>
                        <FormControl
                            type="text"
                            inputRef={exerciseTitle => {
                                this.exerciseTitle = exerciseTitle
                            }}
                            placeholder="Начните вводить данные для выбора"
                            onChange={this.searchExercise.bind(this)}
                        />
                    </FormGroup>

                    Варианты:
                    <ListGroup>
                        {foundExercises}
                    </ListGroup>
                </Panel>

                <Checkbox checked={this.state.published} onClick={this.togglePublished.bind(this)}>
                    Опубликовать тему
                </Checkbox>
            </Jumbotron>

            <Button onClick={this.saveTheme.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
        </Panel>
    }
}


export default AdminTheme;
