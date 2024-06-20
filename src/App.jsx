// File: src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import Settings from './pages/Settings';
import LoggedInHome from './pages/LoggedInHome';
import { ToastProvider, useToast } from './contexts/ToastProvider';
import { auth } from './services/firebase';
import './fontawesome';
import Footer from './components/Footer';

const MainApp = () => {
  const [user, setUser] = useState(null);
  const addToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

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
      <header>
        <nav>
          <i><Link to="/">qgn</Link></i>
          <div className="nav-links">
            {!user && <Link to="/register"><i>Register</i> <FontAwesomeIcon icon="user-plus" /></Link>}
            {!user && <Link to="/login"><i>Login</i> <FontAwesomeIcon icon="right-to-bracket" /></Link>}
            {user && <Link to="/settings"><FontAwesomeIcon icon="user" /></Link>}
            {user && <button onClick={handleLogout}><FontAwesomeIcon icon="right-from-bracket" /></button>}
          </div>
        </nav>
      </header>

      {location.pathname === '/' && !user && (
        <div className="hero">
          <h1>QR Codes, nothing else</h1>
          <h2>#1 Copy url #2 Get QR Code</h2>
        </div>
      )}
    
      <div className="qr">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <QRCodeGenerator />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/home" element={user ? <LoggedInHome /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      
      <Footer />
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
