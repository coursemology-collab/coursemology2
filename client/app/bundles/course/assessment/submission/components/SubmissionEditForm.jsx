/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import CheckboxFormGroup from './CheckboxFormGroup';
import { QuestionTypes } from '../constants';
import { QuestionProp } from '../propTypes';

class SubmissionEditForm extends Component {
  static renderMCQ(question) {
    const title = question.display_title;
    const answerId = question.answer.id.toString();
    return (
      <div key={answerId}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: question.description }} />
        <hr />
        {question.answer.options.map(opt =>
          <label key={opt.id}>
            <Field name={answerId} component="input" type="radio" value={opt.id.toString()} />
            <div dangerouslySetInnerHTML={{ __html: opt.option.trim() }} />
          </label>
        )}
      </div>
    );
  }

  static renderMRQ(question) {
    const title = question.display_title;
    const answerId = question.answer.id.toString();
    return (
      <div key={answerId}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: question.description }} />
        <hr />
        <Field name={answerId} component={CheckboxFormGroup} options={question.answer.options} />
      </div>
    );
  }

  static renderQuestion(question) {
    switch (question.type) {
      case QuestionTypes.MultipleChoice:
        return SubmissionEditForm.renderMCQ(question);
      case QuestionTypes.MultipleResponse:
        return SubmissionEditForm.renderMRQ(question);
      default:
        return null;
    }
  }

  render() {
    const { questions, pristine, submitting, handleSubmit } = this.props;
    return (
      <div>
        <form>
          {questions.map(question => SubmissionEditForm.renderQuestion(question))}
        </form>
        <button onClick={handleSubmit} disabled={pristine || submitting}>Submit</button>
      </div>
    );
  }
}

SubmissionEditForm.propTypes = {
  questions: PropTypes.arrayOf(QuestionProp),
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'submissionEdit',
})(SubmissionEditForm);
