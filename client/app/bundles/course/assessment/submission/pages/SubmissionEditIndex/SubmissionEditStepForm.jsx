/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { white, green500, green900, red300, red900 } from 'material-ui/styles/colors';
import { Stepper, Step, StepButton, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';

import { ExplanationProp, QuestionProp, TopicProp } from '../../propTypes';
import SubmissionAnswer from '../../components/SubmissionAnswer';
import QuestionGrade from '../../containers/QuestionGrade';
import GradingPanel from '../../containers/GradingPanel';
import Comments from '../../containers/Comments';
import { SAVE_STATES } from '../../constants';

const styles = {
  questionContainer: {
    marginTop: 20,
  },
  questionCardContainer: {
    padding: 40,
  },
  explanationContainer: {
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 5,
  },
  explanationHeader: {
    borderRadius: '5px 5px 0 0',
    padding: 12,
  },
  formButtonContainer: {
    marginBottom: 20,
  },
  formButton: {
    marginRight: 10,
  },
};

class SubmissionEditStepForm extends Component {

  static isLastQuestion(questionIds, stepIndex) {
    return stepIndex + 1 === questionIds.length;
  }

  constructor(props) {
    super(props);
    this.state = {
      stepIndex: props.maxStep,
    };
  }

  shouldRenderContinueButton() {
    const { stepIndex } = this.state;
    const { questionIds, saveState } = this.props;
    return saveState === SAVE_STATES.Saved &&
      !SubmissionEditStepForm.isLastQuestion(questionIds, stepIndex);
  }

  shouldDisableContinueButton() {
    const { stepIndex } = this.state;
    const { explanations, questionIds, submitting } = this.props;
    const questionId = questionIds[stepIndex];

    if (explanations[questionId] && explanations[questionId].correct && !submitting) {
      return false;
    }
    return true;
  }

  handleNext() {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
    });
  }

  handleStepClick(index) {
    const { skippable, maxStep } = this.props;

    if (skippable || index <= maxStep) {
      this.setState({
        stepIndex: index,
      });
    }
  }

  renderQuestionGrading(id) {
    const { submitted } = this.props;
    if (submitted) {
      return <QuestionGrade id={id} />;
    }
    return null;
  }

  renderGradingPanel() {
    const { submitted } = this.props;
    if (submitted) {
      return <GradingPanel />;
    }
    return null;
  }

  renderExplanationPanel(questionId) {
    const { explanations } = this.props;
    const explanation = explanations[questionId];

    if (explanation) {
      return (
        <Card style={styles.explanationContainer}>
          <CardHeader
            style={{
              ...styles.explanationHeader,
              backgroundColor: explanation.correct ? green500 : red300,
            }}
            title={explanation.correct ? 'Correct!' : 'Wrong!'}
            titleColor={explanation.correct ? green900 : red900}
          />
          <CardText>
            {explanation.explanations.map(exp => <div dangerouslySetInnerHTML={{ __html: exp }} />)}
          </CardText>
        </Card>
      );
    }
    return null;
  }

  renderSubmitButton(answerId) {
    const { submitting, submitted, handleAutograde } = this.props;
    return (
      <RaisedButton
        style={styles.formButton}
        secondary
        label="Submit"
        onTouchTap={() => handleAutograde(answerId)}
        disabled={submitting || submitted}
      />
    );
  }

  renderContinueButton() {
    if (this.shouldRenderContinueButton()) {
      return (
        <RaisedButton
          style={styles.formButton}
          backgroundColor={green500}
          labelColor={white}
          label="Continue"
          onTouchTap={() => this.handleNext()}
          disabled={this.shouldDisableContinueButton()}
        />
      );
    }
    return null;
  }

  renderSaveDraftButton() {
    const { pristine, submitting, submitted, handleSaveDraft } = this.props;
    if (!submitted) {
      return (
        <RaisedButton
          style={styles.formButton}
          primary
          label="Save Draft"
          onTouchTap={handleSaveDraft}
          disabled={pristine || submitting}
        />
      );
    }
    return null;
  }

  renderFinaliseSubmitButton() {
    const { submitting, submitted, handleSubmit } = this.props;
    if (!submitted) {
      return (
        <RaisedButton
          style={styles.formButton}
          secondary
          label="Finalise Submission"
          onTouchTap={handleSubmit}
          disabled={submitting}
        />
      );
    }
    return null;
  }

  renderUnsubmitButton() {
    const { canGrade, submitted, handleUnsubmit } = this.props;
    if (canGrade && submitted) {
      return (
        <RaisedButton
          style={styles.formButton}
          backgroundColor={red900}
          secondary
          label="Unsubmit Submission"
          onTouchTap={handleUnsubmit}
        />
      );
    }
    return null;
  }

  renderStepQuestion() {
    const { stepIndex } = this.state;
    const { canGrade, submitted, questionIds, questions, topics } = this.props;

    const id = questionIds[stepIndex];
    const question = questions[id];
    const { answerId, topicId } = question;
    const topic = topics[topicId];
    return (
      <div>
        <SubmissionAnswer {...{ canGrade, readOnly: submitted, answerId, question }} />
        {this.renderExplanationPanel(id)}
        {this.renderQuestionGrading(id)}
        {this.renderGradingPanel()}
        <div style={styles.formButtonContainer}>
          {this.renderSubmitButton(answerId)}
          {this.renderContinueButton()}
          {this.renderSaveDraftButton()}
        </div>
        <div style={styles.formButtonContainer}>
          {this.renderFinaliseSubmitButton()}
          {this.renderUnsubmitButton()}
        </div>
        <hr />
        <Comments topic={topic} />
      </div>
    );
  }

  renderStepper() {
    const { stepIndex } = this.state;
    const { maxStep } = this.props;
    const { skippable, questionIds } = this.props;

    return (
      <Stepper activeStep={stepIndex} linear={false}>
        {questionIds.map((questionId, index) => {
          if (skippable || index <= maxStep) {
            return (
              <Step key={questionId} active={index <= maxStep}>
                <StepButton onClick={() => this.handleStepClick(index)} />
              </Step>
            );
          }
          return (
            <Step key={questionId}>
              <StepLabel />
            </Step>
          );
        })}
      </Stepper>
    );
  }

  render() {
    return (
      <div style={styles.questionContainer}>
        {this.renderStepper()}
        <Card style={styles.questionCardContainer}>
          <form>{this.renderStepQuestion()}</form>
        </Card>
      </div>
    );
  }
}

SubmissionEditStepForm.propTypes = {
  canGrade: PropTypes.bool.isRequired,
  maxStep: PropTypes.number.isRequired,
  submitted: PropTypes.bool.isRequired,
  pristine: PropTypes.bool,
  skippable: PropTypes.bool.isRequired,
  submitting: PropTypes.bool,
  explanations: PropTypes.objectOf(ExplanationProp),
  questionIds: PropTypes.arrayOf(PropTypes.number),
  questions: PropTypes.objectOf(QuestionProp),
  topics: PropTypes.objectOf(TopicProp),
  saveState: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func,
  handleUnsubmit: PropTypes.func,
  handleSaveDraft: PropTypes.func,
  handleAutograde: PropTypes.func,
};

export default reduxForm({
  form: 'submissionEdit',
})(SubmissionEditStepForm);
