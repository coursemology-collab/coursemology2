import React, { Component } from 'react';
import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { red100, yellow100, grey100, green100, blue100 } from 'material-ui/styles/colors';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import IconButton from 'material-ui/IconButton';
import moment from 'lib/moment';

import { ProgressProp } from '../propTypes';

const styles = {
  header: {
    attempting: {
      backgroundColor: yellow100,
    },
    submitted: {
      backgroundColor: grey100,
    },
    graded: {
      backgroundColor: blue100,
    },
    published: {
      backgroundColor: green100,
    },
  },
  warningIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  table: {
    maxWidth: 600,
  },
};

class ProgressPanel extends Component {

  formatDateTime(dateTime) {
    return dateTime ? moment(dateTime).format('DD MMM YYYY, h:mma') : null;
  }

  renderGrading() {
    const { basePoints, grade, gradedAt, grader, maximumGrade, pointsAwarded } = this.props.progress;
    return (
      <Table selectable={false} style={styles.table}>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>Grade</TableRowColumn>
            <TableRowColumn>{grade} / {maximumGrade}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Experience Points</TableRowColumn>
            <TableRowColumn>{pointsAwarded} / {basePoints}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Graded At</TableRowColumn>
            <TableRowColumn>{this.formatDateTime(gradedAt)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Grader</TableRowColumn>
            <TableRowColumn>{grader}</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  renderLateWarning() {
    return (
      <Card style={{ backgroundColor: red100 }}>
        <CardText>
          <WarningIcon style={styles.warningIcon} />
          <span>This submission is LATE! You may want to penalize the student for late submission.</span>
        </CardText>
      </Card>
    );
  }

  renderTimes() {
    const { attemptedAt, dueAt, submittedAt } = this.props.progress;
    return (
      <Table selectable={false} style={styles.table}>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>Attempted At</TableRowColumn>
            <TableRowColumn>{this.formatDateTime(attemptedAt)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Submitted At</TableRowColumn>
            <TableRowColumn>{this.formatDateTime(submittedAt)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Due At</TableRowColumn>
            <TableRowColumn>{this.formatDateTime(dueAt)}</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  render() {
    const { late, submitter, workflowState } = this.props.progress;
    const title = {
      attempting: 'Attempting',
      submitted: 'Submitted',
      graded: 'Graded but not published',
      published: 'Graded',
    }[workflowState];
    return (
      <Card>
        <CardHeader
          title={`Submission by ${submitter}`}
          subtitle={title}
          style={styles.header[workflowState]}
          actAsExpander
          showExpandableButton
        />
        <CardText>
          {this.renderGrading()}
          {late ? this.renderLateWarning() : null}
        </CardText>
        <CardText expandable>
          {this.renderTimes()}
        </CardText>
      </Card>
    );
  }
}

ProgressPanel.propTypes = {
  progress: ProgressProp.isRequired,
};

export default ProgressPanel;
