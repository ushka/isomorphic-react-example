import { createStore, combineReducers, applyMiddleware } from 'redux';
import { identity } from 'lodash'; // used to get a reducer, that no matter what, returns the same state it was given

export default function(defaultState = {test: "Test Value"}) {
  const store = createStore(identity, defaultState);
  return store;
}
