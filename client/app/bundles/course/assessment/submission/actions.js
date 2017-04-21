import CourseAPI from 'api/course'
import actions from './constants';

export function fetchSubmission(id) {
  return (dispatch) => {
    dispatch({ type: actions.FETCHING_SUBMISSION });
    
    return CourseAPI.assessment.submissions.edit(id)
      .then(response => response.data)
      .then(data => {
        dispatch({
          type: actions.RECEIVED_SUBMISSION,
          payload: data,
        })
      })
      .catch(error => {
        dispatch({
          type: actions.FETCH_SUBMISSION_ERROR
        });
      });
  };
}
