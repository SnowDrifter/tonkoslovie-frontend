import {
    LOGIN_REQUEST,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT
} from '../constant/User'
import decode from 'jwt-decode';

// TODO
const initialState = ({
    user: localStorage.getItem('token') != undefined ? decode(localStorage.getItem('token')) : {},
    isAuthenticated: localStorage.getItem('token') != undefined
});

export default function userstate(state = initialState, action) {

    switch (action.type) {
        case LOGIN_REQUEST:
            return state;

        case LOGIN_SUCCESS:
            return {...state, isAuthenticated: action.payload.isAuthenticated}

        case LOGIN_FAILURE:
            return state;

        case LOGOUT:
            return state;

        default:
            return state
    }
}