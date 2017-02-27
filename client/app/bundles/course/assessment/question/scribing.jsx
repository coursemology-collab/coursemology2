import React from 'react';
import { render } from 'react-dom';
import Immutable from 'immutable';
import ProviderWrapper from 'lib/components/ProviderWrapper';
import storeCreator from './scribing/store';
import ScribingQuestion from './scribing/ScribingQuestion';

$(document).ready(() => {
  const mountNode = document.getElementById('scribing-question');
  if (mountNode) {
    const data = mountNode.getAttribute('data');
    const props = Immutable.fromJS(JSON.parse(data));
    const store = storeCreator(props);

    const Page = () => (
      <ProviderWrapper {...{ store }}>
        <ScribingQuestion />
      </ProviderWrapper>
    );

    render(
      <Page />,
      mountNode
    );
  }
});
