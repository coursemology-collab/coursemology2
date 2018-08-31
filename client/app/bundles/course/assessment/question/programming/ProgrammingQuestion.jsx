import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formValueSelector } from 'redux-form';
import { optionShape } from 'lib/components/redux-form/MultiSelect';

import ProgrammingQuestionForm from './containers/ProgrammingQuestionForm/ProgrammingQuestionReduxForm';
import * as programmingQuestionActionCreators from './actions';
import { formNames } from './constants';

class ProgrammingQuestion extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(programmingQuestionActionCreators.fetchQuestion());
  }

  render() {
    console.log(this.props);
    const { dispatch, ...otherProps } = this.props;
    const actions = bindActionCreators(programmingQuestionActionCreators, dispatch);

    if (this.props.isLoading) {
      return null;
    }

    return (
      <ProgrammingQuestionForm
        {...{
          actions,
          ...otherProps,
        }}
      />
    );
  }
}

const selector = formValueSelector(formNames.PROGRAMMING_QUESTION);

function mapStateToProps(state) {
  console.log(state);
  return {
    autograded: selector(state, 'question_programming[autograded]'),
    languageId: selector(state, 'question_programming[language_id]'),
    languages: state.languages,
    skills: state.skills,
    ...state.flags,
  };
}

ProgrammingQuestion.propTypes = {
  languages: PropTypes.arrayOf(PropTypes.any),
  skills: PropTypes.arrayOf(optionShape),

  autograded: PropTypes.bool,
  languageId: PropTypes.number,

  autogradedAssessment: PropTypes.bool.isRequired,
  canEditOnline: PropTypes.bool.isRequired,
  canSwitchPackageType: PropTypes.bool.isRequired,
  displayAutogradedToggle: PropTypes.bool.isRequired,
  hasAutoGradings: PropTypes.bool.isRequired,
  hasSubmissions: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,

  dispatch: PropTypes.func.isRequired,
};

ProgrammingQuestion.defaultProps = {
  autograded: false,
  languageId: 0,
};

export default connect(mapStateToProps)(ProgrammingQuestion);
