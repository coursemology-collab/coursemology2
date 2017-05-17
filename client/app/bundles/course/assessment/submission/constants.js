import mirrorCreator from 'mirror-creator';

export const DATA_STATES = {
  Error: 'error',
  Unfetched: 'unfetched',
  Fetching: 'fetching',
  Received: 'received',
};

export const SAVE_STATES = {
  Error: 'error',
  Idle: 'idle',
  Saving: 'saving',
  Saved: 'saved',
};

export const questionTypes = mirrorCreator([
  'MultipleChoice',
  'MultipleResponse',
  'Programming',
  'TextResponse',
  'FileUpload',
  'Programming',
]);

export const TestCaseTypes = {
  Public: 'public_test',
  Private: 'private_test',
  Evaluation: 'evaluation_test',
};

const actionTypes = mirrorCreator([
  'FETCH_SUBMISSION_REQUEST', 'FETCH_SUBMISSION_SUCCESS', 'FETCH_SUBMISSION_FAILURE',
  'SAVE_DRAFT_REQUEST', 'SAVE_DRAFT_SUCCESS', 'SAVE_DRAFT_FAILURE',
  'SUBMISSION_REQUEST', 'SUBMISSION_SUCCESS', 'SUBMISSION_FAILURE',
  'UNSUBMIT_REQUEST', 'UNSUBMIT_SUCCESS', 'UNSUBMIT_FAILURE',
  'AUTOGRADE_REQUEST', 'AUTOGRADE_SUCCESS', 'AUTOGRADE_FAILURE',
]);

export default actionTypes;
