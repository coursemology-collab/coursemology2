/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import Checkbox from 'lib/components/redux-form/Checkbox';

export default class CheckboxFormGroup extends Component {

  render() {
    const { fields } = this.props;
    return (
      <div>
        {
          fields.map((member, index) => {
            const option = fields.get(index);
            return (
              <div key={option.id}>
                <label>
                  <Field
                    name={`${member}[selected]`}
                    component={Checkbox}
                  />
                  <div dangerouslySetInnerHTML={{ __html: option.option.trim() }} />
                </label>
              </div>
            );
          })
        }
      </div>
    );
  }
}

CheckboxFormGroup.propTypes = {
  fields: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
};
