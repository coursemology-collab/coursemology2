/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import CheckboxFormGroup from './CheckboxFormGroup';
import { QuestionProp } from '../propTypes';

class SubmissionEditForm extends Component {
  static renderMCQ(question) {
    const title = question.display_title;
    const name = question.answer.id.toString();
    return (
      <div>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: question.description }} />
        <hr />
        {question.answer.options.map(opt =>
          <label key={opt.option}>
            {/* replace opt.option with opt.id */}
            <Field name={name} component="input" type="radio" value={opt.option.trim()} />
            <div dangerouslySetInnerHTML={{ __html: opt.option.trim() }} />
          </label>
        )}
      </div>
    );
  }

  static renderMRQ(question) {
    const title = question.display_title;
    const name = question.answer.id.toString();
    return (
      <div>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: question.description }} />
        <hr />
        <Field name={name} component={CheckboxFormGroup} options={question.answer.options} />
      </div>
    );
  }

  render() {
    const { questions, pristine, submitting, handleSubmit } = this.props;
    return (
      <div>
        <form>
          {SubmissionEditForm.renderMCQ(questions[0])}
          {SubmissionEditForm.renderMRQ(questions[1])}
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
