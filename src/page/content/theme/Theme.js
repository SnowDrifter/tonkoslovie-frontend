import React from "react";
import {Card} from "react-bootstrap";
import Client from "/util/Client";
import Helmet from "react-helmet";
import ErrorPanel from "/component/ErrorPanel";
import Loader from "/component/Loader";
import ExerciseComponent from "./ExerciseComponent";
import SimpleConfirmModal from "/component/SimpleConfirmModal";
import shuffle from "lodash/shuffle";
import "./Theme.less"

class Theme extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            theme: {},
            currentExerciseNumber: 0,
            solvedExerciseCount: 0,
            showSuccessModal: false,
            loading: true,
            failed: false
        };

        this.loadTheme(props.params.themeId)
    }

    loadTheme(themeId) {
        Client.get("/api/content/theme", {
            params: {
                id: themeId,
                shuffleExercises: true
            }
        })
            .then(response => {
                this.setState({
                    theme: response.data,
                    loading: false
                });
            })
            .catch(() => {
                this.setState({
                    failed: true,
                    loading: false
                });
            })
    }

    removeProgress = () => {
        const exercises = shuffle(this.state.theme.exercises);
        exercises.forEach(exercise => exercise.solved = undefined);

        this.setState({
            exercises: exercises,
            currentExerciseNumber: 0,
            solvedExerciseCount: 0,
            showSuccessModal: false
        })
    }

    markExerciseAsSolved = () => {
        const {theme, currentExerciseNumber, solvedExerciseCount} = this.state;
        theme.exercises[currentExerciseNumber].solved = true;

        const newSolvedExerciseCount = solvedExerciseCount + 1;

        this.setState({
            theme: theme,
            solvedExerciseCount: newSolvedExerciseCount,
            showSuccessModal: newSolvedExerciseCount === theme.exercises.length
        });
    }

    backToThemesPage = () => this.props.navigate("/themes");

    hideSuccessModal = () => this.setState({showSuccessModal: false});

    nextExercise = () => {
        if (this.state.solvedExerciseCount < this.state.theme.exercises.length) {
            this.setState({currentExerciseNumber: this.state.currentExerciseNumber + 1})
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

        const {theme, currentExerciseNumber, solvedExerciseCount, showSuccessModal} = this.state;
        const currentExercise = theme.exercises[currentExerciseNumber];

        return <Card key={currentExerciseNumber}>
            <Helmet title={`${theme.title} | Тонкословие`}/>

            <Card.Header style={{textAlign: "center"}}><h2>{theme.title}</h2></Card.Header>

            <Card.Body>
                <span className="float-end">
                    {`Выполнено ${solvedExerciseCount}/${theme.exercises.length}`}
                </span>

                <ExerciseComponent nextExercise={this.nextExercise}
                                   exercise={currentExercise}
                                   markExerciseAsSolved={this.markExerciseAsSolved}/>

                <SimpleConfirmModal title="Тема завершена!"
                                    text="Начать заново?"
                                    showModal={showSuccessModal}
                                    onHide={this.hideSuccessModal}
                                    onConfirm={this.removeProgress}
                                    onNegative={this.backToThemesPage}/>
            </Card.Body>
        </Card>;
    }
}

export default Theme;
