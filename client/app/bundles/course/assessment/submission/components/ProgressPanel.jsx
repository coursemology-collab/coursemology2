import React, { Component } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { Paper } from 'material-ui/Paper';
import { red200, yellow100, grey100, green100, blue100 } from 'material-ui/styles/colors';
import { formatDateTime } from 'lib/date-time-defaults';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

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
};

class ProgressPanel extends Component {

  renderCourseUser() {
    const { courseUser } = this.props.progress;
    return (
      <TableRow>
        <TableRowColumn>Student</TableRowColumn>
        <TableRowColumn>{courseUser}</TableRowColumn>
      </TableRow>
    );
  }

  renderTime() {
    const { workflowState, actionAt } = this.props.progress;
    let label = null;
    switch (workflowState) {
      case 'Attempting':
        label = 'Attempted At';
        break;
      case 'Submitted':
        label = 'Submitted At';
        break;
      default:
        label = 'Graded At';
        break;
    }
    return (
      <TableRow>
        <TableRowColumn>{label}</TableRowColumn>
        <TableRowColumn>{formatDateTime(actionAt)}</TableRowColumn>
      </TableRow>
    );
  }

  renderGrade() {
    const { grade, maximumGrade } = this.props.progress;
    return (
      <TableRow>
        <TableRowColumn>Grade</TableRowColumn>
        <TableRowColumn>{grade} / {maximumGrade}</TableRowColumn>
      </TableRow>
    );
  }

  renderLateWarning() {
    return (
      <Card style={{ backgroundColor: red200 }}>
        <CardText>
          <WarningIcon style={styles.warningIcon} />
          <span>This submission is LATE! You may want to penalize the student for late submission.</span>
        </CardText>
      </Card>
    );
  }

  render() {
    const { late, workflowState } = this.props.progress;
    return (
      <Card>
        <CardHeader title={workflowState} style={styles.header[workflowState.toLowerCase()]} />
        <CardText>
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              {this.renderCourseUser()}
              {this.renderTime()}
              {this.props.progress.grade ? this.renderGrade() : null}
            </TableBody>
          </Table>
          { late ? this.renderLateWarning() : null }
        </CardText>
      </Card>
    );
  }
}

ProgressPanel.propTypes = {
  progress: ProgressProp.isRequired,
};

export default ProgressPanel;
