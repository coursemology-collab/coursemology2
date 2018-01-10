import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';
import { Element, scroller } from 'react-scroll';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import red from 'material-ui/colors/red';
import yellow from 'material-ui/colors/yellow';
import grey from 'material-ui/colors/grey';
import blue from 'material-ui/colors/blue';
import common from 'material-ui/colors/common';

import ConfirmationDialog from 'lib/components/ConfirmationDialog';
import { explanationShape, questionShape, questionFlagsShape,
  questionGradeShape, topicShape } from '../../propTypes';
import SubmissionAnswer from '../../components/SubmissionAnswer';
import QuestionGrade from '../../containers/QuestionGrade';
import GradingPanel from '../../containers/GradingPanel';
import Comments from '../../containers/Comments';
import { formNames, questionTypes } from '../../constants';
import translations from '../../translations';
import submissionFormValidate from './submissionFormValidate';

const red100 = red['100'];
const red200 = red['200'];
const red900 = red['900'];
const yellow900 = yellow['900'];
const grey100 = grey['100'];
const blue500 = blue['500'];
const white = common.white;

const styles = {
  questionCardContainer: {
    marginTop: 20,
    padding: 40,
  },
  explanationContainer: {
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 5,
  },
  questionContainer: {
    paddingTop: 10,
  },
  formButton: {
    marginBottom: 10,
    marginRight: 10,
  },
};

class SubmissionEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examNotice: props.newSubmission && props.passwordProtected,
      submitConfirmation: false,
      unsubmitConfirmation: false,
      resetConfirmation: false,
      resetAnswerId: null,
    };
  }

  componentDidMount() {
    const { questionIds, tabbedView } = this.props;
    let initialStep = this.props.step;

    if (initialStep !== null && !tabbedView) {
      initialStep = initialStep < 0 ? 0 : initialStep;
      initialStep = initialStep >= questionIds.length - 1 ? questionIds.length - 1 : initialStep;
      scroller.scrollTo(`step${initialStep}`, { offset: -60 });
    }
  }

  renderQuestionGrading(id) {
    const { attempting, published, graderView } = this.props;
    const editable = !attempting && graderView;
    const visible = editable || published;

    return visible ? <QuestionGrade id={id} editable={editable} /> : null;
  }

  renderProgrammingQuestionActions(id) {
    const { intl, attempting, graderView, questions, questionsFlags,
      handleSubmitAnswer, isSaving } = this.props;
    const question = questions[id];
    const { answerId, attemptsLeft, attemptLimit, autogradable } = question;
    const { jobError, isAutograding, isResetting } = questionsFlags[id] || {};

    if (!attempting) {
      return null;
    }

    if (question.type === questionTypes.Programming) {
      const runCodeLabel = attemptLimit ?
        intl.formatMessage(translations.runCodeWithLimit, { attemptsLeft }) :
        intl.formatMessage(translations.runCode);

      return (
        <div>
          {jobError ?
            <Paper style={{ padding: 10, backgroundColor: red100, marginBottom: 20 }}>
              {intl.formatMessage(translations.autogradeFailure)}
            </Paper>
          : null}
          <Button
            raised
            style={styles.formButton}
            backgroundColor={white}
            label={intl.formatMessage(translations.reset)}
            onClick={() => this.setState({ resetConfirmation: true, resetAnswerId: answerId })}
            disabled={isAutograding || isResetting || isSaving}
          />
          {autogradable ? <Button
            raised
            style={styles.formButton}
            backgroundColor={red900}
            color="accent"
            label={runCodeLabel}
            onClick={() => handleSubmitAnswer(answerId)}
            disabled={isAutograding || isResetting || isSaving || (!graderView && attemptsLeft === 0)}
          /> : null}
          {isAutograding || isResetting ? <CircularProgress size={36} style={{ position: 'absolute' }} /> : null}
        </div>
      );
    }
    return null;
  }

  renderExplanationPanel(questionId) {
    const { intl, explanations, attempting } = this.props;
    const explanation = explanations[questionId];

    if (explanation && explanation.correct === false && attempting) {
      let title = '';
      if (explanation.failureType === 'public_test') {
        title = intl.formatMessage(translations.publicTestCaseFailure);
      } else if (explanation.failureType === 'private_test') {
        title = intl.formatMessage(translations.privateTestCaseFailure);
      } else {
        return null;
      }

      return (
        <Card style={styles.explanationContainer}>
          <CardHeader
            style={{
              ...styles.explanationHeader,
              backgroundColor: red200,
            }}
            title={title}
            titleColor={red900}
          />
          { explanation.explanations.every(exp => exp.trim().length === 0) ? null :
          <CardText>
            {explanation.explanations.map(exp => <div dangerouslySetInnerHTML={{ __html: exp }} />)}
          </CardText> }
        </Card>
      );
    }
    return null;
  }

  renderTabbedQuestions() {
    const { intl, attempting, questionIds, questions, topics, step } = this.props;

    let initialStep = step || 0;
    initialStep = initialStep < 0 ? 0 : initialStep;
    initialStep = initialStep >= questionIds.length - 1 ? questionIds.length - 1 : initialStep;

    return (
      <Tabs
        inkBarStyle={{ backgroundColor: blue500, height: 5, marginTop: -5 }}
        tabItemContainerStyle={{ backgroundColor: grey100 }}
        initialSelectedIndex={initialStep}
      >
        {questionIds.map((id, index) => {
          const question = questions[id];
          const { answerId, topicId } = question;
          const topic = topics[topicId];
          return (
            <Tab
              buttonStyle={{ color: blue500 }}
              key={id}
              label={intl.formatMessage(translations.questionNumber, { number: index + 1 })}
            >
              <SubmissionAnswer {...{ readOnly: !attempting, answerId, question }} />
              {question.type === questionTypes.Programming ? this.renderExplanationPanel(id) : null}
              {this.renderQuestionGrading(id)}
              {this.renderProgrammingQuestionActions(id)}
              <Comments topic={topic} />
              <hr />
            </Tab>
          );
        })}
      </Tabs>
    );
  }

  renderQuestions() {
    const { attempting, questionIds, questions, topics, graderView } = this.props;
    return (
      <div>
        {questionIds.map((id, index) => {
          const question = questions[id];
          const { answerId, topicId } = question;
          const topic = topics[topicId];
          return (
            <Element name={`step${index}`} key={id} style={styles.questionContainer}>
              <SubmissionAnswer {...{ readOnly: !attempting, answerId, question, graderView }} />
              {question.type === questionTypes.Programming ? this.renderExplanationPanel(id) : null}
              {this.renderQuestionGrading(id)}
              {this.renderProgrammingQuestionActions(id)}
              <Comments topic={topic} />
              <hr />
            </Element>
          );
        })}
      </div>
    );
  }

  renderGradingPanel() {
    const { attempting } = this.props;
    if (!attempting) {
      return <GradingPanel />;
    }
    return null;
  }

  renderSaveDraftButton() {
    const { intl, pristine, attempting, handleSaveDraft, isSaving } = this.props;
    if (attempting) {
      return (
        <Button
          raised
          style={styles.formButton}
          color="primary"
          label={intl.formatMessage(translations.saveDraft)}
          onClick={handleSaveDraft}
          disabled={pristine || isSaving}
        />
      );
    }
    return null;
  }

  renderSaveGradeButton() {
    const { intl, graderView, attempting, handleSaveGrade, isSaving } = this.props;
    if (graderView && !attempting) {
      return (
        <Button
          raised
          style={styles.formButton}
          color="primary"
          label={intl.formatMessage(translations.saveGrade)}
          onClick={handleSaveGrade}
          disabled={isSaving}
        />
      );
    }
    return null;
  }

  renderAutogradeSubmissionButton() {
    const { intl, graderView, submitted, handleAutogradeSubmission,
      isAutograding, isSaving } = this.props;
    if (graderView && submitted) {
      const progressIcon = <CircularProgress size={24} />;

      return (
        <Button
          raised
          style={styles.formButton}
          color="primary"
          label={intl.formatMessage(translations.autograde)}
          icon={isAutograding ? progressIcon : null}
          onClick={handleAutogradeSubmission}
          disabled={isSaving || isAutograding}
        />
      );
    }
    return null;
  }

  renderSubmitButton() {
    const { intl, canUpdate, attempting, isSaving } = this.props;
    if (attempting && canUpdate) {
      return (
        <Button
          raised
          style={styles.formButton}
          color="accent"
          label={intl.formatMessage(translations.finalise)}
          onClick={() => this.setState({ submitConfirmation: true })}
          disabled={isSaving}
        />
      );
    }
    return null;
  }

  renderUnsubmitButton() {
    const { intl, graderView, submitted, published, isSaving } = this.props;
    if (graderView && (submitted || published)) {
      return (
        <Button
          raised
          style={styles.formButton}
          backgroundColor={red900}
          color="accent"
          label={intl.formatMessage(translations.unsubmit)}
          onClick={() => this.setState({ unsubmitConfirmation: true })}
          disabled={isSaving}
        />
      );
    }
    return null;
  }

  renderMarkButton() {
    const { intl, delayedGradePublication, grading,
      graderView, submitted, handleMark, isSaving } = this.props;
    if (delayedGradePublication && graderView && submitted) {
      const anyUngraded = Object.values(grading).some(
        q => q.grade === undefined || q.grade === null
      );
      return (
        <Button
          raised
          style={styles.formButton}
          backgroundColor={yellow900}
          labelColor={white}
          label={intl.formatMessage(translations.mark)}
          onClick={handleMark}
          disabled={isSaving || anyUngraded}
        />
      );
    }
    return null;
  }

  renderUnmarkButton() {
    const { intl, graderView, graded, handleUnmark, isSaving } = this.props;
    if (graderView && graded) {
      return (
        <Button
          raised
          style={styles.formButton}
          backgroundColor={yellow900}
          labelColor={white}
          label={intl.formatMessage(translations.unmark)}
          onClick={handleUnmark}
          disabled={isSaving}
        />
      );
    }
    return null;
  }

  renderPublishButton() {
    const { intl, delayedGradePublication, graderView, grading,
      submitted, handlePublish, isSaving } = this.props;
    if (!delayedGradePublication && graderView && submitted) {
      const anyUngraded = Object.values(grading).some(
        q => q.grade === undefined || q.grade === null
      );

      return (
        <Button
          raised
          style={styles.formButton}
          backgroundColor={red900}
          color="accent"
          label={intl.formatMessage(translations.publish)}
          onClick={handlePublish}
          disabled={isSaving || anyUngraded}
        />
      );
    }
    return null;
  }

  renderSubmitDialog() {
    const { submitConfirmation } = this.state;
    const { intl, handleSubmit } = this.props;
    return (
      <ConfirmationDialog
        open={submitConfirmation}
        onCancel={() => this.setState({ submitConfirmation: false })}
        onConfirm={() => {
          this.setState({ submitConfirmation: false });
          handleSubmit();
        }}
        message={intl.formatMessage(translations.submitConfirmation)}
      />
    );
  }

  renderUnsubmitDialog() {
    const { unsubmitConfirmation } = this.state;
    const { intl, handleUnsubmit } = this.props;
    return (
      <ConfirmationDialog
        open={unsubmitConfirmation}
        onCancel={() => this.setState({ unsubmitConfirmation: false })}
        onConfirm={() => {
          this.setState({ unsubmitConfirmation: false });
          handleUnsubmit();
        }}
        message={intl.formatMessage(translations.unsubmitConfirmation)}
      />
    );
  }

  renderResetDialog() {
    const { resetConfirmation, resetAnswerId } = this.state;
    const { intl, handleReset } = this.props;
    return (
      <ConfirmationDialog
        open={resetConfirmation}
        onCancel={() => this.setState({ resetConfirmation: false, resetAnswerId: null })}
        onConfirm={() => {
          this.setState({ resetConfirmation: false, resetAnswerId: null });
          handleReset(resetAnswerId);
        }}
        message={intl.formatMessage(translations.resetConfirmation)}
      />
    );
  }

  renderExamDialog() {
    const { intl } = this.props;

    return (
      <Dialog
        title={intl.formatMessage(translations.examDialogTitle)}
        actions={
          <Button
            color="primary"
            label="OK"
            onClick={() => this.setState({ examNotice: false })}
          />
        }
        modal
        open={this.state.examNotice}
      >
        {intl.formatMessage(translations.examDialogMessage)}
      </Dialog>
    );
  }

  render() {
    const { tabbedView } = this.props;
    return (
      <Card style={styles.questionCardContainer}>
        <form>{tabbedView ? this.renderTabbedQuestions() : this.renderQuestions()}</form>
        {this.renderGradingPanel()}

        {this.renderSaveDraftButton()}
        {this.renderSaveGradeButton()}
        {this.renderAutogradeSubmissionButton()}
        {this.renderSubmitButton()}
        {this.renderUnsubmitButton()}
        {this.renderMarkButton()}
        {this.renderUnmarkButton()}
        {this.renderPublishButton()}

        {this.renderSubmitDialog()}
        {this.renderUnsubmitDialog()}
        {this.renderResetDialog()}
        {this.renderExamDialog()}
      </Card>
    );
  }
}

