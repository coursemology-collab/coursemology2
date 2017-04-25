import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SubmissionEditForm from '../components/SubmissionEditForm';
import fetchSubmission from '../actions';
import { AssessmentProp, ReduxFormProp } from '../propTypes';
import { DATA_STATES } from '../constants';

class VisibleSubmissionEditIndex extends Component {
  componentDidMount() {
    const { fetchData, params } = this.props;
    fetchData(params.submissionId);
  }

  handleSubmit() {
    console.log(this.props.form.values);
  }

  renderContent() {
    const { assessment } = this.props;
    if (assessment.autograded) {
      return <p>This is autograded assessment.</p>;
    }
    return <SubmissionEditForm handleSubmit={() => this.handleSubmit()} questions={assessment.questions} />;
  }

  render() {
    const { dataState } = this.props;
    if (dataState === DATA_STATES.Received) {
      return this.renderContent();
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
  form: ReduxFormProp,
  dataState: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    assessment: state.submission.assessment,
    form: state.form.submissionEdit,
    dataState: state.submission.dataState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData: id => dispatch(fetchSubmission(id)),
  };
}

const SubmissionEditIndex = connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibleSubmissionEditIndex);
export default SubmissionEditIndex;
