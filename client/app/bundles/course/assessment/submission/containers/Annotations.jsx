import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Card, CardText } from 'material-ui/Card';

import { postShape, annotationShape } from '../propTypes';
import CommentCard from '../components/CommentCard';
import CommentField from '../components/CommentField';
import * as annotationActions from '../actions/annotations';

class VisibleAnnotations extends Component {
  constructor(props) {
    super(props);
    this.state = { fieldVisible: false };
  }

  render() {
    const { fieldVisible } = this.state;
    const {
      fileId, lineNumber, commentForms, posts,
      createComment, updateComment, deleteComment,
      handleCreateChange, handleUpdateChange,
    } = this.props;

    return (
      <Card onClick={() => this.setState({ fieldVisible: true })}>
        <CardText style={{ textAlign: 'left' }}>
          {posts.map(post =>
            <CommentCard
              key={post.id}
              post={post}
              editValue={commentForms.posts[post.id]}
              updateComment={value => updateComment(post.id, value)}
              deleteComment={() => deleteComment(post.id)}
              handleChange={value => handleUpdateChange(post.id, value)}
            />
          )}
          {posts.length === 0 || fieldVisible ? <CommentField
            value={commentForms.annotations[fileId][lineNumber]}
            createComment={createComment}
            handleChange={handleCreateChange}
          /> : null}
        </CardText>
      </Card>
    );
  }
}

VisibleAnnotations.propTypes = {
  commentForms: PropTypes.shape({
    topics: PropTypes.objectOf(PropTypes.string),
    posts: PropTypes.objectOf(PropTypes.string),
  }),
  fileId: PropTypes.number.isRequired,
  lineNumber: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(postShape),
  /* eslint-disable react/no-unused-prop-types */
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string,
      assessmentId: PropTypes.string,
      submissionId: PropTypes.string,
    }),
  }),
  annotation: annotationShape,
  answerId: PropTypes.number.isRequired,
  /* eslint-enable react/no-unused-prop-types */

  handleCreateChange: PropTypes.func.isRequired,
  handleUpdateChange: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { annotation } = ownProps;

  if (!annotation) {
    return {
      commentForms: state.commentForms,
      posts: [],
    };
  }
  return {
    commentForms: state.commentForms,
    posts: annotation.postIds.map(postId => state.posts[postId]),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { match: { params: { submissionId } }, answerId, fileId, lineNumber, annotation } = ownProps;

  if (!annotation) {
    return {
      handleCreateChange: comment => dispatch(annotationActions.onCreateChange(fileId, lineNumber, comment)),
      handleUpdateChange: (postId, comment) => dispatch(annotationActions.onUpdateChange(postId, comment)),
      createComment: comment => dispatch(annotationActions.create(submissionId, answerId, fileId, lineNumber, comment)),
      updateComment: () => {},
      deleteComment: () => {},
    };
  }
  return {
    handleCreateChange: comment => dispatch(annotationActions.onCreateChange(fileId, lineNumber, comment)),
    handleUpdateChange: (postId, comment) => dispatch(annotationActions.onUpdateChange(postId, comment)),
    createComment: comment => dispatch(annotationActions.create(submissionId, answerId, fileId, lineNumber, comment)),
    updateComment: (postId, comment) => dispatch(annotationActions.update(annotation.id, postId, comment)),
    deleteComment: postId => dispatch(annotationActions.destroy(fileId, annotation.id, postId)),
  };
}

const Annotations = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibleAnnotations));
export default Annotations;
