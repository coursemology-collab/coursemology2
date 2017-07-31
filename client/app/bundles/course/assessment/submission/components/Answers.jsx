/* eslint-disable react/no-danger */
import 'brace/mode/python';
import 'brace/theme/github';

import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import { RadioButton } from 'material-ui/RadioButton';
import { Table, TableBody, TableHeader, TableHeaderColumn,
         TableRow, TableRowColumn } from 'material-ui/Table';
import { green50 } from 'material-ui/styles/colors';

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import RichTextField from 'lib/components/redux-form/RichTextField';

import CheckboxFormGroup from '../components/CheckboxFormGroup';
import FileInput from '../components/FileInput';
import Editor from '../components/Editor';
import TestCaseView from '../containers/TestCaseView';
import ReadOnlyEditor from '../containers/ReadOnlyEditor';
import UploadedFileView from '../containers/UploadedFileView';

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
              <div
                style={option.correct && readOnly ? { backgroundColor: green50 } : null}
                dangerouslySetInnerHTML={{ __html: option.option.trim() }}
              />
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
      <div>
        <FileInput name={`${answerId}[files]`} disabled={readOnly} />
      </div>
    );
  }

  static renderTextResponseSolutions(question) {
    return (
      <div>
        <h4>Solutions</h4>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableHeaderColumn>Type</TableHeaderColumn>
            <TableHeaderColumn>Solution</TableHeaderColumn>
            <TableHeaderColumn>Grade</TableHeaderColumn>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {question.solutions.map(solution => (
              <TableRow>
                <TableRowColumn>{solution.solutionType}</TableRowColumn>
                <TableRowColumn>{solution.solution}</TableRowColumn>
                <TableRowColumn>{solution.grade}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
        {question.solutions ? Answers.renderTextResponseSolutions(question) : null}
        <UploadedFileView questionId={question.id} />
        {allowUpload && !readOnly ? Answers.renderFileUploader(question, readOnly, answerId) : null}
      </div>
    );
  }

  static renderFileUpload(question, readOnly, answerId) {
    return (
      <div>
        <UploadedFileView questionId={question.id} />
        {!readOnly ? Answers.renderFileUploader(question, readOnly, answerId) : null}
      </div>
    );
  }

  static renderProgrammingEditor(file, answerId, language) {
    return (
      <div key={file.filename}>
        <h5>Content</h5>
        <Editor
          name={`${answerId}[content]`}
          filename={file.filename}
          language={language}
        />
      </div>
    );
  }

  static renderReadOnlyProgrammingEditor(file, answerId) {
    const content = file.content.split('\n');
    return (
      <ReadOnlyEditor
        key={answerId}
        answerId={parseInt(answerId.split('[')[0], 10)}
        fileId={file.id}
        content={content}
      />
    );
  }

  static renderProgrammingFiles(props) {
    const { fields, readOnly } = props;
    return (
      <div>
        {fields.map((answerId, index) => {
          const file = fields.get(index);
          if (readOnly) {
            return Answers.renderReadOnlyProgrammingEditor(file, answerId);
          }
          return Answers.renderProgrammingEditor(file, answerId, 'python');
        })}
      </div>
    );
  }

  static renderProgramming(question, readOnly, answerId, canGrade) {
    return (
      <div>
        <FieldArray
          name={`${answerId}[files_attributes]`}
          component={Answers.renderProgrammingFiles}
          {...{ readOnly }}
        />
        <TestCaseView questionId={question.id} canGrade={canGrade} />
      </div>
    );
  }
}
