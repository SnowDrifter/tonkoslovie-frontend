import React from "react";
import "./Error.less"

const Err500 = () => {
    return <div className="jumbotron">
        <h3 className="error-message">На сервере проводятся технические работы</h3>
        <h4 className="error-message">Приносим извинения за неудобства</h4>
    </div>
};

export default Err500;