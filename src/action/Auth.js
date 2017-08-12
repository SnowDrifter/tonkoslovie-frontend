import client from "../util/client";
import {browserHistory} from 'react-router'
import axios from 'axios';

import {
    SHOW_LOGIN,
    HIDE_LOGIN,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT
} from '../constant/User'

import {
    ROUTING
} from '../constant/Routing'

export function showLogin(payload) {
    return (dispatch) => {
        dispatch({
            type: SHOW_LOGIN,
            payload: {
                showLogin: true
            }
        });
    }
}

export function hideLogin(payload) {
    return (dispatch) => {
        dispatch({
            type: HIDE_LOGIN,
            payload: {
                showLogin: false
            }
        });
    }
}

export function login(payload) {
    return (dispatch) => {
        dispatch({
            type: LOGIN_REQUEST
        });

        client.post('/api/user/login', {
            username: payload.username,
            password: payload.password
        })
            .then(function (response) {
                localStorage.setItem('token', response.data.token);
                axios.defaults.headers.common['Authorization'] = response.data.token;

                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        isAuthenticated: true,
                        showLogin: false
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
                dispatch({
                    type: LOGIN_FAILURE,
                    payload: {
                        errorMessage: "Неправильный логин или пароль"
                    }
                });
            });
    }
}

export function logout() {
    return (dispatch) => {
        dispatch({
            type: LOGOUT,
            payload: {
                isAuthenticated: false
            }
        });

        client.get('/api/user/logout');

        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];

        dispatch({
            type: ROUTING,
            payload: {
                method: 'replace',
                nextUrl: '/'
            }
        });
    }
}
