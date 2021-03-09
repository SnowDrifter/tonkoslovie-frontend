import {
    SHOW_LOGIN,
    HIDE_LOGIN,
    LOGIN_REQUEST,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT
} from "../constant/User"
import decode from "jwt-decode";

const initialState = ({
    user: localStorage.getItem("token") !== undefined ? decode(localStorage.getItem("token")) : {},
    isAuthenticated: localStorage.getItem("token") !== undefined,
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