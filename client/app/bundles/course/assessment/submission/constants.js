import mirrorCreator from 'mirror-creator';

export const DATA_STATES = {
  Error: 'error',
  Unfetched: 'unfetched',
  Fetching: 'fetching',
  Received: 'received',
};

const actions = mirrorCreator([
  'FETCHING_SUBMISSION',
  'RECEIVED_SUBMISSION',
  'FETCH_SUBMISSION_ERROR',
]);

export default actions;
