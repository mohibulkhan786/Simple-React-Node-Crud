### Step-by-step guide to building a full-stack CRUD (Create, Read, Update, Delete) application using React for the frontend and Node.js (with Express) for the backend. We'll use MongoDB as the database.

- Frontend: React (with Axios)
- Backend: Node.js with Express
- Database: MongoDB (with Mongoose)

````
/backend
  ├── server.js
  ├── models/
  ├── routes/
  └── controllers/
/frontend
  ├── src/
      ├── App.js
      ├── components/
````

## Backend Setup

````
mkdir backend && cd backend
npm init -y
npm install express mongoose cors
````
- Create server.js

````
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/crud_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
````
- Create Mongoose model models/User.js

````
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
});

module.exports = mongoose.model('User', userSchema);
````
- Create Routes and Controller <b>routes/userRoutes.js</b>

````
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

````
- controllers/userController.js

````
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

````

## Frontend Setup

````
npx create-react-app frontend
cd frontend
npm install axios

````

- frontend/src/App.js

````
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', number: '' });
  const [editId, setEditId] = useState(null);

  const getUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/users');
    setUsers(res.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/api/users/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/api/users', form);
    }
    setForm({ name: '', email: '', number: '' });
    setEditId(null);
    getUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, number: user.number });
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    getUsers();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>CRUD App</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
         <input
          placeholder="Number"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
        />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>
      <hr/>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email} - {user.number} - 
            <button onClick={() => handleEdit(user)}>Edit</button> - 
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
````

## Start the Backend

````
cd backend
node server.js
````
## Start the Frontend

````
cd frontend
npm start
````

- ![Home page URL](http://localhost:3000)

- ![Home page](https://github.com/mohibulkhan786/Simple-React-Node-Crud/blob/main/home-page.png)



- Make sure MongoDB is running in the background

- ![MongoDB-Databse](https://github.com/mohibulkhan786/Simple-React-Node-Crud/blob/main/mongo-db.png)


