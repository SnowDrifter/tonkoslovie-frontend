import React from "react";
import {Button} from "react-bootstrap";
import {BsX} from "react-icons/bs";

class RemoveButton extends React.Component {
    render() {
        return  <>
            <Button size="xsmall"
                    variant="danger"
                    style={{padding: "0.1rem 0.2rem"}}
                    onClick={this.props.remove}>
                <BsX size={24}/>
            </Button>
        </>;
    }
}

export default RemoveButton;
