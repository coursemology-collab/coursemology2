import actions from '../constants';

export default function (state = {}, action) {
  switch (action.type) {
    case actions.FETCH_SUBMISSION_SUCCESS:
    case actions.SAVE_DRAFT_SUCCESS:
    case actions.SUBMISSION_SUCCESS:
    case actions.UNSUBMIT_SUCCESS:
      return {
        ...state,
        ...action.payload.questions,
      };
    case actions.AUTOGRADE_SUCCESS: {
      const questionId = action.payload.answer.question;
      return {
        ...state,
        [questionId]: {
          ...state[questionId],
          answer: action.payload.answer.id,
          explanation: action.payload.explanation.id,
        },
      };
    }
    default:
      return state;
  }
}
