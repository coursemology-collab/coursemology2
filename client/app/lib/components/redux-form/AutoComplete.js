import AutoComplete from 'material-ui-legacy/AutoComplete';
import createComponent from './createComponent';
import mapError from './mapError';

const mapProps = props => ({
  ...mapError(props),
  floatingLabelFixed: true,
  searchText: props.input.value,
  onNewRequest: props.input.onChange,
  onUpdateInput: props.input.onChange,
});

export default createComponent(AutoComplete, mapProps);
