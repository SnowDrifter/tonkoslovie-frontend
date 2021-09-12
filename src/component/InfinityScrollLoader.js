import React from "react";
import Spinner from "react-loader-spinner";

class InfinityScrollLoader extends React.Component {

    render() {
        return <div style={{textAlign: "center", paddingTop: "10px"}}>
            <Spinner type="ThreeDots" color="#b1b1b1" height={10}/>
        </div>;
    }
}

export default InfinityScrollLoader;
