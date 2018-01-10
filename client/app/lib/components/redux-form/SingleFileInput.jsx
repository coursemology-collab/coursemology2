import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage, intlShape } from 'react-intl';
import Dropzone from 'react-dropzone';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import InsertDriveFileIcon from 'material-ui-icons/InsertDriveFile';
import grey from 'material-ui/colors/grey';
import createComponent from './createComponent';
import mapError from './mapError';

const grey300 = grey['300'];
const grey400 = grey['400'];

const styles = {
  avatar: {
    marginBottom: 5,
  },
  badge: {
    height: 120,
    marginBottom: 10,
    marginRight: 16,
    width: 150,
  },
  badgeIconActive: {
    backgroundColor: grey400,
  },
  badgeIconInactive: {
    backgroundColor: grey300,
  },
  dropzone: {
    backgroundColor: grey300,
    borderRadius: 5,
    height: 200,
    paddingTop: 15,
    textAlign: 'center',
    width: '100%',
  },
};

const translations = defineMessages({
  dropzone: {
    id: 'components.reduxForm.singleFileInput.dropzone',
    defaultMessage: 'Drag your file here, or click to select file',
  },
  removeFile: {
    id: 'components.reduxForm.singleFileInput.removeFile',
    defaultMessage: 'Remove File',
  },
});

/**
 * Creates a Single file input component for use with Redux Forms.
 *
 * Additional format of form props (see createComponent for base set):
 * {
 *   ...createComponent,
 *   value: {
 *      url, // URL of preview of existing file if it is an image, otherwise nil.
 *     name, // Name of existing file, if any.
 *   },
 * }
 */
// TODO: Use the input element as a controller component - https://reactjs.org/docs/forms.html
class SingleFileInput extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    }),
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
    }),
    intl: intlShape.isRequired,
    accept: PropTypes.string,
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.state = { file: null };
    this.updateStore('');
  }

  onDrop = (files) => {
    this.setState({ file: files[0] }, this.updateStore(files[0]));
  }

  onCancel = () => {
    this.setState({ file: null }, this.updateStore(''));
  }

  updateStore = (file) => {
    const { input: { onChange }, value: { url, name } } = this.props;
    onChange({ file, url, name });
  }

  badgeContent = () => {
    const { intl } = this.props;
    return (
      <IconButton
        tooltip={intl.formatMessage(translations.removeFile)}
        onClick={this.onCancel}
      >
        <CloseIcon />
      </IconButton>
    );
  }

  renderFile = () => {
    const { value: { url, name } } = this.props;
    const isChanged = this.state.file !== null;
    const isImage = isChanged && this.state.file.type.includes('image/');
    const fileName = isChanged ? this.state.file.name : name;

    const avatarProps = { size: 100, style: styles.avatar };
    if (isImage) {
      avatarProps.src = this.state.file.preview;
    } else if (url) {
      avatarProps.src = url;
    } else {
      avatarProps.icon = (<InsertDriveFileIcon />);
    }

    return (
      <div>
        <Badge
          badgeContent={isChanged && this.badgeContent()}
          badgeStyle={isChanged ? styles.badgeIconActive : styles.badgeIconInactive}
          style={styles.badge}
        >
          <Avatar {...avatarProps} />
          <div className="file-name">
            {fileName}
            {fileName && fileName.length > 0 && <br />}
          </div>
        </Badge>
        <div>
          <FormattedMessage {...translations.dropzone} />
        </div>
      </div>
    );
  }

  render() {
    const { children, accept } = this.props;
    return (
      <Dropzone
        multiple={false}
        onDrop={this.onDrop}
        style={styles.dropzone}
        accept={accept}
      >
        { children || this.renderFile }
      </Dropzone>
    );
  }
}

const mapProps = ({ ...props }) => ({
  ...props,
  ...mapError(props),
});

export default createComponent(SingleFileInput, mapProps);
