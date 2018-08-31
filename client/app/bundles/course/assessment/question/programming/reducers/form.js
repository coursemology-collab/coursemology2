import { reducer as formReducer } from 'redux-form';

import { actionTypes, formNames } from '../constants';

function buildInitialValues(formValues) {
  return {
    question_programming: {
      skill_ids: [],
      submission: '',
      solution: '',
      submit_as_file: false,
      submission_files: [],
      solution_files: [],
      prepend: '',
      append: '',
      data_files: [],
      test_cases: {
        public: [],
        private: [],
        evaluation: [],
      },
      ...formValues,
    },
  };
}

export default formReducer.plugin({
  [formNames.PROGRAMMING_QUESTION]: (state, action) => {
    switch (action.type) {
      case actionTypes.FETCH_QUESTION_SUCCESS: {
        const formValues = buildInitialValues(action.payload.formValues);

        return {
          ...state,
          initial: formValues,
          values: formValues,
        };
      }
      default:
        return state;
    }
  },
});
