import history from "../util/History"
import {ROUTING} from "../constant/Routing"

/* eslint-disable no-unused-vars */
export const Redirect = store => next => action => {
    if (action.type === ROUTING) {
        history[action.payload.method]({
            pathname: action.payload.nextUrl,
            search: action.payload.search
        })
    }

    return next(action)
};
/* eslint-enable no-unused-vars */
