import React from "react";
import RingLoader from "halogen/RingLoader";
import style from './Loader.less'

class Loader extends React.Component {

    render() {
        return <RingLoader color="#b1b1b1" size="100px" className="loader"/>;
    }
}

export default Loader;
