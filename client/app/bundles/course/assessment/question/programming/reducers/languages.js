import { actionTypes } from '../constants';

const initialState = [];

export default function languagesReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case actionTypes.FETCH_QUESTION_SUCCESS:
      return action.payload.languages
    default:
      return state;
  }
}
