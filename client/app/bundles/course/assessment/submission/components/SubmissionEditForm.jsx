/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import RichTextField from 'lib/components/redux-form/RichTextField';
import CheckboxFormGroup from './CheckboxFormGroup';
import { QuestionTypes } from '../constants';
import { QuestionProp } from '../propTypes';

class SubmissionEditForm extends Component {
  static renderMCQ(question) {
    const title = question.displayTitle;
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
    const title = question.displayTitle;
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

  static renderFileUploader() {
    return null;
  }

  static renderTextResponse(question) {
    const title = question.display_title;
    const answerId = question.answer.id.toString();
    const allowUpload = question.answer.allow_attachment;

    return (
      <div key={answerId}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: question.description }} />
        <hr />
        <Field name={answerId} component={RichTextField} multiLine />
        {allowUpload ? QuestionTypes.renderFileUploader() : null}
      </div>
    );
  }

  static renderQuestion(question) {
    switch (question.type) {
      case QuestionTypes.MultipleChoice:
        return SubmissionEditForm.renderMCQ(question);
      case QuestionTypes.MultipleResponse:
        return SubmissionEditForm.renderMRQ(question);
      case QuestionTypes.TextResponse:
        return SubmissionEditForm.renderTextResponse(question);
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
