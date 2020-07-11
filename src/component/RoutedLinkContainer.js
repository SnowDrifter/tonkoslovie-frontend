import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import {Nav} from "react-bootstrap";

class RoutedLinkContainer extends React.Component {
    render() {
        return (
            <LinkContainer to={this.props.to ? this.props.to : ""}>
                <Nav.Link className={this.props.className}>{this.props.text}</Nav.Link>
            </LinkContainer>
        );
    }
}

export default RoutedLinkContainer;
