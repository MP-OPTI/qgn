// File: src/pages/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, functions } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { httpsCallable } from 'firebase/functions';

const AdminPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (user && user.role === 'Admin') {
        try {
          const usersCollection = await getDocs(collection(db, 'users'));
          const usersList = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Fetch detailed user data including email verification status
          const getUserData = httpsCallable(functions, 'getUserData');
          const userDataPromises = usersList.map(async (user) => {
            const result = await getUserData({ userId: user.id });
            if (result.data.success) {
              return { ...user, emailVerified: result.data.user.emailVerified };
            } else {
              return user;
            }
          });

          const detailedUsers = await Promise.all(userDataPromises);
          setUsers(detailedUsers);
        } catch (err) {
          setError('Failed to fetch users. Please check your Firestore security rules.');
        }
      } else if (user) {
        setError('Access denied. Admins only.');
      }
    };

    fetchUsers();
  }, [user]);

  const handleDelete = async (userId) => {
    try {
      // Delete user from Firestore
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);

      // Call the cloud function to delete the user from Firebase Authentication
      const deleteUser = httpsCallable(functions, 'deleteUser');
      const result = await deleteUser({ userId });
      
      if (result.data.success) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        setError(`Failed to delete user from auth: ${result.data.error}`);
      }
    } catch (err) {
      setError('Failed to delete user. Please check your Firestore security rules.');
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditEmail(user.email);
  };

  const handleSave = async () => {
    try {
      // Call the cloud function to update the email in Firebase Authentication
      const updateUserEmail = httpsCallable(functions, 'updateUserEmail');
      const updateEmailResult = await updateUserEmail({ userId: editUserId, newEmail: editEmail });

      if (updateEmailResult.data.success) {
        // Update email in Firestore
        const userDocRef = doc(db, 'users', editUserId);
        await updateDoc(userDocRef, { email: editEmail });

        // Update local state
        setUsers(users.map(user => user.id === editUserId ? { ...user, email: editEmail } : user));
        setEditUserId(null);
        setEditEmail('');
      } else {
        setError(`Failed to update email: ${updateEmailResult.data.error}`);
      }

      // Call the cloud function to update the password in Firebase Authentication
      if (editPassword) {
        const updateUserPassword = httpsCallable(functions, 'updateUserPassword');
        const updatePasswordResult = await updateUserPassword({ userId: editUserId, newPassword: editPassword });

        if (updatePasswordResult.data.success) {
          setEditPassword('');
        } else {
          setError(`Failed to update password: ${updatePasswordResult.data.error}`);
        }
      }
    } catch (error) {
      setError(`Failed to update user: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditEmail('');
    setEditPassword('');
  };

  const sendVerificationEmail = async (userId) => {
    try {
      const sendEmail = httpsCallable(functions, 'sendVerificationEmail');
      const result = await sendEmail({ userId });

      if (result.data.success) {
        alert(`Verification email sent. Link: ${result.data.link}`);
      } else {
        setError(`Failed to send verification email: ${result.data.error}`);
      }
    } catch (error) {
      setError(`Failed to send verification email: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      {user && <h2>Welcome, {user.role}</h2>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && user.role === 'Admin' && (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Email Verified</th>
              <th>User Role</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Send Verification</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  {editUserId === user.id ? (
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>{user.emailVerified ? 'Yes' : 'No'}</td>
                <td>{user.role}</td>
                <td>
                  {editUserId === user.id ? (
                    <>
                      <input
                        type="password"
                        placeholder="New password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                      />
                      <button onClick={handleSave}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(user)}>Edit</button>
                  )}
                </td>
                <td><button onClick={() => handleDelete(user.id)}>Delete</button></td>
                <td><button onClick={() => sendVerificationEmail(user.id)}>Send Verification</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
