import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Card } from 'material-ui/Card';
import { Stepper, Step, StepLabel } from 'material-ui/Stepper';

import { SubmissionProp } from '../../propTypes';
import SubmissionAnswer from '../../components/SubmissionAnswer';

class SubmissionEditTabbedForm extends Component {

  static isLastQuestion(answers, stepIndex) {
    return stepIndex + 1 === answers.length;
  }

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

  handleStepClick(index) {
    const { stepIndex } = this.state;
    if (index < stepIndex) {
      this.setState({
        stepIndex: index,
      });
    }
  }

  handleQuestionSubmit() {
    const { stepIndex } = this.state;
    const { submission: { answers }, handleSubmit } = this.props;

    handleSubmit();
    if (!SubmissionEditTabbedForm.isLastQuestion(answers, stepIndex)) {
      this.handleNext();
    }
  }

  render() {
    const { stepIndex } = this.state;
    const { canGrade, submission: { answers }, pristine, submitting } = this.props;
    return (
      <div>
        <Stepper activeStep={stepIndex}>
          {answers.map((answer, index) =>
            <Step key={answer.id} onClick={() => this.handleStepClick(index)}>
              <StepLabel />
            </Step>
          )}
        </Stepper>
        <Card>
          <form>
            <Field
              name={`answers[${stepIndex}]`}
              component={SubmissionEditTabbedForm.renderAnswers}
              {...{ canGrade, answer: answers[stepIndex] }}
            />
          </form>
          <button onClick={() => this.handleQuestionSubmit()} disabled={pristine || submitting}>Submit</button>
        </Card>
      </div>
    );
  }
}

SubmissionEditTabbedForm.propTypes = {
  canGrade: PropTypes.bool.isRequired,
  skippable: PropTypes.bool.isRequired,
  submission: SubmissionProp,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'submissionEdit',
})(SubmissionEditTabbedForm);
