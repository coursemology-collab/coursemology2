import actions from '../constants';

export default function (state = {}, action) {
  switch (action.type) {
    case actions.FETCH_SUBMISSION_SUCCESS:
    case actions.SAVE_DRAFT_SUCCESS:
    case actions.SUBMISSION_SUCCESS:
    case actions.UNSUBMIT_SUCCESS:
      return {
        ...state,
        ...action.payload.explanations,
      };
    case actions.AUTOGRADE_SUCCESS: {
      if (action.payload.explanation === undefined) return state;

      const { question, id } = action.payload.explanation;
      return Object.keys(state).reduce((obj, key) => {
        if (state[key].question !== question) {
          return { ...obj, [key]: state[key] };
        }
        return obj;
      }, { [id]: action.payload.explanation });
    }
    default:
      return state;
  }
}
