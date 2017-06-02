import actions from '../constants';

export default function (state = {}, action) {
  switch (action.type) {
    case actions.FETCH_SUBMISSION_SUCCESS:
    case actions.SAVE_DRAFT_SUCCESS:
    case actions.SUBMISSION_SUCCESS:
    case actions.UNSUBMIT_SUCCESS:
    case actions.MARK_SUCCESS:
    case actions.PUBLISH_SUCCESS: {
      return {
        ...state,
        ...action.payload.answers.reduce((obj, answer) =>
          ({ ...obj, [answer.questionId]: answer.grading })
        , {}),
      };
    }
    case actions.UPDATE_GRADING: {
      const newState = { ...state };
      newState[action.id].grade = action.grade;
      return newState;
    }
    default:
      return state;
  }
}
