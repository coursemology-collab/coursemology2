import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import AceEditor from 'react-ace';

class Editor extends Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    filename: PropTypes.string,
    language: PropTypes.string.isRequired,
    input: PropTypes.shape({
      onChange: PropTypes.func,
    }).isRequired,
  }

  static defaultProps = {
    readOnly: false,
  };

  render() {
    const { readOnly, filename, language, input: { onChange, value } } = this.props;
    return (
      <AceEditor
        name={filename}
        mode={language}
        theme="github"
        width="100%"
        minLines={25}
        maxLines={25}
        value={value}
        onChange={newValue => onChange(newValue)}
        editorProps={{ $blockScrolling: true }}
        setOptions={{ useSoftTabs: true }}
        readOnly={readOnly}
        style={{ marginBottom: 10 }}
      />
    );
  }
}

export default props => <Field {...props} component={Editor} />;
