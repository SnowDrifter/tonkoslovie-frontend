import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

class AdminRoute extends React.Component {

    constructor(props) {
        super(props);

        const {user} = this.props;

        if (!this.isAdmin(user)) {
            this.props.history.push("/access_denied");
        }
    }

    isAdmin(user) {
        if (!user || !user.roles) {
            return false;
        }

        const roles = user.roles.split(",");
        return roles.includes("ROLE_ADMIN");
    }

    render() {
        const Component = this.props.component;
        return <Component {...this.props} />
    }
}

function mapStateToProps(state) {
    return {
        user: state.AuthReducer.user
    }
}

export default withRouter(connect(mapStateToProps)(AdminRoute))