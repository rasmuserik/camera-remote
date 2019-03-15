import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({hello: 'world'});
export const actions = {}

export function root(state = initialState, action) {
  if(actions[action.type]) {
    return actions[action.type](state, action);
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(root, composeEnhancers(applyMiddleware(thunk)));

