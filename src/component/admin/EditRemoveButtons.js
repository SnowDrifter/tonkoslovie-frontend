import React from "react";
import {Button, ButtonGroup} from "react-bootstrap";
import {BsPencil, BsX} from "react-icons/bs";

class EditRemoveButtons extends React.Component {
    render() {
        return <>
            <ButtonGroup className="button-block">
                <Button size="xsmall"
                        style={{padding: "0.3rem 0.4rem"}}
                        onClick={this.props.edit}>
                    <BsPencil size={18}/>
                </Button>
                <Button size="xsmall"
                        variant="danger"
                        style={{padding: "0.1rem 0.2rem"}}
                        onClick={this.props.remove}>
                    <BsX size={24}/>
                </Button>
            </ButtonGroup>
        </>;
    }
}

export default EditRemoveButtons;
