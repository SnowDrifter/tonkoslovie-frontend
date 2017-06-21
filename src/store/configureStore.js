import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { logger } from 'redux-logger'
import { rootReducer } from '../reducer/Index.js'
import { redirect } from '../middleware/redirect'

export default function configureStore() {
    return compose(
        applyMiddleware(thunkMiddleware, logger, redirect)
    )(createStore)(rootReducer)
}