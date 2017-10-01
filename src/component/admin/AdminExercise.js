import React from "react";
import ReactDOM from "react-dom";
import client from "../../util/client";


class AdminExercise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
        };

        if (this.props.params.exerciseId) {
            this.loadExercise(this.props.params.exerciseId)
        }
    }

    loadExercise(exerciseId) {

    }

    render() {
        return (<div/>
        );
    }
}

export default AdminExercise;