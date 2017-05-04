import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Card } from 'material-ui/Card';
import { Stepper, Step, StepLabel } from 'material-ui/Stepper';

import { SubmissionProp } from '../propTypes';
import SubmissionAnswer from '../components/SubmissionAnswer';

class SubmissionEditTabbedForm extends Component {

  static renderAnswers(props) {
    const { input: { name }, canGrade, answer } = props;
    return (
      <SubmissionAnswer
        key={answer.id}
        {...{ canGrade, member: name, answer }}
      />
    );
  }

  state = {
    stepIndex: 0,
  }

  handleNext() {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
    });
  }

  render() {
    const { stepIndex } = this.state;
    const { canGrade, submission, pristine, submitting, handleSubmit } = this.props;
    return (
      <div>
        <Stepper activeStep={stepIndex}>
          {submission.answers.map(answer =>
            <Step key={answer.id}>
              <StepLabel><div /></StepLabel>
            </Step>
          )}
        </Stepper>
        <Card>
          <form>
            <Field
              name={`answers[${stepIndex}]`}
              component={SubmissionEditTabbedForm.renderAnswers}
              {...{ canGrade, answer: submission.answers[stepIndex] }}
            />
          </form>
          <button onClick={handleSubmit} disabled={pristine || submitting}>Submit</button>
        </Card>
      </div>
    );
  }
}

SubmissionEditTabbedForm.propTypes = {
  canGrade: PropTypes.bool,
  submission: SubmissionProp,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default connect(
  state => ({
    formValues: state.form.submissionEdit ? state.form.submissionEdit.values : null,
  })
)(
  reduxForm({
    form: 'submissionEdit',
  })(SubmissionEditTabbedForm)
);
