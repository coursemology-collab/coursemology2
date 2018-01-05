import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import { TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Button from 'material-ui/Button';
import DeleteIcon from 'material-ui-icons/Delete';
import TextField from 'material-ui/TextField';
import grey from 'material-ui/colors/grey';

const grey300 = grey['300'];

const translations = defineMessages({
  zeroThresholdError: {
    id: 'course.level.LevelRow.zeroThresholdError',
    defaultMessage: 'Experience points threshold cannot be 0',
  },
});

const styles = {
  deleteButtonCell: {
    paddingLeft: 0,
    textAlign: 'right',
    verticalAlign: 'middle',
    width: '50px',
  },
  levelNumber: {
    fontSize: '16px',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
};

class LevelRow extends React.Component {
  static propTypes = {
    levelNumber: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    experiencePointsThreshold: PropTypes.number.isRequired,
    updateExpThreshold: PropTypes.func.isRequired,
    sortLevels: PropTypes.func.isRequired,
    deleteLevel: PropTypes.func.isRequired,
  }

  renderInput(levelNumber, experiencePointsThreshold) {
    return (
      <TextField
        type="text"
        name={`level_${levelNumber}`}
        onChange={(e, newValue) => {
          this.props.updateExpThreshold(levelNumber, newValue);
        }}
        disabled={this.props.disabled}
        errorText={experiencePointsThreshold === 0 ? <FormattedMessage {...translations.zeroThresholdError} /> : ''}
        onBlur={() => { this.props.sortLevels(); }}
        value={experiencePointsThreshold}
      />
    );
  }

  render() {
    const { levelNumber, experiencePointsThreshold } = this.props;
    return (
      <TableRow>
        <TableRowColumn style={styles.levelNumber}>{ levelNumber }</TableRowColumn>
        <TableRowColumn>{ this.renderInput(levelNumber, experiencePointsThreshold) }</TableRowColumn>
        <TableHeaderColumn style={styles.deleteButtonCell}>
          <Button
            raised
            id={`delete_${levelNumber}`}
            name={`delete_${levelNumber}`}
            backgroundColor={grey300}
            icon={<DeleteIcon />}
            onClick={this.props.deleteLevel(levelNumber)}
            disabled={this.props.disabled}
            style={{ minWidth: '40px', width: '40px' }}
          />
        </TableHeaderColumn>
      </TableRow>
    );
  }
}

export default LevelRow;
