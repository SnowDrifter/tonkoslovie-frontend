import { browserHistory } from "react-router"
import {
  ROUTING
} from "../constant/Routing"

/* eslint-disable no-unused-vars */
export const redirect = store => next => action => {
  if (action.type === ROUTING) {
    browserHistory[action.payload.method](action.payload.nextUrl)
  }

  return next(action)
};
/* eslint-enable no-unused-vars */
