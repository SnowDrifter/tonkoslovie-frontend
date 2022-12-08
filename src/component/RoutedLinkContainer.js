import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import {Nav} from "react-bootstrap";

function RoutedLinkContainer({to, className, text}) {
    return (
        <LinkContainer to={to}>
            <Nav.Link className={className}>{text}</Nav.Link>
        </LinkContainer>
    );
}

export default RoutedLinkContainer;
