import { getCourseId, getAssessmentId, getProgrammingQuestionId } from 'lib/helpers/url-helpers';
import BaseAPI from '../Base';

export default class ProgrammingQuestionAPI extends BaseAPI {

  edit() {
    return this.getClient().get(`${this._getUrlPrefix()}/${getProgrammingQuestionId()}/edit`);
  }

  create(formData) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'file_types',
      },
    };

    return this.getClient().post(ProgrammingQuestionAPI._getUrlPrefix(), formData, config);
  }

  update(programmingQuestionId, formData) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'file_types',
      },
    };

    return this.getClient().patch(
      `${ProgrammingQuestionAPI._getUrlPrefix()}/${programmingQuestionId}`, formData, config
    );
  }

  _getUrlPrefix() {
    return `/courses/${getCourseId()}/assessments/${getAssessmentId()}/question/programming`;
  }
}
