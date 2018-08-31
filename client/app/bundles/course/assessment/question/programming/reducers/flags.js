import { actionTypes } from '../constants';

const initialState = {
  autogradedAssessment: false,
  canEditOnline: false,
  canSwitchPackageType: false,
  displayAutogradedToggle: false,
  hasAutoGradings: false,
  hasSubmissions: false,
  publishedAssessment: false,
  isLoading: true,
  isSubmitting: false,
};

export default function flagsReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case actionTypes.FETCH_QUESTION_REQUEST:
      return { ...state, isLoading: true };
    case actionTypes.FETCH_QUESTION_SUCCESS:
      return {
        ...state,
        ...action.payload.flags,
        isLoading: false,
      };
    case actionTypes.FETCH_QUESTION_FAILURE:
      return { ...state, isLoading: false };
    case actionTypes.SUBMIT_FORM_REQUEST:
      return { ...state, isSubmitting: true };
    case actionTypes.SUBMIT_FORM_SUCCESS:
    case actionTypes.SUBMIT_FORM_FAILURE:
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
}
