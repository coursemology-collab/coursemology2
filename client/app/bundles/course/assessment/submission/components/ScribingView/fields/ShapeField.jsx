import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FontIcon from 'material-ui-legacy/FontIcon';
import Button from 'material-ui/Button';
import blue from 'material-ui/colors/blue';

import { scribingTranslations as translations } from '../../../translations';
import { scribingShapes } from '../../../constants';

const blue500 = blue['500'];

const propTypes = {
  intl: intlShape.isRequired,
  currentShape: PropTypes.string.isRequired,
  setSelectedShape: PropTypes.func,
};

const ShapeField = (props) => {
  const { intl, currentShape, setSelectedShape } = props;

  return (
    <div>
      <Button
        label={intl.formatMessage(translations.rectangle)}
        primary={currentShape === scribingShapes.RECT}
        onClick={() => (setSelectedShape(scribingShapes.RECT))}
        icon={<FontIcon
          color={currentShape === scribingShapes.RECT ?
            blue500 : 'rgba(0, 0, 0, 0.4)'}
          className="fa fa-square-o"
        />}
      />
      <Button
        label={intl.formatMessage(translations.ellipse)}
        primary={currentShape === scribingShapes.ELLIPSE}
        onClick={() => (setSelectedShape(scribingShapes.ELLIPSE))}
        icon={<FontIcon
          color={currentShape === scribingShapes.ELLIPSE ?
            blue500 : 'rgba(0, 0, 0, 0.4)'}
          className="fa fa-circle-o"
        />}
      />
    </div>
  );
};

ShapeField.propTypes = propTypes;
export default injectIntl(ShapeField);
