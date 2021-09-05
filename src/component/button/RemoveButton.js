import React from "react";
import {Button} from "react-bootstrap";
import {BsX} from "react-icons/bs";

class RemoveButton extends React.Component {
    render() {
        return <Button variant="danger"
                       className={this.props.className}
                       style={{padding: "0.1rem 0.2rem", marginLeft: "10px", ...this.props.style}}
                       onClick={this.props.action}>
            <BsX size={24}/>
        </Button>;
    }
}

export default RemoveButton;
