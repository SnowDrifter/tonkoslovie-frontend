import React from "react";
import {Jumbotron} from "react-bootstrap";
import "./Error.less"

const Err500 = () => {
    return <Jumbotron>
        <h3 className="error-message">На сервере проводятся технические работы</h3>
        <h4 className="error-message">Приносим извинения за неудобства</h4>
    </Jumbotron>
};

export default Err500;