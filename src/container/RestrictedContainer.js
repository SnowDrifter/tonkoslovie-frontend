import React from 'react';
import RouteHandler from './RouterHandler';
import {AuthorizedComponent} from 'react-router-role-authorization';
import {connect} from 'react-redux'

class RestrictedContainer extends AuthorizedComponent {
    constructor(props) {
        super(props);
        this.userRoles = props.user.user.roles ? props.user.user.roles.split(", ") : null;
        this.notAuthorizedPath = '/accessDenied';
    }

    render() {
        return (
            <div>
                <RouteHandler {...this.props} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(RestrictedContainer)