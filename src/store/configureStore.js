import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { persistCombineReducers } from 'redux-persist';
import todoListReducer from "./reducers/todoListReducer";

const config = {
    key: 'data',
    storage,
    storageReconciler: autoMergeLevel2,
};

const rootReducer = persistCombineReducers(config, {
    list: todoListReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() || compose;

let middleware = [thunk];

const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();

const logger = createLogger({ collapsed: true });
middleware = [...middleware, logger, reduxImmutableStateInvariant];
const enhancer = composeEnhancers(applyMiddleware(...middleware));

export default function configureStore() {
    return createStore(rootReducer, {}, enhancer);
}
