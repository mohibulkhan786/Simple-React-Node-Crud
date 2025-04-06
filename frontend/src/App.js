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
