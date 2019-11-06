import React from 'react';
import { Store } from './src/store/store';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import Home from './src/components/Home';

const middleware = applyMiddleware(createLogger());
const store = createStore(Store, middleware);

const App = () => (
  <Provider store={store}>
    <Home />
  </Provider>
);

export default App;
