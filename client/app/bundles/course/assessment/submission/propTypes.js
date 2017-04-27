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
    allow_attachment: PropTypes.bool,
    answer_text: PropTypes.string,
    attachment: PropTypes.string,
    options: PropTypes.arrayOf(OptionProp),
  });

export const QuestionProp =
  PropTypes.shape({
    answer: AnswerProp.isRequired,
    description: PropTypes.string.isRequired,
    display_title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  });

export const AssessmentProp =
  PropTypes.shape({
    autograded: PropTypes.bool,
    delayed_grade_publication: PropTypes.bool,
    description: PropTypes.string,
    password: PropTypes.string,
    password_protected: PropTypes.bool,
    published: PropTypes.bool,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: QuestionProp,
      })
    ),
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
