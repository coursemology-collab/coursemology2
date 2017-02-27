import mirrorCreator from 'mirror-creator';

const actionTypes = mirrorCreator([
  'SCRIBING_QUESTION_UPDATE',
  'SKILLS_UPDATE',
  'EDITOR_MODE_UPDATE',
  'HAS_ERROR_CLEAR',
  'SUBMISSION_MESSAGE_SET',
  'SUBMISSION_MESSAGE_CLEAR',
  'SUBMIT_FORM_LOADING',
  'SUBMIT_FORM_SUCCESS',
  'SUBMIT_FORM_FAILURE',
  'VALIDATION_ERRORS_SET'
]);

export default actionTypes;
