import { combineReducers } from 'redux';
import submissionReducer from './submissionReducer';

export default combineReducers({
  submission: submissionReducer,
});
