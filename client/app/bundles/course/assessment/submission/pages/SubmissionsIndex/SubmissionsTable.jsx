// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import moment from 'lib/moment';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import IconMenu from 'material-ui-legacy/IconMenu';
import { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import red from 'material-ui/colors/red';
import blue from 'material-ui/colors/blue';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import DownloadIcon from 'material-ui-icons/FileDownload';
import HistoryIcon from 'material-ui-icons/History';

import { getCourseUserURL, getEditSubmissionURL, getSubmissionLogsURL } from 'lib/helpers/url-builders';
import { assessmentShape } from '../../propTypes';
import { workflowStates } from '../../constants';
import translations from '../../translations';
import submissionsTranslations from './translations';

const red600 = red['600'];
const blue600 = blue['600'];

const styles = {
  unstartedText: {
    color: red600,
    fontWeight: 'bold',
  },
  tableCell: {
    padding: '0.5em',
    textOverflow: 'initial',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  tableCenterCell: {
    ...this.tableCell,
    textAlign: 'center',
  },
};

export default class SubmissionsTable extends React.Component {
  static formatDate(date) {
    return date ? moment(date).format('DD MMM HH:mm') : null;
  }

  static renderUnpublishedWarning(submission) {
    if (submission.workflowState !== workflowStates.Graded) return null;

    return (
      <span style={{ display: 'inline-block', marginRight: 5 }}>
        <a data-tip data-for="unpublished-grades" data-offset="{'left' : -8}">
          <i className="fa fa-exclamation-triangle" />
        </a>
        <ReactTooltip id="unpublished-grades" effect="solid">
          <FormattedMessage {...submissionsTranslations.publishNotice} />
        </ReactTooltip>
      </span>
    );
  }

  static formatGrade(grade) {
    return (grade !== null) ? grade.toFixed(1) : null;
  }

  getGradeString(submission) {
    if (submission.workflowState === workflowStates.Unstarted) return null;

    const { assessment } = this.props;

    const gradeString =
      ((submission.workflowState === workflowStates.Attempting) ||
      (submission.workflowState === workflowStates.Submitted)) ? '--' :
        SubmissionsTable.formatGrade(submission.grade);

    const maximumGradeString = SubmissionsTable.formatGrade(assessment.maximumGrade);

    return `${gradeString} / ${maximumGradeString}`;
  }

  canDownload() {
    const { assessment, submissions } = this.props;
    return assessment.downloadable && submissions.some(
      s =>
        s.workflowState !== workflowStates.Unstarted &&
        s.workflowState !== workflowStates.Attempting
    );
  }

  canDownloadStatistics = () => {
    const { submissions } = this.props;
    return submissions.length > 0;
  }

  renderSubmissionWorkflowState(submission) {
    const { courseId, assessmentId } = this.props;

    if (submission.workflowState === workflowStates.Unstarted) {
      return (
        <div style={styles.unstartedText}>
          <FormattedMessage {...translations[submission.workflowState]} />
        </div>
      );
    }

    return (
      <div>
        {SubmissionsTable.renderUnpublishedWarning(submission)}
        <a href={getEditSubmissionURL(courseId, assessmentId, submission.id)}>
          <FormattedMessage {...translations[submission.workflowState]} />
        </a>
      </div>
    );
  }

  renderSubmissionLogsLink(submission) {
    const { assessment, courseId, assessmentId } = this.props;

    if (!assessment.passwordProtected || !submission.id) return null;

    return (
      <div data-tip data-for={`access-logs-${submission.id}`}>
        <a href={getSubmissionLogsURL(courseId, assessmentId, submission.id)}>
          <HistoryIcon style={{ color: submission.logCount > 1 ? red600 : blue600 }} />
          <ReactTooltip id={`access-logs-${submission.id}`} effect="solid">
            <FormattedMessage {...submissionsTranslations.accessLogs} />
          </ReactTooltip>
        </a>
      </div>
    );
  }

  renderStudents() {
    const { courseId, assessment, submissions } = this.props;
    return submissions.map(submission => (
      <TableRow key={submission.courseStudent.id}>
        <TableRowColumn style={styles.tableCell}>
          <a href={getCourseUserURL(courseId, submission.courseStudent.id)}>
            {submission.courseStudent.name}
          </a>
        </TableRowColumn>
        <TableRowColumn style={styles.tableCenterCell}>
          {this.renderSubmissionWorkflowState(submission)}
        </TableRowColumn>
        <TableRowColumn style={styles.tableCenterCell}>
          {this.getGradeString(submission)}
        </TableRowColumn>
        {assessment.gamified ?
          <TableRowColumn style={styles.tableCenterCell}>
            {submission.pointsAwarded !== undefined ? submission.pointsAwarded : null}
          </TableRowColumn>
        : null}
        <TableRowColumn style={styles.tableCenterCell}>
          {SubmissionsTable.formatDate(submission.dateSubmitted)}
        </TableRowColumn>
        <TableRowColumn style={styles.tableCenterCell}>
          {SubmissionsTable.formatDate(submission.dateGraded)}
        </TableRowColumn>
        <TableRowColumn style={{ width: 48, padding: 12 }}>
          {this.renderSubmissionLogsLink(submission)}
        </TableRowColumn>
      </TableRow>
    ));
  }

  renderDownloadDropdown() {
    const { handleDownload, handleDownloadStatistics, isDownloading, isStatisticsDownloading } = this.props;
    const downloadAnswerDisabled = isDownloading || !this.canDownload();
    const downloadStatisticsDisabled = isStatisticsDownloading || !this.canDownloadStatistics();
    return (
      <div>
        <IconMenu iconButtonElement={<IconButton id="download-dropdown-icon"><MoreVertIcon /></IconButton>}>
          <MenuItem
            className={downloadAnswerDisabled ? 'download-submissions-disabled' : 'download-submissions-enabled'}
            disabled={downloadAnswerDisabled}
            leftIcon={isDownloading ? <CircularProgress size={30} /> : <DownloadIcon />}
            onClick={downloadAnswerDisabled ? null : handleDownload}
          >
            <FormattedMessage {...submissionsTranslations.downloadAnswers} />
          </MenuItem>
          <MenuItem
            className={downloadStatisticsDisabled ? 'download-statistics-disabled' : 'download-statistics-enabled'}
            disabled={downloadStatisticsDisabled}
            leftIcon={isStatisticsDownloading ? <CircularProgress size={30} /> : <DownloadIcon />}
            onClick={downloadStatisticsDisabled ? null : handleDownloadStatistics}
          >
            <FormattedMessage {...submissionsTranslations.downloadStatistics} />
          </MenuItem>
        </IconMenu>
      </div>
    );
  }

  render() {
    const { submissions, assessment } = this.props;

    const tableHeaderColumnFor = field => (
      <TableHeaderColumn style={styles.tableCell}>
        <FormattedMessage {...submissionsTranslations[field]} />
      </TableHeaderColumn>
    );

    const tableHeaderCenterColumnFor = field => (
      <TableHeaderColumn style={styles.tableCenterCell}>
        <FormattedMessage {...submissionsTranslations[field]} />
      </TableHeaderColumn>
    );

    return (
      <Table selectable={false}>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            {tableHeaderColumnFor('studentName')}
            {tableHeaderCenterColumnFor('submissionStatus')}
            {tableHeaderCenterColumnFor('grade')}
            {assessment.gamified ? tableHeaderCenterColumnFor('experiencePoints') : null}
            {tableHeaderCenterColumnFor('dateSubmitted')}
            {tableHeaderCenterColumnFor('dateGraded')}
            <TableHeaderColumn style={{ width: 48, padding: 0 }}>
              {this.renderDownloadDropdown()}
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.renderStudents(submissions)}
        </TableBody>
      </Table>
    );
  }
}

SubmissionsTable.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      workflowState: PropTypes.string,
      grade: PropTypes.number,
      pointsAwarded: PropTypes.number,
      dateSubmitted: PropTypes.string,
      dateGraded: PropTypes.string,
    })
  ),
  assessment: assessmentShape.isRequired,
  courseId: PropTypes.string.isRequired,
  assessmentId: PropTypes.string.isRequired,
  isDownloading: PropTypes.bool.isRequired,
  isStatisticsDownloading: PropTypes.bool.isRequired,
  handleDownload: PropTypes.func,
  handleDownloadStatistics: PropTypes.func,
};
