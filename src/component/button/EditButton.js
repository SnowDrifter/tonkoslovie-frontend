import React from "react";
import {Button} from "react-bootstrap";
import {BsPencil} from "react-icons/bs";

function EditButton({action}) {
    return <Button size="sm" style={{padding: "0.2rem 0.4rem"}} onClick={action}>
        <BsPencil size={16}/>
    </Button>;
}

export default EditButton;
