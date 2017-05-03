import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import AceEditor from 'react-ace';

class Editor extends Component {
  static propTypes = {
    name: PropTypes.string,
    content: PropTypes.string,
    language: PropTypes.string.isRequired,
    input: PropTypes.shape({
      onChange: PropTypes.func,
    }).isRequired,
  }

  render() {
    const { name, content, language, input: { onChange } } = this.props;
    return (
      <AceEditor
        name={name}
        mode={language}
        theme="github"
        width="100%"
        minLines={25}
        maxLines={25}
        value={content}
        onChange={value => onChange(value)}
        editorProps={{ $blockScrolling: true }}
        setOptions={{ useSoftTabs: true }}
      />
    );
  }
}

export default props => <Field {...props} component={Editor} />;
