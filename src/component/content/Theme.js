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
import Loader from '../Loader';
import ExerciseComponent from './ExerciseComponent';

class Theme extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            title: null,
            exercises: [],
            currentExercise: {},
            currentExerciseNumber: 0,
            soundFileName: null,
            loaded: false,
            failed: false
        };

        if (this.props.params.themeId) {
            this.loadTheme(this.props.params.themeId)
        }

        this.nextExercise = this.nextExercise.bind(this);
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

    nextExercise() {
        let newExerciseNumber = this.state.currentExerciseNumber;
        newExerciseNumber++;

        if(newExerciseNumber < this.state.exercises.length) {
            const newExercise = this.state.exercises[newExerciseNumber];

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

        let currentExerciseNumber = this.state.currentExerciseNumber;
        currentExerciseNumber++;

        let content = <Panel>
            {currentExerciseNumber + "/" + this.state.exercises.length}
            <Helmet title={title}/>
            <PageHeader style={{textAlign: "center"}}>{this.state.title}</PageHeader>
            <ExerciseComponent nextExercise={this.nextExercise}
                               exercise={this.state.currentExercise}
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
