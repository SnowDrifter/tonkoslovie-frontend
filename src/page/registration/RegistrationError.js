import React from "react";
import {Card} from "react-bootstrap";

function RegistrationError() {
    return <Card className="jumbotron"><h2 className="error-message">Регистрация не удалась</h2></Card>
}

export default RegistrationError;