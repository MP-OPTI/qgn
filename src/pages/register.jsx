// src/pages/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useToast } from '../contexts/ToastProvider';
import RegisterForm from '../components/Register/RegisterForm';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const addToast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set default role as 'User' in Firestore
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

  return (
    <div className="register">
      <RegisterForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Register;
