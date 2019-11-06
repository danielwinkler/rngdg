import React from 'react';
import { Store } from './src/store/store';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Home } from './src/components/Home';

const store = createStore(Store);

const App = () => (
  <Provider store={store}>
    <Home />
  </Provider>
);

export default App;
