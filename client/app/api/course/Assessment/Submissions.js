import BaseAssessmentAPI from './Base';

export default class SubmissionsAPI extends BaseAssessmentAPI {
  /**
  * Fetches a Submission
  *
  * @param {number} submissionId
  * @return {Promise}
  * success response: submission_with_questions_and_answers
  */
  edit(submissionId) {
    return this.getClient().get(`${this._getUrlPrefix()}/${submissionId}/edit`);
  }

  update(submissionId, submissionFields) {
    return this.getClient().patch(`${this._getUrlPrefix()}/${submissionId}`, submissionFields);
  }

  _getUrlPrefix() {
    return `/courses/${this.getCourseId()}/assessments/${this.getAssessmentId()}/submissions`;
  }
}
