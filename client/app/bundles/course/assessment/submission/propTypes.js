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

const FileProp =
  PropTypes.shape({
    content: PropTypes.string,
    filename: PropTypes.string,
  });

const TestCaseProp =
  PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    expression: PropTypes.string.isRequired,
    expected: PropTypes.string.isRequired,
    hint: PropTypes.string,
    type: PropTypes.string.isRequired,
  });

export const AnswerProp =
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    allowAttachment: PropTypes.bool,
    answerText: PropTypes.string,
    attachment: PropTypes.object,
    files: PropTypes.arrayOf(FileProp),
    language: PropTypes.string,
    options: PropTypes.arrayOf(OptionProp),
    question: QuestionProp.isRequired,
    testCases: PropTypes.arrayOf(TestCaseProp),
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
