import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { grey200 } from 'material-ui/styles/colors';

import WideComments from './WideComments';
import AddCommentIcon from './AddCommentIcon';
import { AnnotationProp } from '../../propTypes';

const styles = {
  layout: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  editorContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: grey200,
    borderRadius: 5,
    overflow: 'auto',
  },
  editor: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: grey200,
    borderRadius: 5,
    padding: 5,
    width: '100%',
    overflow: 'hidden',
    tableLayout: 'fixed',
  },
  editorLine: {
    height: 20,
    paddingLeft: 5,
    whiteSpace: 'nowrap',
  },
  editorLineNumber: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: grey200,
    padding: '0 5px',
  },
};

export default class WideEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeComment: 0,
      lineHovered: 0,
    };
  }

  toggleComment(lineNumber) {
    this.props.toggleLine(lineNumber);
    this.setState({ activeComment: lineNumber });
  }

  expandComment(lineNumber) {
    this.props.expandLine(lineNumber);
    this.setState({ activeComment: lineNumber });
  }

  renderLineNumberColumn(lineNumber) {
    const { lineHovered } = this.state;

    return (
      <div
        style={styles.editorLineNumber}
        onClick={() => this.toggleComment(lineNumber)}
        onMouseOver={() => this.setState({ lineHovered: lineNumber })}
        onMouseOut={() => this.setState({ lineHovered: -1 })}
      >
        {lineNumber}
        <AddCommentIcon onClick={() => this.expandComment(lineNumber)} hovered={lineHovered === lineNumber} />
      </div>
    );
  }

  renderComments() {
    const { activeComment } = this.state;
    const { answerId, fileId, expanded, annotations, collapseLine } = this.props;
    return (
      <WideComments
        activeComment={activeComment}
        answerId={answerId}
        fileId={fileId}
        annotations={annotations}
        expanded={expanded}
        expandLine={lineNumber => this.expandComment(lineNumber)}
        collapseLine={lineNumber => collapseLine(lineNumber)}
        onClick={lineNumber => this.setState({ activeComment: lineNumber })}
      />
    );
  }

  renderEditor() {
    /* eslint-disable react/no-array-index-key */
    /* eslint-disable react/no-danger */
    const { content } = this.props;
    return (
      <div style={styles.editorContainer}>
        <table className="codehilite" style={styles.editor}>
          <tbody>
            <tr>
              <td style={{ width: 50, userSelect: 'none', paddingBottom: 20 }}>
                {content.map((line, index) =>
                  <div key={`${index}-${line}`}>
                    {this.renderLineNumberColumn(index + 1)}
                  </div>
                )}
              </td>
              <td style={{ overflowX: 'scroll' }}>
                {content.map((line, index) => (
                  <div key={`${index}-${line}`} style={styles.editorLine} >
                    <pre style={{ overflow: 'visible' }}>
                      <code
                        dangerouslySetInnerHTML={{ __html: line }}
                        style={{ whiteSpace: 'inherit' }}
                      /></pre>
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
    /* eslint-enable react/no-danger */
    /* eslint-enable react/no-array-index-key */
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td style={{ maxWidth: 200 }}>{this.renderComments()}</td>
              <td style={{ width: '60%' }}>{this.renderEditor()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

WideEditor.propTypes = {
  expanded: PropTypes.arrayOf(PropTypes.bool).isRequired,
  answerId: PropTypes.number.isRequired,
  fileId: PropTypes.number.isRequired,
  annotations: PropTypes.arrayOf(AnnotationProp),
  content: PropTypes.arrayOf(PropTypes.string).isRequired,
  expandLine: PropTypes.func,
  collapseLine: PropTypes.func,
  toggleLine: PropTypes.func,
};

WideEditor.defaultProps = {
  expandLine: () => {},
  collapseLine: () => {},
  toggleLine: () => {},
};
