/* eslint-disable react/no-danger */
import 'brace/mode/python';
import 'brace/theme/github';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import AceEditor from 'react-ace';

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

  static renderProgrammingEditor(file, language) {
    return (
      <AceEditor
        key={file.filename}
        mode={language}
        theme="github"
        width="100%"
        minLines={25}
        maxLines={25}
        value={file.content}
        onChange={() => {}}
        editorProps={{ $blockScrolling: true }}
        setOptions={{ useSoftTabs: true }}
      />
    );
  }

  static renderProgrammingTestCases(testCases, canGrade) {
    if (!testCases || testCases.length === 0) {
      return null;
    }

    if (canGrade) {
      return (
        <div>
          <h3>Test Cases</h3>
          <p>All types of test cases</p>
        </div>
      );
    }
    return (
      <div>
        <h3>Test Cases</h3>
        <p>Only public test cases</p>
      </div>
    );
  }

  static renderProgramming(answer, canGrade) {
    const title = answer.question.displayTitle;
    const answerId = answer.id.toString();

    return (
      <div key={answerId}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: answer.question.description }} />
        <hr />
        <h5>Content</h5>
        {answer.files.map(file => SubmissionEditForm.renderProgrammingEditor(file, 'python'))}
        {SubmissionEditForm.renderProgrammingTestCases(answer.testCases, canGrade)}
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
      case QuestionTypes.Programming:
        return SubmissionEditForm.renderProgramming(answer);
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
