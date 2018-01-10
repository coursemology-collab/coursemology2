import React from 'react';
import PropTypes from 'prop-types';
import MaterialSwitch from 'material-ui/Switch';
import red from 'material-ui/colors/red';
import createComponent from './createComponent';
import mapError from './mapError';

const red500 = red['500'];

const errorStyle = {
  color: red500,
};

// Toggle implementation with an error displayed at the bottom.
const Toggle = ({ errorText, ...props }) => (
  <div>
    <MaterialSwitch {...props} />
    {
        errorText &&
        <div style={errorStyle}>{errorText}</div>
      }
  </div>
);

Toggle.propTypes = {
  errorText: PropTypes.string,
};

export default createComponent(
  Toggle,
  ({
    input: {
      onChange,
      value,
      ...inputProps
    },
    ...props
  }) => ({
    // Take out the required fields and send the rest of the props to mapError().
    ...mapError({ ...props, input: inputProps }),
    checked: !!value,
    onChange,
  })
);
