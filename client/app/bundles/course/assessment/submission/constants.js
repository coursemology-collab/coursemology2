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
  'RESET_REQUEST', 'RESET_SUCCESS', 'RESET_FAILURE',
  'SAVE_GRADE_REQUEST', 'SAVE_GRADE_SUCCESS', 'SAVE_GRADE_FAILURE',
  'MARK_REQUEST', 'MARK_SUCCESS', 'MARK_FAILURE',
  'PUBLISH_REQUEST', 'PUBLISH_SUCCESS', 'PUBLISH_FAILURE',
  'CREATE_COMMENT_REQUEST', 'CREATE_COMMENT_SUCCESS', 'CREATE_COMMENT_FAILURE', 'CREATE_COMMENT_CHANGE',
  'UPDATE_COMMENT_REQUEST', 'UPDATE_COMMENT_SUCCESS', 'UPDATE_COMMENT_FAILURE', 'UPDATE_COMMENT_CHANGE',
  'DELETE_COMMENT_REQUEST', 'DELETE_COMMENT_SUCCESS', 'DELETE_COMMENT_FAILURE',
  'CREATE_ANNOTATION_REQUEST', 'CREATE_ANNOTATION_SUCCESS', 'CREATE_ANNOTATION_FAILURE', 'CREATE_ANNOTATION_CHANGE',
  'UPDATE_ANNOTATION_REQUEST', 'UPDATE_ANNOTATION_SUCCESS', 'UPDATE_ANNOTATION_FAILURE', 'UPDATE_ANNOTATION_CHANGE',
  'DELETE_ANNOTATION_REQUEST', 'DELETE_ANNOTATION_SUCCESS', 'DELETE_ANNOTATION_FAILURE',
  'UPDATE_GRADING', 'UPDATE_EXP', 'UPDATE_MULTIPLIER',
]);

export default actionTypes;
