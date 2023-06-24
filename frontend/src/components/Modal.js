import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const Modal = ({ mode, setShowModal, getData, one }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const editMode = mode === 'edit' ? true : false;

  const [data, setData] = useState({
    title: editMode ? one.title : '',
    location: editMode ? one.location : '',
    email: editMode ? one.email : cookies.Email || '',
    date: editMode ? one.date : new Date(),
    progress: editMode ? one.progress : 0,
  });

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/fastfood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer <token>',
        },
        
        body: JSON.stringify({ ...data, email: data.email }),
      });

      if (response.status === 200) {
        console.log('WORKED');
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/v1/fastfood/${one.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer <token>',
        },
        
        body: JSON.stringify({ ...data, email: data.email }),
      });

      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your favorite fast food</h3>
          <button onClick={() => setShowModal(false)}>x</button>
        </div>
        <form>
          <input
            required
            maxLength={30}
            placeholder="Your Favorite fast food goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <input
            required
            maxLength={30}
            placeholder="Location of fast food"
            name="location"
            value={data.location}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="range">Drag to select your current review</label>
          <input
            required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />

          <button className={mode === 'edit' ? 'edit' : 'add'} onClick={editMode ? editData : postData}>
            {mode === 'edit' ? 'Edit' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
