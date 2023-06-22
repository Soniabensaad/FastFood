// ListItem.js
import React, { useState } from 'react';
import Modal from './Modal';
import '../index.css';
import TickIcon from './TickIcon';
import ProgressBar from './ProgressBar';

const ListItem = ({ one, getData, viewComments }) => {
  const [showModal, setShowModal] = useState(false);

  const deleteItem = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/fastfood/${one.id}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async () => {
    const comment = prompt('Enter your comment');
    if (comment) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/fastfood/${one.id}/comments`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment }),
          }
        );
        if (response.status === 200) {
          getData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <li className="list-item">
      <div className="info-container">
        <TickIcon />
        <p className="task-title">{one.title}</p>
        <ProgressBar progress={one.progress} />
      </div>

      <div className="button-container">
        
        
        <button className="edit" onClick={() => setShowModal(true)}>
                EDIT
              </button>
              <button className="delete" onClick={deleteItem}>
                DELETE
        </button>
       
        <button className="comment" onClick={addComment}>
          Comment
        </button>
        <button className="view" onClick={() => viewComments(one.id)}>
          View Comments
        </button>
      </div>

      {showModal && (
        <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} one={one} />
      )}
    </li>
  );
};

export default ListItem;
