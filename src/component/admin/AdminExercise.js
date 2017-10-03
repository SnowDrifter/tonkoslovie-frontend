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
import client from "../../util/client";


class AdminExercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            type: null,
            original: null,
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
            this.setState({
                id: exercise.id,
            });

            ReactDOM.findDOMNode(this.original).value = exercise.original;
        })
    }

    saveExercise() {
        client.post('/api/content/exercise', {
            id: this.state.id,
            original: ReactDOM.findDOMNode(this.original).value,
        }).then((response) => {
            this.setState({
                id: response.data.id,
            });

            alert("Сохранено");
        })
    }

    render() {
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

                </Jumbotron>
                <Button onClick={this.saveExercise.bind(this)} className="pull-right" bsStyle="success">Сохранить</Button>
            </Panel>
        );
    }
}

export default AdminExercise;