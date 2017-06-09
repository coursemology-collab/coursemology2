import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import submissionEdit from './submissionEdit';
import answers from './answers';
import commentForms from './commentForms';
import explanations from './explanations';
import posts from './posts';
import questions from './questions';
import topics from './topics';
import grading from './grading';

export default combineReducers({
  submissionEdit,
  form,
  answers,
  commentForms,
  explanations,
  posts,
  questions,
  topics,
  grading,
});
