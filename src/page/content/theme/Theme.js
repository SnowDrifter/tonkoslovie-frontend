import React from "react";
import {Card} from "react-bootstrap";
import Client from "/util/Client";
import Helmet from "react-helmet";
import ErrorPanel from "/component/ErrorPanel";
import Loader from "/component/Loader";
import ExerciseComponent from "./ExerciseComponent";
import SimpleConfirmModal from "/component/SimpleConfirmModal";
import shuffle from "lodash/shuffle";

class Theme extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            title: null,
            exercises: [],
            currentExerciseNumber: 0,
            solvedExerciseCount: 0,
            soundFileName: null,
            showSuccessModal: false,
            loading: true,
            failed: false
        };

        if (props.match.params.themeId) {
            this.loadTheme(props.match.params.themeId)
        }

        this.nextExercise = this.nextExercise.bind(this);
        this.markExerciseAsSolved = this.markExerciseAsSolved.bind(this);
        this.hideSuccessModal = this.hideSuccessModal.bind(this);
        this.removeProgress = this.removeProgress.bind(this);
        this.backToThemesPage = this.backToThemesPage.bind(this);
    }

    loadTheme(themeId) {
        Client.get("/api/content/theme", {
            params: {
                id: themeId,
                shuffleExercises: true
            }
        }).then(response => {
            const theme = response.data;

            this.setState({
                id: theme.id,
                title: theme.title,
                exercises: theme.exercises,
                loading: false
            });
        }).catch(() => {
            this.setState({
                failed: true,
                loading: false
            });
        })
    }

    removeProgress() {
        const exercises = shuffle(this.state.exercises);
        exercises.forEach(exercise => exercise.solved = undefined);

        this.setState({
            exercises: exercises,
            currentExerciseNumber: 0,
            solvedExerciseCount: 0,
            showSuccessModal: false
        })
    }

    markExerciseAsSolved() {
        const exercises = this.state.exercises;
        exercises[this.state.currentExerciseNumber].solved = true;

        const newSolvedExerciseCount = this.state.solvedExerciseCount + 1;

        this.setState({
            exercises: exercises,
            solvedExerciseCount: newSolvedExerciseCount,
            showSuccessModal: newSolvedExerciseCount === this.state.exercises.length
        });
    }

    backToThemesPage() {
        this.props.history.push("/themes");
    }

    hideSuccessModal() {
        this.setState({showSuccessModal: false});
    }

    nextExercise() {
        if (this.state.solvedExerciseCount < this.state.exercises.length) {
            this.setState({
                currentExerciseNumber: this.state.currentExerciseNumber + 1
            })
        } else {
            this.setState({showSuccessModal: true})
        }
    }

    render() {
        if (this.state.loading) {
            return <Loader/>;
        } else if (this.state.failed) {
            return <ErrorPanel text="Тема не найдена"/>;
        }

        const currentExercise = this.state.exercises[this.state.currentExerciseNumber];

        return <Card key={this.state.currentExerciseNumber}>
            <Helmet title={`${this.state.title} | Тонкословие`}/>

            <Card.Header style={{textAlign: "center"}}><h2>{this.state.title}</h2></Card.Header>

            <Card.Body>
                <span className="float-right">
                    {`Выполнено ${this.state.solvedExerciseCount}/${this.state.exercises.length}`}
                </span>
                <ExerciseComponent nextExercise={this.nextExercise}
                                   exercise={currentExercise}
                                   markExerciseAsSolved={this.markExerciseAsSolved}/>

                <SimpleConfirmModal modalTitle="Тема завершена!"
                                    modalText="Начать заново?"
                                    showModal={this.state.showSuccessModal}
                                    hideModal={this.hideSuccessModal}
                                    confirmFunction={this.removeProgress}
                                    negativeFunction={this.backToThemesPage}/>
            </Card.Body>
        </Card>;
    }
}

export default Theme;
