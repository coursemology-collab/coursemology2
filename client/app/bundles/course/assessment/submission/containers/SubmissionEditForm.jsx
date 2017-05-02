/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import RichTextField from 'lib/components/redux-form/RichTextField';
import CheckboxFormGroup from '../components/CheckboxFormGroup';
import FileInput from '../components/FileInput';
import { QuestionTypes } from '../constants';
import { QuestionProp } from '../propTypes';

class SubmissionEditForm extends Component {
  static getUploadedFilename(values, key) {
    if (values) {
      return values[key] ? values[key].name : '';
    }
    return '';
  }

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

  static renderTextResponse(question, values) {
    const title = question.displayTitle;
    const answerId = question.answer.id.toString();
    const allowUpload = question.answer.allowAttachment;

    return (
      <div key={answerId}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: question.description }} />
        <hr />
        <Field name={answerId} component={RichTextField} multiLine />
        {allowUpload ? SubmissionEditForm.renderFileUploader(
          `${answerId}-file`,
          SubmissionEditForm.getUploadedFilename(values, `${answerId}-file`)
        ) : null}
      </div>
    );
  }

  static renderFileUpload(question, values) {
    const title = question.displayTitle;
    const answerId = question.answer.id.toString();

    return (
      <div key={answerId}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: question.description }} />
        <hr />
        {SubmissionEditForm.renderFileUploader(answerId, SubmissionEditForm.getUploadedFilename(values, answerId))}
      </div>
    );
  }

  static renderQuestion(question, values) {
    switch (question.type) {
      case QuestionTypes.MultipleChoice:
        return SubmissionEditForm.renderMCQ(question);
      case QuestionTypes.MultipleResponse:
        return SubmissionEditForm.renderMRQ(question);
      case QuestionTypes.TextResponse:
        return SubmissionEditForm.renderTextResponse(question, values);
      case QuestionTypes.FileUpload:
        return SubmissionEditForm.renderFileUpload(question, values);
      default:
        return null;
    }
  }

  render() {
    const { questions, formValues, pristine, submitting, handleSubmit } = this.props;
    return (
      <div>
        <form>
          {questions.map(question => SubmissionEditForm.renderQuestion(question, formValues))}
        </form>
        <button onClick={handleSubmit} disabled={pristine || submitting}>Submit</button>
      </div>
    );
  }
}

SubmissionEditForm.propTypes = {
  questions: PropTypes.arrayOf(QuestionProp),
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
