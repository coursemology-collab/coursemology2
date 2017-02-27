import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import ScribingQuestionForm from './components/ScribingQuestionForm';
import * as scribingQuestionActionCreators from './actions/scribingQuestionActionCreators';


function mapStateToProps(state) {
  return state.toObject();
}

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  scribingQuestion: PropTypes.instanceOf(Immutable.Map).isRequired,
};

const ScribingQuestion = (props) => {
  const { dispatch, scribingQuestion } = props;
  const actions = bindActionCreators(scribingQuestionActionCreators, dispatch);

  return (
    <ScribingQuestionForm
      {...{
        actions,
        data: scribingQuestion
      }}
    />
  );
};

ScribingQuestion.propTypes = propTypes;

export default connect(mapStateToProps)(ScribingQuestion);
