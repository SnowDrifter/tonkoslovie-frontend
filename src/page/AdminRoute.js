import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {connect} from "react-redux";

const AdminRoute = (props) => {
    const admin = isAdmin(props.user);
    return admin ? <Outlet /> : <Navigate to="/access_denied" />;
}

function isAdmin(user) {
    const roles = user?.roles?.split(",") || [];
    return roles.includes("ROLE_ADMIN");
}

function mapStateToProps(state) {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(AdminRoute)