const PORT = process.env.PORT || 8000;
const express = require('express');
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const app = express();
const pool = require("./db");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



app. use (cors())
app.use(express.json())


app.get('/api/v1/fastfood', async (req, res) => {
  try {
    const all = await pool.query('SELECT * FROM fastfood');
    res.json(all.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve fast food items' });
  }
}); 


app.get("/api/v1/fastfood/:userEmail",  async (req, res) => {
    const { userEmail } = req.params
    
    try {
        const all = await pool.query('SELECT * FROM FASTFOOD WHERE email = $1', [userEmail])
        res.json(all.rows)
    } catch (err) {
        console.error(error)
    }
});

//add fastfood
app.post('/api/v1/fastfood/',async (req,res)=>{
    const {title, location, email, date, progress} =req.body
    console.log(title, location, email, date, progress)
    const id = uuidv4()
    try {
        const newFast = await pool.query(`INSERT INTO fastfood (title, location, email, date, progress) VALUES ($1, $2, $3,$4, $5)`,
          [title, location, email, date, progress])
        res.json(newFast)

    } catch (err) {
        console.error(err)
    }
})


//edit 

app.put('/api/v1/fastfood/:id', async (req, res) => {
    const { id } = req.params;
    const { title, location, email, date, progress } = req.body;
    try {
        const editFast = await pool.query(
            'UPDATE fastfood SET title = $1, location = $2, email = $3, date = $4, progress = $5 WHERE id = $6;',
            [title, location, email, date, progress, id]
          );
          
        res.json(editFast);
    } catch (err) {
      console.error(err);
    }
  });


  app.post('/api/v1/fastfood/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    
    try {
      const updateFast = await pool.query(
        'UPDATE fastfood SET comments = array_append(comments, $1) WHERE id = $2;',
        [comment, id]
      );
  
      res.json(updateFast);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  });

  app.get('/api/v1/fastfood/:id/comments', async (req, res) => {
    const { id } = req.params;
  
    try {
      const fastfood = await pool.query('SELECT * FROM fastfood WHERE id = $1;', [id]);
      const comments = fastfood.rows[0].comments || [];
      res.json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve comments' });
    }
  });
  
// delete
app.delete('/api/v1/fastfood/:id', async (req, res) => {
    const { id } = req.params
    
    try {
        const deleteFast = await pool.query('DELETE FROM fastfood WHERE id = $1;', [id])
        res.json(deleteFast)
    } catch (err) {
        console.error(err)
        
    }

})


//signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    try {
       const signp =  await pool.query(`INSERT INTO users (email, hashed_password) VALUES ($1, $2)`,
        [email, hashedPassword])
        
       const token = jwt.sign({ email }, 'secret', { expiresIn : '1hr'})
       res.json({ email, token })
    } catch (err) {
        console.error(err)
    }
})


//login
  
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1;', [email])
        if (!users.rows.length) return res.json({ detail : 'User does not exist!'})
        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({ email }, 'secret', { expiresIn : '1hr'})
        if(success) {
            res.json({ 'email': users.rows[0].email, token })
        } else {
            res.json({ detail: "Login failed"})
        }
    } catch (err) {
        console.error(err)
      if (err) {
        res.json({ detail : err.detail })
      }
    }
})


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
