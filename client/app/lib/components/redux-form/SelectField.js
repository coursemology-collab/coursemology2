import Select from 'material-ui/Select';
import createComponent from './createComponent';
import mapError from './mapError';

export default createComponent(
  Select,
  ({ input: { onChange, ...inputProps }, onChange: onChangeFromField, ...props }) => ({
    floatingLabelFixed: true,
    ...mapError(props),
    ...inputProps,
    onChange: (event, index, value) => {
      onChange(value);
      if (onChangeFromField) {
        onChangeFromField(value);
      }
    },
  })
);
