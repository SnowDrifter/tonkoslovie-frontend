import Client from "../util/Client";
import {SHOW_LOGIN, HIDE_LOGIN, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT} from "../constant/User";
import {ROUTING} from "../constant/Routing";

export function showLogin() {
    return (dispatch) => {
        dispatch({
            type: SHOW_LOGIN,
            payload: {
                showLogin: true
            }
        });
    }
}

export function hideLogin() {
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

        Client.post("/api/user/login", {
            email: payload.email,
            password: payload.password
        })
            .then(function (response) {
                localStorage.setItem("token", response.data.token);

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
                        method: "replace",
                        nextUrl: "/"
                    }
                });
            })
            .catch(function () {
                dispatch({
                    type: LOGIN_FAILURE,
                    payload: {
                        errorMessage: "Неправильный логин или пароль"
                    }
                });
            });
    }
}

export function saveToken(token) {
    return (dispatch) => {
        localStorage.setItem("token", token);

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
                method: "replace",
                nextUrl: "/"
            }
        });
    }
}

export function logout() {
    document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("token");

    return (dispatch) => {
        dispatch({
            type: LOGOUT,
            payload: {
                isAuthenticated: false
            }
        });

        dispatch({
            type: ROUTING,
            payload: {
                method: "replace",
                nextUrl: "/"
            }
        });
    }
}