SubmissionEditForm.propTypes = {
  intl: intlShape.isRequired,

  graderView: PropTypes.bool.isRequired,
  canUpdate: PropTypes.bool.isRequired,
  delayedGradePublication: PropTypes.bool.isRequired,
  newSubmission: PropTypes.bool.isRequired,
  passwordProtected: PropTypes.bool.isRequired,
  tabbedView: PropTypes.bool.isRequired,
  step: PropTypes.number,

  attempting: PropTypes.bool.isRequired,
  submitted: PropTypes.bool.isRequired,
  graded: PropTypes.bool.isRequired,
  published: PropTypes.bool.isRequired,

  explanations: PropTypes.objectOf(explanationShape),
  grading: PropTypes.objectOf(questionGradeShape),
  questionIds: PropTypes.arrayOf(PropTypes.number),
  questions: PropTypes.objectOf(questionShape),
  questionsFlags: PropTypes.objectOf(questionFlagsShape),
  topics: PropTypes.objectOf(topicShape),
  isAutograding: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool,

  handleAutogradeSubmission: PropTypes.func,
  handleSaveDraft: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleUnsubmit: PropTypes.func,
  handleSubmitAnswer: PropTypes.func,
  handleReset: PropTypes.func,
  handleSaveGrade: PropTypes.func,
  handleMark: PropTypes.func,
  handleUnmark: PropTypes.func,
  handlePublish: PropTypes.func,
};

export default reduxForm({
  form: formNames.SUBMISSION,
  validate: submissionFormValidate,
})(injectIntl(SubmissionEditForm));
