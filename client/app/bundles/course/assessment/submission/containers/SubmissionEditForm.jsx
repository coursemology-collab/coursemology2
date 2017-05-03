/* eslint-disable react/no-danger */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import Questions from '../components/Questions';
import { QuestionTypes } from '../constants';
import { AnswerProp } from '../propTypes';

class SubmissionEditForm extends Component {
  static renderQuestion(answer, canGrade, values) {
    switch (answer.type) {
      case QuestionTypes.MultipleChoice:
        return Questions.renderMCQ(answer);
      case QuestionTypes.MultipleResponse:
        return Questions.renderMRQ(answer);
      case QuestionTypes.TextResponse:
        return Questions.renderTextResponse(answer, values);
      case QuestionTypes.FileUpload:
        return Questions.renderFileUpload(answer, values);
      case QuestionTypes.Programming:
        return Questions.renderProgramming(answer, canGrade, values);
      default:
        return null;
    }
  }

  render() {
    const { answers, canGrade, formValues, pristine, submitting, handleSubmit } = this.props;
    return (
      <div>
        <form>
          {answers.map(answer => SubmissionEditForm.renderQuestion(answer, canGrade, formValues))}
        </form>
        <button onClick={handleSubmit} disabled={pristine || submitting}>Submit</button>
      </div>
    );
  }
}

SubmissionEditForm.propTypes = {
  canGrade: PropTypes.bool.isRequired,
  answers: PropTypes.arrayOf(AnswerProp),
  formValues: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.object,
  ]),
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default connect(
  state => ({
    formValues: state.form.submissionEdit ? state.form.submissionEdit.values : null,
  })
)(
  reduxForm({
    form: 'submissionEdit',
  })(SubmissionEditForm)
);
