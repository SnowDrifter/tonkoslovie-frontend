import {createStore, applyMiddleware, compose} from "redux"
import thunkMiddleware from "redux-thunk"
import {logger} from "redux-logger"
import {rootReducer} from "/reducer/RootReducer"
import {Redirect} from "/middleware/Redirect"

export default function configureStore() {
    return compose(applyMiddleware(thunkMiddleware, logger, Redirect))(createStore)(rootReducer)
}