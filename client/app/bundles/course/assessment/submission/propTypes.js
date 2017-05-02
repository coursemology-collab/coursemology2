import { PropTypes } from 'react';

export const QuestionProp =
PropTypes.shape({
  description: PropTypes.string.isRequired,
  displayTitle: PropTypes.string.isRequired,
});

const OptionProp =
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    option: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
  });

export const AnswerProp =
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    allowAttachment: PropTypes.bool,
    answerText: PropTypes.string,
    attachment: PropTypes.string,
    options: PropTypes.arrayOf(OptionProp),
    question: QuestionProp.isRequired,
    type: PropTypes.string.isRequired,
  });

export const AssessmentProp =
  PropTypes.shape({
    autograded: PropTypes.bool,
    delayedGradePublication: PropTypes.bool,
    description: PropTypes.string,
    password: PropTypes.string,
    passwordProtected: PropTypes.bool,
    published: PropTypes.bool,
  });

export const ProgressProp =
  PropTypes.shape({
    attemptedAt: PropTypes.string,
    basePoints: PropTypes.number,
    dueAt: PropTypes.string,
    grade: PropTypes.number,
    gradedAt: PropTypes.string,
    grader: PropTypes.string,
    late: PropTypes.bool,
    maximumGrade: PropTypes.number,
    pointsAwarded: PropTypes.number,
    submittedAt: PropTypes.string,
    submitter: PropTypes.string,
    workflowState: PropTypes.string,
  });

export const SubmissionProp =
  PropTypes.shape({
    answers: PropTypes.arrayOf(AnswerProp),
  });

export const ReduxFormProp =
  PropTypes.shape({
    registeredField: PropTypes.object,
    values: PropTypes.any,
  });

export const ReduxFormInputProp =
  PropTypes.shape({
    checked: PropTypes.bool,
    name: PropTypes.name,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrop: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.any,
  });
