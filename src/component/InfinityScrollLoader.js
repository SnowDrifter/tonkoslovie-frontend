import React from "react";
import {ThreeDots} from "react-loader-spinner";

function InfinityScrollLoader() {
    return <div style={{textAlign: "center", paddingTop: "10px"}}>
        <ThreeDots color="#b1b1b1" height={10}/>
    </div>;
}

export default InfinityScrollLoader;
