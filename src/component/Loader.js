import React from "react";
import Spinner from "react-loader-spinner";
import "./Loader.less"

class Loader extends React.Component {

    render() {
        return <div className="loader">
            <Spinner type="Bars" color="#b1b1b1"/>
        </div>;
    }
}

export default Loader;
