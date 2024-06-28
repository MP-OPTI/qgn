// src/pages/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth'; // Assuming you have a useAuth hook

const AdminPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (user && user.role === 'Admin') {
        try {
          const usersCollection = await getDocs(collection(db, 'users'));
          const usersList = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList);
        } catch (err) {
          setError('Failed to fetch users. Please check your Firestore security rules.');
        }
      } else {
        setError('Access denied. Admins only.');
      }
    };

    fetchUsers();
  }, [user]);

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user. Please check your Firestore security rules.');
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && user.role === 'Admin' && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User Role</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><button onClick={() => alert('Edit user: ' + user.id)}>Edit</button></td>
                <td><button onClick={() => handleDelete(user.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
