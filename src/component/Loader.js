import React from "react";
import {Bars} from "react-loader-spinner";
import "./Loader.less"

function Loader() {
    return <div className="loader">
        <Bars color="#b1b1b1"/>
    </div>;
}

export default Loader;
