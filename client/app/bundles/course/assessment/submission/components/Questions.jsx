/* eslint-disable react/no-danger */
import 'brace/mode/python';
import 'brace/theme/github';

import React, { Component } from 'react';
import { Field } from 'redux-form';
import ReactTooltip from 'react-tooltip';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import RichTextField from 'lib/components/redux-form/RichTextField';

import CheckboxFormGroup from '../components/CheckboxFormGroup';
import FileInput from '../components/FileInput';
import Editor from '../components/Editor';
import { TestCaseTypes } from '../constants';

export default class Questions extends Component {
  static getUploadedFilename(values, key) {
    if (values) {
      return values[key] ? values[key].name : '';
    }
    return '';
  }

  static getEditorContent(values, key) {
    if (values) {
      return values[key] || '';
    }
    return '';
  }

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

  static renderProgrammingEditor(answerId, file, language, values) {
    const id = `${answerId}-${file.filename.split('.')[0]}`;
    return (
      <div key={file.filename}>
        <h5>Content</h5>
        <Editor
          name={id}
          content={Questions.getEditorContent(values, id)}
          language={language}
        />
      </div>
    );
  }

  static renderExclamationTriangle() {
    return (
      <div>
        <a data-tip data-for="exclamation-triangle"><i className="fa fa-exclamation-triangle" /></a>
        <ReactTooltip id="exclamation-triangle" effect="solid">
          You are able to view these test cases because you are staff. Students will not be able to see them.
        </ReactTooltip>
      </div>
    );
  }

  static renderTestCaseTitle(title, warn) {
    return (
      <div>
        {title}
        {warn ? Questions.renderExclamationTriangle() : null}
      </div>
    );
  }

  static renderTestCases(testCases, title) {
    if (testCases.length === 0) {
      return null;
    }
    return (
      <div>
        <Card>
          <CardHeader
            title={title}
            style={{}}
          />
          <CardText>
            <Table selectable={false} style={{}}>
              <TableHeader displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Identifier</TableHeaderColumn>
                  <TableHeaderColumn>Expression</TableHeaderColumn>
                  <TableHeaderColumn>Expected</TableHeaderColumn>
                  <TableHeaderColumn>Output</TableHeaderColumn>
                  <TableHeaderColumn>Hint</TableHeaderColumn>
                  <TableHeaderColumn>Passed</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {testCases.map(testCase =>
                  <TableRow key={testCase.identifier}>
                    <TableRowColumn>{testCase.identifier}</TableRowColumn>
                    <TableRowColumn>{testCase.expression}</TableRowColumn>
                    <TableRowColumn>{testCase.expected}</TableRowColumn>
                    <TableRowColumn>{testCase.output}</TableRowColumn>
                    <TableRowColumn>{testCase.hint}</TableRowColumn>
                    <TableRowColumn>{testCase.passed}</TableRowColumn>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardText>
        </Card>
      </div>
    );
  }

  static renderProgrammingTestCases(testCases, canGrade) {
    if (!testCases || testCases.length === 0) {
      return null;
    }

    return (
      <div>
        <h3>Test Cases</h3>
        {Questions.renderTestCases(
          testCases.filter(testCase => testCase.type === TestCaseTypes.Public),
          Questions.renderTestCaseTitle('Public Test Cases', false)
        )}
        {canGrade ? Questions.renderTestCases(
          testCases.filter(testCase => testCase.type === TestCaseTypes.Private),
          Questions.renderTestCaseTitle('Private Test Cases', true)
        ) : null}
        {canGrade ? Questions.renderTestCases(
          testCases.filter(testCase => testCase.type === TestCaseTypes.Evaluation),
          Questions.renderTestCaseTitle('Evaluation Test Cases', true)
        ) : null}
      </div>
    );
  }

  static renderProgramming(answer, canGrade, values) {
    const answerId = answer.id.toString();
    return (
      <div key={answerId}>
        {Questions.renderQuestionHeader(answer)}
        {answer.files.map(file => Questions.renderProgrammingEditor(answerId, file, 'python', values))}
        {Questions.renderProgrammingTestCases(answer.testCases, canGrade)}
      </div>
    );
  }
}
