// App.js
import React, { useEffect, useState } from 'react';
import ListHeader from './components/ListHeader';
import ListItem from './components/ListItem';
import Auth from './components/Auth';
import { useCookies } from 'react-cookie';
import CommentPopup from './components/CommentPopup';

const App = () => {
  
  const [cookies, setCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [fastfood, setFastfood] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/fastfood/${userEmail}`);
      const json = await response.json();
      setFastfood(json);
    } catch (err) {
      console.error(err);
    }
  };

  const viewComments = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/fastfood/${itemId}/comments`);
      const commentsData = await response.json();
      setComments(commentsData);
      setShowComments(true);
    } catch (err) {
      console.error(err);
    }
  };
  

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, [authToken]);

  // sort by date
  const sortedFastfood = fastfood?.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      <div className="app">
        {!authToken && <Auth />}
        {authToken && (
          <>
            <ListHeader listName="Fast-Food Finder list" getData={getData} />
            <p className="user-email">Welcome Back {userEmail}</p>
            {sortedFastfood?.map((one) => (
              <ListItem
                key={one.id}
                one={one}
                getData={getData}
                viewComments={viewComments} 
                
              />
            ))}
          </>
        )}
        
        <p className="copyright">Creative Coding LLC</p>
      </div>
      {showComments && (
        <CommentPopup comments={comments} setShowComments={setShowComments} />
      )}
    </>
  );
};

export default App;
