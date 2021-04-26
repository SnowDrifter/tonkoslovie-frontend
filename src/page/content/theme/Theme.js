import React from "react";
import {Card, Jumbotron} from "react-bootstrap";
import Client from "/util/Client";
import Helmet from "react-helmet";
import Loader from "/component/Loader";
import ExerciseComponent from "./ExerciseComponent";
import SimpleConfirmModal from "/component/SimpleConfirmModal";

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
            showSuccessModal: false,
            loaded: false,
            failed: false
        };

        if (props.match.params.themeId) {
            this.loadTheme(props.match.params.themeId)
        }

        this.nextExercise = this.nextExercise.bind(this);
        this.addSolvedExercise = this.addSolvedExercise.bind(this);
        this.hideSuccessModal = this.hideSuccessModal.bind(this);
        this.removeProgress = this.removeProgress.bind(this);
        this.backToThemesPage = this.backToThemesPage.bind(this);
    }

    loadTheme(themeId) {
        Client.get("/api/content/theme", {
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

    removeProgress() {
        const exercises = this.state.exercises;
        this.shuffleExercises(exercises);
        exercises.forEach(exercise => {
            exercise.solved = undefined;
            exercise.correctUserAnswer = null;
        });

        this.setState({
            exercises: exercises,
            currentExercise: exercises[0],
            currentExerciseNumber: 0,
            solvedExerciseCount: 0,
            showSuccessModal: false
        })
    }

    shuffleExercises(exercises) {
        for (let i = exercises.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [exercises[i], exercises[j]] = [exercises[j], exercises[i]];
        }
    }

    addSolvedExercise(correctUserAnswer) {
        let exercises = this.state.exercises;
        const solvedExercise = exercises[this.state.currentExerciseNumber];

        if (!solvedExercise.solved) {
            solvedExercise.solved = true;
            solvedExercise.correctUserAnswer = correctUserAnswer;

            exercises[this.state.currentExerciseNumber] = solvedExercise;

            const newSolvedExerciseCount = this.state.solvedExerciseCount + 1;

            this.setState({
                exercises: exercises,
                solvedExerciseCount: newSolvedExerciseCount,
                showSuccessModal: newSolvedExerciseCount === this.state.exercises.length
            });
        }
    }

    backToThemesPage() {
        this.props.history.push("/themes");
    }

    hideSuccessModal() {
        this.setState({showSuccessModal: false});
    }

    nextExercise() {
        if (this.state.solvedExerciseCount < this.state.exercises.length) {
            let newExerciseNumber = this.state.currentExerciseNumber + 1;
            let newExercise = this.state.exercises[newExerciseNumber];

            this.setState({
                currentExercise: newExercise,
                currentExerciseNumber: newExerciseNumber
            })
        } else {
            this.setState({showSuccessModal: true})
        }
    }

    render() {
        const body = <Card key={this.state.currentExerciseNumber}>
            <Card.Header style={{textAlign: "center"}}><h2>{this.state.title}</h2></Card.Header>

            <Card.Body>
                <span className="float-right">
                    {`Выполнено ${this.state.solvedExerciseCount}/${this.state.exercises.length}`}
                </span>
                <Helmet title={`${this.state.title} | Тонкословие`}/>
                <ExerciseComponent nextExercise={this.nextExercise}
                                   exercise={this.state.currentExercise}
                                   addSolvedExercise={this.addSolvedExercise}/>

                <SimpleConfirmModal showModal={this.state.showSuccessModal}
                                    hideModal={this.hideSuccessModal}
                                    confirmFunction={this.removeProgress}
                                    negativeFunction={this.backToThemesPage}
                                    modalTitle="Новые упражнения закончились, начать заново?"/>
            </Card.Body>
        </Card>;

        if (this.state.loaded) {
            return body;
        } else if (this.state.failed) {
            return <Jumbotron><h2 style={{color: "red", textAlign: "center"}}>Тема не найдена</h2></Jumbotron>;
        } else {
            return <Loader/>;
        }
    }
}

export default Theme;
