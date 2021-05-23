import {HIDE_LOGIN, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, SHOW_LOGIN} from "/constant/User"
import decode from "jwt-decode";

const initialState = ({
    user: localStorage.getItem("token")  !== null ? decode(localStorage.getItem("token")) : {},
    isAuthenticated: localStorage.getItem("token") !== null,
    showLogin: false,
    errorMessage: null
});

export default function userstate(state = initialState, action) {

    switch (action.type) {
        case SHOW_LOGIN:
            return {...state, showLogin: action.payload.showLogin};

        case HIDE_LOGIN:
            return {...state, showLogin: action.payload.showLogin, errorMessage: null};

        case LOGIN_REQUEST:
            return state;

        case LOGIN_SUCCESS:
            return {...state, showLogin: action.payload.showLogin, isAuthenticated: action.payload.isAuthenticated};

        case LOGIN_FAILURE:
            return {...state, errorMessage: action.payload.errorMessage};

        case LOGOUT:
            return {...state, isAuthenticated: action.payload.isAuthenticated};

        default:
            return state
    }
}