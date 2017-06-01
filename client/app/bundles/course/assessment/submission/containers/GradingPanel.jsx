import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn } from 'material-ui/Table';

import { formatDateTime } from '../utils';
import { QuestionProp, SubmissionProp } from '../propTypes';

const styles = {
  panel: {
    marginBottom: 20,
  },
  table: {
    maxWidth: 600,
  },
  hdColumn: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
};

class VisibleGradingPanel extends Component {
  static calculateMaxGrade(questions) {
    let maxGrade = 0;
    Object.values(questions).forEach((question) => { maxGrade += question.maximumGrade; });
    return maxGrade;
  }

  renderSubmissionTable() {
    const {
      questions,
      submission: {
        submitter, workflowState, basePoints, dueAt,
        attemptedAt, submittedAt, grader, gradedAt,
      },
    } = this.props;
    return (
      <Table selectable={false} style={styles.table}>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableHeaderColumn style={styles.hdColumn} columnNumber={0}>Student</TableHeaderColumn>
            <TableRowColumn>{submitter}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn style={styles.hdColumn} columnNumber={0}>Status</TableHeaderColumn>
            <TableRowColumn>{workflowState}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn style={styles.hdColumn} columnNumber={0}>Total Grade</TableHeaderColumn>
            <TableRowColumn>{`todo / ${VisibleGradingPanel.calculateMaxGrade(questions)}`}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn style={styles.hdColumn} columnNumber={0}>Experience Points Awarded</TableHeaderColumn>
            <TableRowColumn>{`todo / ${basePoints}`}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn style={styles.hdColumn} columnNumber={0}>Due At</TableHeaderColumn>
            <TableRowColumn>{formatDateTime(dueAt)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn style={styles.hdColumn} columnNumber={0}>Attempted At</TableHeaderColumn>
            <TableRowColumn>{formatDateTime(attemptedAt)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn style={styles.hdColumn} columnNumber={0}>Submitted At</TableHeaderColumn>
            <TableRowColumn>{formatDateTime(submittedAt)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn style={styles.hdColumn} columnNumber={0}>Grader</TableHeaderColumn>
            <TableRowColumn>{grader}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn style={styles.hdColumn} columnNumber={0}>Graded At</TableHeaderColumn>
            <TableRowColumn>{formatDateTime(gradedAt)}</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  renderGradeTable() {
    const { questions } = this.props;
    return (
      <div>
        <h1>Grade Summary</h1>
        <Table selectable={false} style={styles.table}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false} enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.hdColumn}>Question</TableHeaderColumn>
              <TableHeaderColumn style={styles.hdColumn}>Total Grade</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {Object.values(questions).map(question =>
              <TableRow key={question.id}>
                <TableHeaderColumn
                  style={styles.hdColumn}
                  columnNumber={0}
                >
                  {question.displayTitle}
                </TableHeaderColumn>
                <TableRowColumn>{`todo / ${question.maximumGrade}`}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  render() {
    return (
      <div style={styles.panel}>
        <Card>
          <CardHeader title="Statistics" />
          <CardText>{this.renderSubmissionTable()}</CardText>
          <CardText>{this.renderGradeTable()}</CardText>
        </Card>
      </div>
    );
  }
}

VisibleGradingPanel.propTypes = {
  questions: PropTypes.objectOf(QuestionProp),
  submission: SubmissionProp.isRequired,
};

function mapStateToProps(state) {
  return {
    questions: state.questions,
    submission: state.submissionEdit.submission,
  };
}

const GradingPanel = connect(
  mapStateToProps
)(VisibleGradingPanel);
export default GradingPanel;