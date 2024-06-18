//App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from './QRCodeGenerator';
import Register from './register';
import Login from './login';
import { ToastProvider, useToast } from './toast';
import './fontawesome';
import Settings from './settings'; 

const MainApp = () => {
  const [user, setUser] = useState(null);
  const addToast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      addToast('You are now logged out!', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  return (
    <div className="App">
      <nav>
        <h1><Link to="/">snapq</Link></h1>
        <div className="nav-links">
          {!user && <Link to="/register"><i>Register</i> <FontAwesomeIcon icon="user-plus" /></Link>}
          {!user && <Link to="/login"><i>Login</i> <FontAwesomeIcon icon="right-to-bracket" /></Link>}
          {user && <Link to="/settings"><FontAwesomeIcon icon="user" /></Link>}
          {user && <button onClick={handleLogout}><FontAwesomeIcon icon="right-from-bracket" /></button>}
        </div>
      </nav>
      <div className="qr">
        <Routes>
          <Route path="/" element={<QRCodeGenerator />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} /> {/* Add settings route */}
        </Routes>
      </div>
      
    </div>
  );
};

const App = () => (
  <ToastProvider>
    <Router>
      <MainApp />
    </Router>
  </ToastProvider>
);

export default App;
