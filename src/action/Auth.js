import axios from "axios";
import { browserHistory } from 'react-router'

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT
} from '../constant/User'

import {
    ROUTING
} from '../constant/Routing'

export function login(payload) {
    return (dispatch) => {
        dispatch({
            type: LOGIN_REQUEST
        });

        axios.post('http://localhost:8080/login', {
            username: payload.username,
            password: payload.password
        })
            .then(function (response) {
                localStorage.setItem('token', response.data.token);

                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        isAuthenticated: true
                    }
                });

                dispatch({
                    type: ROUTING,
                    payload: {
                        method: 'replace',
                        nextUrl: '/'
                    }
                });
            })
            .catch(function (error) {
                alert(error.response.data.errorMessage);
            });
    }
}

export function logout() {
    return {
        type: LOGOUT
    }
}
