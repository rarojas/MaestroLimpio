'use strict'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

export default function configureStore (initialState) {
    const store = createStore(
        reducer,
        initialState,
        applyMiddleware(thunk),
      );

    if (module.hot) {
      module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default;
      store.replaceReducer(nextRootReducer);
      });
    }

    return store;
}
