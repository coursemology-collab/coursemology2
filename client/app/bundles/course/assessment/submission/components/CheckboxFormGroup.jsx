/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react';
import { ReduxFormInputProp } from '../propTypes';

export default class CheckboxFormGroup extends Component {
  render() {
    const { options, input } = this.props;
    return (
      <div>
        {/* replace opt.option with opt.id */}
        {options.map((opt, index) =>
          <div key={opt.option}>
            <label>
              <input
                type="checkbox"
                name={`${input.name}[${index}]`}
                value={opt.option}
                checked={input.value.indexOf(opt.option) !== -1}
                onChange={(event) => {
                  const newValue = [...input.value];
                  if (event.target.checked) {
                    newValue.push(opt.option);
                  } else {
                    newValue.splice(newValue.indexOf(opt.option), 1);
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
