import { PropTypes } from 'react';

const OptionProp =
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    option: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
  });

const AnswerProp =
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    allowAttachment: PropTypes.bool,
    answerText: PropTypes.string,
    attachment: PropTypes.string,
    options: PropTypes.arrayOf(OptionProp),
  });

export const QuestionProp =
  PropTypes.shape({
    answer: AnswerProp.isRequired,
    description: PropTypes.string.isRequired,
    displayTitle: PropTypes.string.isRequired,
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
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: QuestionProp,
      })
    ),
  });

export const ProgressProp =
  PropTypes.shape({
    actionAt: PropTypes.string,
    courseUser: PropTypes.string,
    late: PropTypes.bool,
    workflowState: PropTypes.string,
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
