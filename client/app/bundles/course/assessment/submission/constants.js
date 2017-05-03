import mirrorCreator from 'mirror-creator';

export const DATA_STATES = {
  Error: 'error',
  Unfetched: 'unfetched',
  Fetching: 'fetching',
  Received: 'received',
};

export const QuestionTypes = mirrorCreator([
  'MultipleChoice',
  'MultipleResponse',
  'Programming',
  'TextResponse',
  'FileUpload',
  'Programming',
]);

const actionTypes = mirrorCreator([
  'FETCH_SUBMISSION_REQUEST',
  'FETCH_SUBMISSION_SUCCESS',
  'FETCH_SUBMISSION_FAILURE',
  'UPDATE_SUBMISSION_REQUEST',
  'UPDATE_SUBMISSION_SUCCESS',
  'UPDATE_SUBMISSION_FAILURE',
]);

export default actionTypes;
