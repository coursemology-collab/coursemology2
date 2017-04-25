import { PropTypes } from 'react';

export const QuestionProp =
PropTypes.shape({
  description: PropTypes.string,
  display_title: PropTypes.string,
  type: PropTypes.string,
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
