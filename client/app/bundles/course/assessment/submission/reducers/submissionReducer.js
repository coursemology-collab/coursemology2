import actions, { DATA_STATES } from '../constants';

const initialState = {
  assessment: {},
  dataState: DATA_STATES.Unfetched,
};

export default function submissionReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCHING_SUBMISSION:
      return {
        ...state,
        dataState: DATA_STATES.Fetching,
      };
    case actions.RECEIVED_SUBMISSION:
      return {
        ...state,
        assessment: action.payload.assessment,
        dataState: DATA_STATES.Received,
      };
    case actions.FETCH_SUBMISSION_ERROR:
      return {
        ...state,
        dataState: DATA_STATES.Error,
      }
    default:
      return state;
  }
}
