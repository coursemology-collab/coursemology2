/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react';
import { ReduxFormInputProp } from '../propTypes';

export default class CheckboxFormGroup extends Component {
  render() {
    const { options, input } = this.props;
    return (
      <div>
        {options.map((opt, index) =>
          <div key={opt.id}>
            <label>
              <input
                type="checkbox"
                name={`${input.name}[${index}]`}
                value={opt.id}
                checked={input.value.indexOf(opt.id) !== -1}
                onChange={(event) => {
                  const newValue = [...input.value];
                  if (event.target.checked) {
                    newValue.push(opt.id);
                  } else {
                    newValue.splice(newValue.indexOf(opt.id), 1);
                  }
                  return input.onChange(newValue);
                }}
              />
              <div dangerouslySetInnerHTML={{ __html: opt.option.trim() }} />
            </label>
          </div>
        )}
      </div>
    );
  }
}

CheckboxFormGroup.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    option: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
  })).isRequired,
  input: ReduxFormInputProp,
};
