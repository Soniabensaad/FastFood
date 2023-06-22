
import React, { useState } from 'react';

const CommentPopup = ({ comments, setShowComments }) => {
  const [showComments, setShowCommentsState] = useState(true);

  const handleClose = () => {
    setShowComments(false); 
    setShowCommentsState(true); 
  };

  return (
    <div className="comment-popup">
      <h3>Comments</h3>
      <div className="comments-list">
        {comments.map((comment, index) => (
          <p key={index}>{comment}</p>
        ))}
      </div>
      <button className="close" onClick={handleClose}>
        Close
      </button>
    </div>
  );
};

export default CommentPopup;
