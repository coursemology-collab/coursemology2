import React from 'react';
import PropTypes from 'prop-types';
import {
  TableHeaderColumn, TableRow, TableRowColumn,
} from 'material-ui/Table';
import Button from 'material-ui/Button';
import { injectIntl } from 'react-intl';
import grey from 'material-ui/colors/grey';

import styles from './../containers/OnlineEditor/OnlineEditorView.scss';

const grey300 = grey['300'];

class NewPackageFile extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    fileType: PropTypes.string.isRequired,
    filename: PropTypes.string,
    showDeleteButton: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    updateNewPackageFile: PropTypes.func.isRequired,
    deleteNewPackageFile: PropTypes.func.isRequired,
    buttonLabel: PropTypes.string.isRequired,
  }

  static getPackageFileName(fileType) {
    return `question_programming[${fileType}][]`;
  }

  newPackageFileChangeHandler(index) {
    return (e) => {
      const files = e.target.files;
      const filename = files.length === 0 ? null : files[0].name;
      this.props.updateNewPackageFile(this.props.fileType, filename, index);
    };
  }

  render() {
    const { index, filename, showDeleteButton, isLoading } = this.props;
    let deleteButton = null;
    const addFileButtonStyle = {};
    let rowStyle = { borderBottom: 'none' };

    if (showDeleteButton) {
      deleteButton = (
        <Button
          raised
          backgroundColor={grey300}
          icon={<i className="fa fa-trash" />}
          disabled={isLoading}
          onClick={() => { this.props.deleteNewPackageFile(this.props.fileType, index); }}
          style={{ minWidth: '40px', width: '40px' }}
        />
      );
      addFileButtonStyle.display = 'none';
      rowStyle = {};
    }

    return (
      <TableRow style={rowStyle}>
        <TableHeaderColumn className={styles.deleteButtonCell}>
          { deleteButton }
        </TableHeaderColumn>
        <TableRowColumn>
          <Button
            raised
            className={styles.fileInputButton}
            label={this.props.buttonLabel}
            labelPosition="before"
            containerElement="label"
            color="primary"
            disabled={isLoading}
            style={addFileButtonStyle}
          >
            <input
              type="file"
              name={NewPackageFile.getPackageFileName(this.props.fileType)}
              className={styles.uploadInput}
              disabled={isLoading}
              onChange={this.newPackageFileChangeHandler(index)}
            />
          </Button>
          <div style={{ display: 'inline-block' }}>{filename}</div>
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default injectIntl(NewPackageFile);
