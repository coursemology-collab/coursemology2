import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import grey from 'material-ui/colors/grey';

import { questionGradeShape, questionShape } from '../propTypes';
import actionTypes from '../constants';

const grey100 = grey['100'];

const styles = {
  container: {
    marginTop: 20,
  },
};

class VisibleQuestionGrade extends Component {
  static propTypes = {
    editable: PropTypes.bool.isRequired,
    grading: questionGradeShape,
    id: PropTypes.number.isRequired,
    question: questionShape,
    updateGrade: PropTypes.func.isRequired,
  };

  handleGradingField(value) {
    const { id, question, updateGrade } = this.props;
    const maxGrade = question.maximumGrade;
    const parsedValue = parseFloat(value);

    if (Number.isNaN(parsedValue) || parsedValue < 0) {
      updateGrade(id, 0);
    } else if (parsedValue > maxGrade) {
      updateGrade(id, maxGrade);
    } else {
      updateGrade(id, parseFloat(parsedValue.toFixed(1)));
    }
  }

  renderQuestionGrade() {
    const { question, grading } = this.props;
    return (
      <div style={{ display: 'inline-block', paddingLeft: 10 }}>
        {`${grading.grade} / ${question.maximumGrade}`}
      </div>
    );
  }

  renderQuestionGradeField() {
    const { question, grading } = this.props;
    const initialGrade = grading.grade;
    const maxGrade = question.maximumGrade;

    return (
      <div style={{ display: 'inline-block', paddingLeft: 10 }}>
        <input
          style={{ width: 100 }}
          className="grade"
          type="number"
          min={0}
          max={maxGrade}
          step={1}
          value={initialGrade === null ? '' : initialGrade}
          onChange={e => this.handleGradingField(e.target.value)}
          ref={(ref) => {
            this.inputRef = ref;
          }}
          onWheel={() => this.inputRef.blur()}
        />
        {` / ${maxGrade}`}
      </div>
    );
  }

  render() {
    const { grading, editable } = this.props;

    if (!grading) {
      return null;
    }

    return (
      <Paper style={styles.container}>
        <div style={{ backgroundColor: grey100, display: 'inline-block', padding: 20 }}>
          Grading
        </div>
        {editable ? this.renderQuestionGradeField() : this.renderQuestionGrade()}
      </Paper>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { id } = ownProps;
  return {
    question: state.questions[id],
    grading: state.grading.questions[id],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateGrade: (id, grade) => dispatch({ type: actionTypes.UPDATE_GRADING, id, grade }),
  };
}

const QuestionGrade = connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibleQuestionGrade);
export default QuestionGrade;
