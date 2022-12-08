import React from "react";
import {Button} from "react-bootstrap";
import {BsX} from "react-icons/bs";

function RemoveButton({className, style, action}) {
    return <Button variant="danger"
                   className={className}
                   style={{...style, padding: "0.1rem 0.2rem", marginLeft: "10px"}}
                   onClick={action}>
        <BsX size={26}/>
    </Button>;
}

export default RemoveButton;
