import React from "react";
import {Jumbotron} from "react-bootstrap";

const Err500 = () => {
    return <Jumbotron>
        <h3 style={{color: "red", textAlign: "center"}}>На сервере проводятся технические работы</h3>
        <h4 style={{color: "red", textAlign: "center"}}>Приносим извинения за неудобства</h4>
    </Jumbotron>
};

export default Err500;