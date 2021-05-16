import React from "react";
import {Jumbotron} from "react-bootstrap";


class ErrorPanel extends React.Component {
    render() {
        return <Jumbotron>
            <h2 style={{color: "red", textAlign: "center"}}>{this.props.text}</h2>
        </Jumbotron>;
    }
}

export default ErrorPanel;