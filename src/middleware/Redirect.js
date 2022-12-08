import history from "/util/History";
import {ROUTING} from "/constant/Routing"

/* eslint-disable-next-line no-unused-vars */
export const Redirect = store => next => action => {
    if (action.type === ROUTING) {
        const {method = "replace", nextUrl} = action.payload
        history[method]({pathname: nextUrl})
        history.go(0)
    }

    return next(action)
};
