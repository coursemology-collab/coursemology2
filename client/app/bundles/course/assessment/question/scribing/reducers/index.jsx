import Immutable from 'immutable';
import { combineReducers } from 'redux-immutable';
import scribingQuestionReducer, { initialState as scribingQuestionState } from './scribingQuestionReducer';

export const initialStates = Immutable.fromJS({
  scribingQuestion: scribingQuestionState
});

export default combineReducers({
  scribingQuestion: scribingQuestionReducer
});
