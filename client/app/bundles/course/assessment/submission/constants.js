import mirrorCreator from 'mirror-creator';

export const DATA_STATES = {
  Error: 'error',
  Unfetched: 'unfetched',
  Fetching: 'fetching',
  Received: 'received',
};

export const QuestionTypes = {
  MultipleChoice: 'MultipleChoice',
  MultipleResponse: 'MultipleResponse',
  Programming: 'Programming',
  TextResponse: 'TextResponse',
  FileUpload: 'FileUpload',
};

const actions = mirrorCreator([
  'FETCHING_SUBMISSION',
  'RECEIVED_SUBMISSION',
  'FETCH_SUBMISSION_ERROR',
]);

export default actions;
