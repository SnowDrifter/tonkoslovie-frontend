import {HIDE_LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT, SHOW_LOGIN} from "/constant/User"
import decode from "jwt-decode";

const initialState = ({
    user: localStorage.getItem("token") !== null ? decode(localStorage.getItem("token")) : {},
    isAuthenticated: localStorage.getItem("token") !== null,
    showLogin: false,
    errorMessage: null
});

export function authReducer(state = initialState, action) {

    switch (action.type) {
        case SHOW_LOGIN:
            return {...state, showLogin: true};

        case HIDE_LOGIN:
            return {...state, showLogin: false, errorMessage: null};

        case LOGIN_SUCCESS:
            return {...state, showLogin: false, isAuthenticated: true};

        case LOGIN_FAILURE:
            return {...state, errorMessage: action.payload.errorMessage};

        case LOGOUT:
            return {...state, isAuthenticated: false};

        default:
            return state
    }
}