import React from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

const RouterWrapper = (props) => {
    const params = useParams();
    const locations = useLocation();
    const navigate = useNavigate();
    const Element = props.element;

    return <Element params={params} locations={locations} navigate={navigate} {...props} />;
};

export default RouterWrapper;