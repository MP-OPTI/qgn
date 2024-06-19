//App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from './pages/QRCodeGenerator';
import Register from './pages/register';
import Login from './pages/login';
import Settings from './pages/settings';
import { ToastProvider, useToast } from './contexts/ToastProvider';
import { auth } from './services/firebase';
import './fontawesome';

const MainApp = ({ isLoggedIn }) => {
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

      {!isLoggedIn && (
        <div className="hero">
          <h1>Stop typing, start scanning</h1>
          <h2>Paste your link below and get your QR instantly!</h2>
        </div>
      )}

      <div className="qr">
        <Routes>
          <Route path="/" element={<QRCodeGenerator />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
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
