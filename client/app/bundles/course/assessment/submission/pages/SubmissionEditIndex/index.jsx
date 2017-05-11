import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import ProgressPanel from '../../components/ProgressPanel';
import SubmissionEditForm from './SubmissionEditForm';
import SubmissionEditStepForm from './SubmissionEditStepForm';
import SubmissionEditTabForm from './SubmissionEditTabForm';
import { updateAnswer, fetchSubmission, updateSubmission } from '../../actions';
import { AssessmentProp, ProgressProp, ReduxFormProp, SubmissionProp, TopicProp } from '../../propTypes';
import { DATA_STATES } from '../../constants';

class VisibleSubmissionEditIndex extends Component {
  componentDidMount() {
    const { fetchData, match: { params } } = this.props;
    fetchData(params.submissionId);
  }

  handleSubmit(action) {
    const { form, updateData, match: { params } } = this.props;
    const data = { submission: form.values };
    if (action) data.submission[action] = true;
    updateData(params.submissionId, data);
  }

  handleSubmitAnswer(answerIndex, action) {
    const { form, updateAnswerData, match: { params } } = this.props;
    const data = {
      submission: {
        answers: [
          form.values.answers[answerIndex],
        ],
      },
    };
    if (action) data.submission[action] = true;
    updateAnswerData(params.submissionId, data);
  }

  renderProgress() {
    const { progress, canGrade } = this.props;
    if (canGrade) {
      return <ProgressPanel progress={progress} />;
    }
    return null;
  }

  renderContent() {
    const {
      assessment: { autograded, tabbedView, skippable },
      canGrade,
      maxStep,
      submission,
      topics,
    } = this.props;

    if (autograded) {
      return (
        <SubmissionEditStepForm
          enableReinitialize
          handleSubmit={(answer, action) => this.handleSubmitAnswer(answer, action)}
          initialValues={submission}
          canGrade={canGrade}
          maxStep={maxStep}
          skippable={skippable}
          topics={topics}
          {...{ submission }}
        />
      );
    } else if (tabbedView) { // eslint-disable-line camelcase
      return (
        <SubmissionEditTabForm
          enableReinitialize
          handleSubmit={action => this.handleSubmit(action)}
          initialValues={submission}
          canGrade={canGrade}
          topics={topics}
        />
      );
    }
    return (
      <SubmissionEditForm
        enableReinitialize
        handleSubmit={action => this.handleSubmit(action)}
        initialValues={submission}
        canGrade={canGrade}
        topics={topics}
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string,
      assessmentId: PropTypes.string,
      submissionId: PropTypes.string,
    }),
  }),
  assessment: AssessmentProp,
  canGrade: PropTypes.bool,
  form: ReduxFormProp,
  maxStep: PropTypes.number,
  progress: ProgressProp,
  submission: SubmissionProp,
  topics: PropTypes.arrayOf(TopicProp),
  dataState: PropTypes.string.isRequired,

  fetchData: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  updateAnswerData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    assessment: state.submissionEdit.assessment,
    canGrade: state.submissionEdit.canGrade,
    form: state.form.submissionEdit,
    maxStep: state.submissionEdit.maxStep,
    progress: state.submissionEdit.progress,
    submission: state.submissionEdit.submission,
    topics: state.submissionEdit.topics,
    dataState: state.submissionEdit.dataState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData: id => dispatch(fetchSubmission(id)),
    updateData: (id, payload) => dispatch(updateSubmission(id, payload)),
    updateAnswerData: (id, payload) => dispatch(updateAnswer(id, payload)),
  };
}

const SubmissionEditIndex = connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibleSubmissionEditIndex);
export default SubmissionEditIndex;
