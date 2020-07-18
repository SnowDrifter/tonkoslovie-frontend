import React from "react";
import {Button} from "react-bootstrap";
import {BsPencil} from "react-icons/bs";

class EditButton extends React.Component {
    render() {
        return  <>
            <Button style={{padding: "0.3rem 0.4rem"}}
                    onClick={this.props.action}>
                <BsPencil size={18}/>
            </Button>
        </>;
    }
}

export default EditButton;
