import { PropTypes } from 'react';

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

const QuestionProp =
  PropTypes.shape({
    description: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
  });
