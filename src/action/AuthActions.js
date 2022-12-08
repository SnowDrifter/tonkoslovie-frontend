import Client from "/util/Client";
import {SHOW_LOGIN, HIDE_LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT} from "/constant/User";
import {ROUTING} from "/constant/Routing";

export function showLogin() {
    return {type: SHOW_LOGIN}
}

export function hideLogin() {
    return {type: HIDE_LOGIN}
}

export function login(payload) {
    return (dispatch) => {
        Client.post("/api/user/login", {
            email: payload.email,
            password: payload.password
        })
            .then(response => {
                localStorage.setItem("token", response.data.token);

                dispatch({type: LOGIN_SUCCESS});

                dispatch({
                    type: ROUTING,
                    payload: {
                        nextUrl: "/"
                    }
                });
            })
            .catch(() => {
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

        dispatch({type: LOGIN_SUCCESS});
    }
}

export function logout() {
    return (dispatch) => {
        document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        localStorage.removeItem("token");

        dispatch({type: LOGOUT});

        dispatch({
            type: ROUTING,
            payload: {
                nextUrl: "/"
            }
        });
    }
}
