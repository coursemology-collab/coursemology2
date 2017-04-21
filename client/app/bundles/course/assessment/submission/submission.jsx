import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import ProviderWrapper from 'lib/components/ProviderWrapper';
import storeCreator from './store';
import routes from './routes';

$(document).ready(() => {
  const mountNode = document.getElementById('submission-edit');

  if (mountNode) {
    const store = storeCreator({ submission: {} });

    render(
      <ProviderWrapper {...{ store }}>
        <Router routes={routes} history={browserHistory} />
      </ProviderWrapper>
    , mountNode);
  }
});
