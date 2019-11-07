import React from 'react';
import { reducer } from './src/store/store';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import Home from './src/components/Home';
import { Epic, combineEpics, createEpicMiddleware } from 'redux-observable';
import { loadGifsEpic, loadAlternativesEpic, loadAlternativeGifsEpic } from './src/store/epics';

export const rootEpic: Epic = combineEpics(
  loadGifsEpic,
  loadAlternativesEpic,
  loadAlternativeGifsEpic);
const epicMiddleware = createEpicMiddleware();
const middleware = __DEV__
  ? applyMiddleware(createLogger(), epicMiddleware)
  : applyMiddleware(epicMiddleware);

const store = createStore(reducer, middleware);

epicMiddleware.run(rootEpic);

const App = () => (
  <Provider store={store}>
    <Home />
  </Provider>
);

export default App;
