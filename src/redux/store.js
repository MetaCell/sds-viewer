import { createStore } from '@metacell/geppetto-meta-client/common';
import { layout as baseLayout } from '../app/layout';
import { sdsMiddleware } from './middleware'
import componentMap from '../app/componentMap';
import { sdsInitialState } from './initialState';
import sdsClientReducer from './initialState';

const reducers = {
  "sdsState": sdsClientReducer
}

/**
 * The createStore function is used to initialize the redux store & configure the layout.
 * 
 * You can build upon geppetto-meta's configuration by passing your own reducers, initial state and middlewares.
 */
const store = createStore(
  reducers,
  sdsInitialState,
  [sdsMiddleware],
  { baseLayout, componentMap }
)

export default store;