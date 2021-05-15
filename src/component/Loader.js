import React from "react";
import Spinner from "react-loader-spinner";
import "./Loader.less"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class Loader extends React.Component {

    render() {
        return <div className="loader">
            <Spinner type="Bars" color="#b1b1b1"/>
        </div>;
    }
}

export default Loader;
