import { actionTypes } from '../constants';

const initialState = [];

export default function skillsRedocer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case actionTypes.FETCH_QUESTION_SUCCESS:
      return action.payload.skills
    default:
      return state;
  }
}
