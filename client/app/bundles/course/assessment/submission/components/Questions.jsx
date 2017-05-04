/* eslint-disable react/no-danger */
import 'brace/mode/python';
import 'brace/theme/github';

import React, { Component } from 'react';
import { Field } from 'redux-form';
import AceEditor from 'react-ace';

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import RichTextField from 'lib/components/redux-form/RichTextField';

import CheckboxFormGroup from '../components/CheckboxFormGroup';
import FileInput from '../components/FileInput';


export default class Questions extends Component {
  static renderQuestionHeader(answer) {
    const title = answer.question.displayTitle;
    return (
      <div>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: answer.question.description }} />
        <hr />
      </div>
    );
  }

  static renderMCQ(answer) {
    const answerId = answer.id.toString();
    return (
      <div key={answerId}>
        {Questions.renderQuestionHeader(answer)}
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
    const answerId = answer.id.toString();
    return (
      <div key={answerId}>
        {Questions.renderQuestionHeader(answer)}
        <Field name={answerId} component={CheckboxFormGroup} options={answer.options} />
      </div>
    );
  }

  static renderFileUploader(answerId, filename) {
    return (
      <FileInput name={answerId} inputOptions={{ multiple: false }}>
        <p>Choose file</p>
        <p>{filename || 'No file chosen'}</p>
      </FileInput>
    );
  }

  static getUploadedFilename(values, key) {
    if (values) {
      return values[key] ? values[key].name : '';
    }
    return '';
  }

  static renderTextResponse(answer, values) {
    const answerId = answer.id.toString();
    const allowUpload = answer.allowAttachment;

    return (
      <div key={answerId}>
        {Questions.renderQuestionHeader(answer)}
        <Field name={answerId} component={RichTextField} multiLine />
        {allowUpload ? Questions.renderFileUploader(
          `${answerId}-file`,
          Questions.getUploadedFilename(values, `${answerId}-file`)
        ) : null}
      </div>
    );
  }

  static renderFileUpload(answer, values) {
    const answerId = answer.id.toString();
    return (
      <div key={answerId}>
        {Questions.renderQuestionHeader(answer)}
        {Questions.renderFileUploader(answerId, Questions.getUploadedFilename(values, answerId))}
      </div>
    );
  }

  static renderProgrammingEditor(file, language) {
    return (
      <div>
        <h5>Content</h5>
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
      </div>
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
    const answerId = answer.id.toString();
    return (
      <div key={answerId}>
        {Questions.renderQuestionHeader(answer)}
        {answer.files.map(file => Questions.renderProgrammingEditor(file, 'python'))}
        {Questions.renderProgrammingTestCases(answer.testCases, canGrade)}
      </div>
    );
  }
}
