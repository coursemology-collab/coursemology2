import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {
  TableHeaderColumn, TableRow, TableRowColumn,
} from 'material-ui/Table';
import Button from 'material-ui/Button';
import grey from 'material-ui/colors/grey';
import { white } from 'material-ui/colors/common';

import styles from './../containers/OnlineEditor/OnlineEditorView.scss';
import { formatBytes } from './../reducers/utils';

const grey100 = grey['100'];
const grey300 = grey['300'];

function ExistingPackageFile(props) {
  const { filename, fileType, filesize, toDelete, deleteExistingPackageFile, isLoading, isLast } = props;
  const buttonClass = toDelete ? 'fa fa-undo' : 'fa fa-trash';
  const buttonColor = toDelete ? white : grey300;
  const rowStyle = toDelete ?
    { textDecoration: 'line-through', backgroundColor: grey100 } : {};
  if (isLast) {
    rowStyle.borderBottom = 'none';
  }

  return (
    <TableRow style={rowStyle}>
      <TableHeaderColumn className={styles.deleteButtonCell}>
        <Button
          raised
          backgroundColor={buttonColor}
          icon={<i className={buttonClass} />}
          disabled={isLoading}
          onClick={() => { deleteExistingPackageFile(props.fileType, filename, !toDelete); }}
          style={{ minWidth: '40px', width: '40px' }}
        />
        <input
          type="checkbox"
          hidden
          name={`question_programming[${`${fileType}_to_delete`}][${filename}]`}
          checked={toDelete}
        />
      </TableHeaderColumn>
      <TableRowColumn>{filename}</TableRowColumn>
      <TableRowColumn>{formatBytes(filesize, 2)}</TableRowColumn>
    </TableRow>
  );
}

ExistingPackageFile.propTypes = {
  filename: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  filesize: PropTypes.number.isRequired,
  toDelete: PropTypes.bool.isRequired,
  deleteExistingPackageFile: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
};

export default injectIntl(ExistingPackageFile);
