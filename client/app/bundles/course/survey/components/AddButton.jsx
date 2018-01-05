import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import ContentAdd from 'material-ui-icons/Add';

const styles = {
  floatingButton: {
    position: 'fixed',
    bottom: 40,
    right: 40,
  },
};

const propTypes = {
  onClick: PropTypes.func,
};

const AddButton = ({ onClick }) => (
  <Button fab style={styles.floatingButton} {...{ onClick }}>
    <ContentAdd />
  </Button>
);

AddButton.propTypes = propTypes;

export default AddButton;
