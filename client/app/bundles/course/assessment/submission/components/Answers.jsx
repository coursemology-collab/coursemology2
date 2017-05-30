/* eslint-disable react/no-danger */
import 'brace/mode/python';
import 'brace/theme/github';

import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import ReactTooltip from 'react-tooltip';
import { RadioButton } from 'material-ui/RadioButton';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import RichTextField from 'lib/components/redux-form/RichTextField';

import CheckboxFormGroup from '../components/CheckboxFormGroup';
import FileInput from '../components/FileInput';
import Editor from '../components/Editor';
import { TestCaseTypes } from '../constants';

export default class Answers extends Component {
  static renderMultipleChoice(question, readOnly, answerId) {
    return (
      <Field
        name={`${answerId}[option_ids][0]`}
        component={Answers.renderMultipleChoiceOptions}
        {...{ question, answerId, readOnly }}
      />
    );
  }

  static renderMultipleChoiceOptions(props) {
    const { readOnly, question, input: { onChange, value } } = props;
    return (
      <div>
        {question.options.map(option =>
          <RadioButton
            key={option.id}
            value={option.id}
            onCheck={(event, buttonValue) => onChange(buttonValue)}
            checked={option.id === value}
            label={(
              <div dangerouslySetInnerHTML={{ __html: option.option.trim() }} />
            )}
            disabled={readOnly}
          />
        )}
      </div>
    );
  }

  static renderMultipleResponse(question, readOnly, answerId) {
    return (
      <Field
        name={`${answerId}[option_ids]`}
        component={CheckboxFormGroup}
        options={question.options}
        {...{ readOnly }}
      />
    );
  }

  static renderFileUploader(question, readOnly, answerId) {
    return (
      <FileInput name={`${answerId}[file]`} inputOptions={{ multiple: false }} disabled={readOnly}>
        <p>Choose file</p>
      </FileInput>
    );
  }

  static renderTextResponse(question, readOnly, answerId) {
    const allowUpload = question.allowAttachment;

    return (
      <div>
        <Field
          name={`${answerId}[answer_text]`}
          component={RichTextField}
          multiLine
          {...{ disabled: readOnly }}
        />
        {allowUpload && !readOnly ? Answers.renderFileUploader(question, readOnly, answerId) : null}
      </div>
    );
  }

  static renderFileUpload(question, readOnly, answerId) {
    return <div>{Answers.renderFileUploader(question, readOnly, answerId)}</div>;
  }

  static renderProgrammingEditor(file, readOnly, answerId, language) {
    return (
      <div key={file.filename}>
        <h5>Content</h5>
        <Editor
          name={`${answerId}[content]`}
          filename={file.filename}
          language={language}
          readOnly={readOnly}
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
        {warn ? Answers.renderExclamationTriangle() : null}
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
        {Answers.renderTestCases(
          testCases.filter(testCase => testCase.type === TestCaseTypes.Public),
          Answers.renderTestCaseTitle('Public Test Cases', false)
        )}
        {canGrade ? Answers.renderTestCases(
          testCases.filter(testCase => testCase.type === TestCaseTypes.Private),
          Answers.renderTestCaseTitle('Private Test Cases', true)
        ) : null}
        {canGrade ? Answers.renderTestCases(
          testCases.filter(testCase => testCase.type === TestCaseTypes.Evaluation),
          Answers.renderTestCaseTitle('Evaluation Test Cases', true)
        ) : null}
      </div>
    );
  }

  static renderProgrammingFiles(props) {
    const { fields, readOnly } = props;
    return (
      <div>
        {fields.map((answerId, index) => {
          const file = fields.get(index);
          return Answers.renderProgrammingEditor(file, readOnly, answerId, 'python');
        })}
      </div>
    );
  }

  static renderProgramming(question, readOnly, answerId, canGrade) {
    return (
      <div>
        <FieldArray
          name={`${answerId}[files]`}
          component={Answers.renderProgrammingFiles}
          {...{ readOnly }}
        />
        {Answers.renderProgrammingTestCases(question.test_cases, canGrade)}
      </div>
    );
  }
}
