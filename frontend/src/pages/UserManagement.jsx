import React, { useEffect, useState } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', role: 'viewer' });

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const addUser = (e) => {
    e.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).then(() => {
      setUsers(prev => [...prev, newUser]);
      setNewUser({ username: '', role: 'viewer' });
    });
  };

  const deleteUser = (username) => {
    fetch(`/api/users/${username}`, { method: 'DELETE' })
      .then(() => {
        setUsers(prev => prev.filter(u => u.username !== username));
      });
  };

  return (
    <div>
      <h1>User Management</h1>
      <form onSubmit={addUser}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleChange}
          required
        />
        <select name="role" value={newUser.role} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map(user => (
          <li key={user.username}>
            <strong>{user.username}</strong> - {user.role}
            <button onClick={() => deleteUser(user.username)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManagement;
