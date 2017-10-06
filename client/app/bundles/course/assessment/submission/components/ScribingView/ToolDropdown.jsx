import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import MaterialTooltip from 'material-ui/internal/Tooltip';
import { blue500 } from 'material-ui/styles/colors';

const propTypes = {
  activeObject: PropTypes.object,
  disabled: PropTypes.bool.isRequired,
  toolType: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  showTooltip: PropTypes.bool,
  currentTool: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onClickIcon: PropTypes.func,
  onTouchTapChevron: PropTypes.func,
  colorBarBorder: PropTypes.string,
  colorBarBackground: PropTypes.string,
  iconClassname: PropTypes.string,
  iconComponent: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

const style = {
  tool: {
    position: 'relative',
    display: 'inline-block',
    paddingRight: '24px',
    outline: 'none',
  },
  innerTool: {
    display: 'inline-block',
    outline: 'none',
  },
  colorBar: {
    width: '23px',
    height: '8px',
  },
  chevron: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: '12px',
    padding: '10px 0px 10px 0px',
  },
  disabled: {
    cursor: 'not-allowed',
    pointerEvents: 'none',
    color: '#c0c0c0',
  },
};

export default class ToolDropdown extends Component {
  renderIcon() {
    const { disabled, iconClassname, currentTool, toolType, iconComponent } = this.props;
    let iconStyle;
    if (disabled) {
      iconStyle = style.disabled;
    } else if (currentTool === toolType) {
      iconStyle = { color: blue500 };
    } else {
      iconStyle = { color: 'rgba(0, 0, 0, 0.4)' };
    }

    return iconComponent ?
      iconComponent() :
      <FontIcon
        className={iconClassname}
        style={iconStyle}
      />;
  }

  renderColorBar() {
    const { activeObject, disabled, colorBarBorder, colorBarBackground } = this.props;

    let backgroundColor = colorBarBackground;
    let borderColor = colorBarBorder;

    if (activeObject) {
      switch (activeObject.type) {
        case 'path':
        case 'line':
          backgroundColor = activeObject.stroke;
          break;
        case 'i-text':
          backgroundColor = activeObject.fill;
          break;
        case 'rect':
        case 'ellipse':
          backgroundColor = activeObject.fill;
          borderColor = activeObject.stroke;
          break;
        default:
      }
    }

    return disabled ?
      <div
        style={{
          width: '23px',
          height: '8px',
          background: '#c0c0c0',
        }}
      />
      :
      <div
        style={{
          width: '23px',
          height: '8px',
          backgroundColor,
          border: borderColor ? `${borderColor} 2px solid` : undefined,
        }}
      />;
  }

  render() {
    const {
      disabled, onClick, onClickIcon, onTouchTapChevron,
      tooltip, showTooltip, onMouseEnter, onMouseLeave,
    } = this.props;

    return (
      <div
        role="button"
        tabIndex="0"
        style={disabled ? { ...style.tool, ...style.disabled } : style.tool}
        onClick={event => (disabled ? () => {} : onClick && onClick(event))}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div role="button" tabIndex="0" style={style.innerTool} onClick={onClickIcon}>
          { this.renderIcon() }
          <MaterialTooltip
            horizontalPosition={'center'}
            label={tooltip}
            show={showTooltip}
            verticalPosition={'top'}
          />
          { this.renderColorBar() }
        </div>
        <div style={style.innerTool}>
          <FontIcon
            className="fa fa-chevron-down"
            style={disabled ? { ...style.chevron, ...style.disabled } : style.chevron}
            onTouchTap={!disabled && onTouchTapChevron}
          />
        </div>
      </div>
    );
  }
}

ToolDropdown.propTypes = propTypes;
