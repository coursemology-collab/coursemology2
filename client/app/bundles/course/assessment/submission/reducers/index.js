import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import submissionReducer from './submissionReducer';

export default combineReducers({
  submission: submissionReducer,
  form: formReducer,
});
