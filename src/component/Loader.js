import React from 'react';
import {ScaleLoader} from 'halogenium';
import style from './Loader.less'

class Loader extends React.Component {

    render() {
        return <div className="loader">
            <ScaleLoader color="#b1b1b1"/>
        </div>;
    }
}

export default Loader;
