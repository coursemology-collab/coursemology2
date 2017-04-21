import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import store from './store';
import routes from './routes';

$(document).ready(() => {
  const mountNode = document.getElementById('submission-edit');

  if (mountNode) {
    render(
      <Provider store={store}>
        <Router routes={routes} history={browserHistory} />
      </Provider>
    , mountNode);
  }
});
