import React from "react";
import {Card} from "react-bootstrap";


function ErrorPanel({text}) {
    return <Card className="jumbotron">
        <h2 style={{color: "red", textAlign: "center"}}>{text}</h2>
    </Card>;
}

export default ErrorPanel;