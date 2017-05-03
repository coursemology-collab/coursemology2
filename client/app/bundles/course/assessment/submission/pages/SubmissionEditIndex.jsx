import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import ProgressPanel from '../components/ProgressPanel';
import SubmissionEditForm from '../containers/SubmissionEditForm';
import { fetchSubmission, updateSubmission } from '../actions';
import { AssessmentProp, ProgressProp, ReduxFormProp, SubmissionProp } from '../propTypes';
import { DATA_STATES } from '../constants';

class VisibleSubmissionEditIndex extends Component {
  componentDidMount() {
    const { fetchData, params } = this.props;
    fetchData(params.submissionId);
  }

  handleSubmit() {
    console.log(this.props.form.values);
  }

  renderProgress() {
    const { progress, canGrade } = this.props;
    if (canGrade) {
      return <ProgressPanel progress={progress} />;
    }
    return null;
  }

  renderContent() {
    const { assessment, submission, canGrade } = this.props;
    if (assessment.autograded) {
      return <p>This is autograded assessment.</p>;
    }
    return (
      <SubmissionEditForm
        handleSubmit={() => this.handleSubmit()}
        answers={submission.answers}
        canGrade={canGrade}
      />
    );
  }

  render() {
    const { dataState } = this.props;
    if (dataState === DATA_STATES.Received) {
      return (
        <div>
          {this.renderProgress()}
          {this.renderContent()}
        </div>
      );
    } else if (dataState === DATA_STATES.Error) {
      return <p>Error...</p>;
    }
    return <p>Loading...</p>;
  }
}

VisibleSubmissionEditIndex.propTypes = {
  params: PropTypes.shape({
    courseId: PropTypes.string,
    assessmentId: PropTypes.string,
    submissionId: PropTypes.string,
  }),
  assessment: AssessmentProp.isRequired,
  canGrade: PropTypes.bool,
  form: ReduxFormProp,
  progress: ProgressProp.isRequired,
  submission: SubmissionProp.isRequired,
  dataState: PropTypes.string.isRequired,

  fetchData: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    assessment: state.submissionEdit.assessment,
    canGrade: state.submissionEdit.canGrade,
    form: state.form.submissionEdit,
    progress: state.submissionEdit.progress,
    submission: state.submissionEdit.submission,
    dataState: state.submissionEdit.dataState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData: id => dispatch(fetchSubmission(id)),
    updateData: (id, payload) => dispatch(updateSubmission(id, payload)),
  };
}

const SubmissionEditIndex = connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibleSubmissionEditIndex);
export default SubmissionEditIndex;
