import React from "react";
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
import style from './Text.less'
import Helmet from "react-helmet";
import Loader from "../Loader";
import ExerciseComponent from "./ExerciseComponent";

class Theme extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            title: null,
            exercises: [],
            currentExercise: {},
            currentExerciseNumber: 0,
            solvedExerciseCount: 0,
            soundFileName: null,
            loaded: false,
            failed: false
        };

        if (this.props.params.themeId) {
            this.loadTheme(this.props.params.themeId)
        }

        this.nextExercise = this.nextExercise.bind(this);
        this.addSolvedExercise = this.addSolvedExercise.bind(this);
    }

    loadTheme(themeId) {
        client.get('/api/content/theme', {
            params: {
                id: themeId,
                randomExercises: true
            }
        }).then(response => {
            const theme = response.data;

            this.setState({
                id: theme.id,
                title: theme.title,
                exercises: theme.exercises,
                currentExercise: theme.exercises[0],
                loaded: true
            });
        }).catch(() => {
            this.setState({
                failed: true
            });
        })
    }

    addSolvedExercise(correctUserAnswer) {
        let exercises = this.state.exercises;
        const solvedExercise = exercises[this.state.currentExerciseNumber];

        if (!solvedExercise.solved) {
            solvedExercise.solved = true;
            solvedExercise.correctUserAnswer = correctUserAnswer;

            exercises[this.state.currentExerciseNumber] = solvedExercise;

            this.setState({
                exercises: exercises,
                solvedExerciseCount: ++this.state.solvedExerciseCount
            })
        }
    }

    nextExercise() {
        if (this.state.solvedExerciseCount < this.state.exercises.length) {
            let newExercise;
            let newExerciseNumber;

            for (let i = ++this.state.currentExerciseNumber; i < this.state.exercises.length; i++) {
                let nextExercise = this.state.exercises[i];

                if (!nextExercise.solved) {
                    newExercise = nextExercise;
                    newExerciseNumber = i;
                    break;
                }
            }

            // Start new cycle
            if (!newExercise) {
                this.state.exercises.every((exercise, index) => {
                    if (!exercise.solved) {
                        newExercise = exercise;
                        newExerciseNumber = index;
                        return false;
                    } else {
                        return true;
                    }
                })
            }

            this.setState({
                currentExercise: newExercise,
                currentExerciseNumber: newExerciseNumber
            })
        } else {
            // TODO: add custom modal
            alert("Упражнения закончились")
        }
    }

    render() {
        let title = this.state.title + " | Тонкословие";

        let content = <Panel>
            {this.state.solvedExerciseCount + "/" + this.state.exercises.length}
            <Helmet title={title}/>
            <PageHeader style={{textAlign: "center"}}>{this.state.title}</PageHeader>
            <ExerciseComponent nextExercise={this.nextExercise}
                               exercise={this.state.currentExercise}
                               addSolvedExercise={this.addSolvedExercise}
            />
        </Panel>;

        if (this.state.loaded) {
            return content;
        } else if (this.state.failed) {
            return <Jumbotron><h2 style={{color: "red", textAlign: "center"}}>Тема не найдена</h2></Jumbotron>;
        } else {
            return <Loader/>;
        }
    }
}

export default Theme;
