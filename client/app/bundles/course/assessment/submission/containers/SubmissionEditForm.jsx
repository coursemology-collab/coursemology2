/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import RichTextField from 'lib/components/redux-form/RichTextField';
import CheckboxFormGroup from '../components/CheckboxFormGroup';
import FileInput from '../components/FileInput';
import { QuestionTypes } from '../constants';
import { AnswerProp } from '../propTypes';

class SubmissionEditForm extends Component {
  static getUploadedFilename(values, key) {
    if (values) {
      return values[key] ? values[key].name : '';
    }
    return '';
  }

  static renderMCQ(answer) {
    const title = answer.question.displayTitle;
    const answerId = answer.id.toString();
    return (
      <div key={answerId}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: answer.question.description }} />
        <hr />
        {answer.options.map(opt =>
          <label key={opt.id}>
            <Field name={answerId} component="input" type="radio" value={opt.id.toString()} />
            <div dangerouslySetInnerHTML={{ __html: opt.option.trim() }} />
          </label>
        )}
      </div>
    );
  }

  static renderMRQ(answer) {
    const title = answer.question.displayTitle;
    const answerId = answer.id.toString();
    return (
      <div key={answerId}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: answer.question.description }} />
        <hr />
        <Field name={answerId} component={CheckboxFormGroup} options={answer.options} />
      </div>
    );
  }

  static renderFileUploader(answerId, filename) {
    return (
      <FileInput
        name={answerId}
        inputOptions={{
          multiple: false,
        }}
      >
        <p>Choose file</p>
        <p>{filename || 'No file chosen'}</p>
      </FileInput>
    );
  }

  static renderTextResponse(answer, values) {
    const title = answer.question.displayTitle;
    const answerId = answer.id.toString();
    const allowUpload = answer.allowAttachment;

    return (
      <div key={answerId}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: answer.question.description }} />
        <hr />
        <Field name={answerId} component={RichTextField} multiLine />
        {allowUpload ? SubmissionEditForm.renderFileUploader(
          `${answerId}-file`,
          SubmissionEditForm.getUploadedFilename(values, `${answerId}-file`)
        ) : null}
      </div>
    );
  }

  static renderFileUpload(answer, values) {
    const title = answer.question.displayTitle;
    const answerId = answer.id.toString();

    return (
      <div key={answerId}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: answer.question.description }} />
        <hr />
        {SubmissionEditForm.renderFileUploader(answerId, SubmissionEditForm.getUploadedFilename(values, answerId))}
      </div>
    );
  }

  static renderQuestion(answer, values) {
    switch (answer.type) {
      case QuestionTypes.MultipleChoice:
        return SubmissionEditForm.renderMCQ(answer);
      case QuestionTypes.MultipleResponse:
        return SubmissionEditForm.renderMRQ(answer);
      case QuestionTypes.TextResponse:
        return SubmissionEditForm.renderTextResponse(answer, values);
      case QuestionTypes.FileUpload:
        return SubmissionEditForm.renderFileUpload(answer, values);
      default:
        return null;
    }
  }

  render() {
    const { answers, formValues, pristine, submitting, handleSubmit } = this.props;
    return (
      <div>
        <form>
          {answers.map(answer => SubmissionEditForm.renderQuestion(answer, formValues))}
        </form>
        <button onClick={handleSubmit} disabled={pristine || submitting}>Submit</button>
      </div>
    );
  }
}

SubmissionEditForm.propTypes = {
  answers: PropTypes.arrayOf(AnswerProp),
  formValues: PropTypes.arrayOf(PropTypes.any),
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
