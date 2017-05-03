import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FieldArray, reduxForm } from 'redux-form';

import { SubmissionProp } from '../../propTypes';
import SubmissionAnswer from './SubmissionAnswer';

class SubmissionEditForm extends Component {

  static renderAnswers(props) {
    const { canGrade, fields } = props;
    return (
      <div>
        {
          fields.map((member, index) => {
            const answer = fields.get(index);
            return (
              <SubmissionAnswer
                key={answer.id}
                {...{ canGrade, member, index, fields }}
              />
            );
          })
        }
      </div>
    );
  }

  render() {
    const { canGrade, submission, pristine, submitting, handleSubmit } = this.props;
    return (
      <div>
        <form>
          <FieldArray
            name="answers"
            component={SubmissionEditForm.renderAnswers}
            {...{ canGrade, submission }}
          />
        </form>
        <button onClick={handleSubmit} disabled={pristine || submitting}>Submit</button>
      </div>
    );
  }
}

SubmissionEditForm.propTypes = {
  canGrade: PropTypes.bool,
  submission: SubmissionProp,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default connect(
  state => ({
    formValues: state.form.submissionEdit ? state.form.submissionEdit.values : null,
  })
)(
  reduxForm({
    form: 'submissionEdit',
  })(SubmissionEditForm)
);
