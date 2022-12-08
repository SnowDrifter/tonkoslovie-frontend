import React from "react";
import {Button, ButtonGroup} from "react-bootstrap";
import {BsPencil, BsX} from "react-icons/bs";


function EditRemoveButtons({edit, remove}) {
    return <ButtonGroup className="button-block">
        <Button size="sm" style={{padding: "0.2rem 0.4rem"}} onClick={edit}>
            <BsPencil size={18}/>
        </Button>
        <Button size="sm" variant="danger" style={{padding: "0.1rem 0.2rem"}} onClick={remove}>
            <BsX size={26}/>
        </Button>
    </ButtonGroup>;
}

export default EditRemoveButtons;
