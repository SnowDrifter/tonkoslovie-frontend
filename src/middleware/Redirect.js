import {createBrowserHistory} from "history"
import {ROUTING} from "../constant/Routing"

/* eslint-disable no-unused-vars */
export const Redirect = store => next => action => {
    const history = createBrowserHistory();

    if (action.type === ROUTING) {
        history[action.payload.method](action.payload.nextUrl)
    }

    return next(action)
};
/* eslint-enable no-unused-vars */
