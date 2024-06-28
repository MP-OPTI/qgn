//RegisterForm.jsx
import React from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'User', // Default role
    });
    addToast('Registration successful!', 'success');
    navigate('/');
  } catch (error) {
    addToast(error.message, 'error');
  }
};


const RegisterForm = ({ email, setEmail, password, setPassword, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
