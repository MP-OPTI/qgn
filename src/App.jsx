// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { ToastProvider, useToast } from './contexts/ToastProvider';
import { auth } from './services/firebase';
import './fontawesome';
import URLPage from './pages/URL';
import Register from './pages/Register';
import Login from './pages/Login';
import Settings from './pages/Settings';
import LoggedInHome from './pages/LoggedInHome';
import LoggedInWiFi from './pages/LoggedInWiFi';
import LoggedInPassword from './pages/LoggedInPassword';
import WiFiPage from './pages/WiFi';
import PasswordPage from './pages/Password';
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
    <>
      <div className="top">
        <nav>
          <i><Link to="/">qgn</Link></i>
          <div className="nav-links">
            {!user && <Link to="/register"><i>Register</i> <FontAwesomeIcon icon="user-plus" /></Link>}
            {!user && <Link to="/login"><i>Login</i> <FontAwesomeIcon icon="right-to-bracket" /></Link>}
            {user && <Link to="/settings"><FontAwesomeIcon icon="user" /></Link>}
            {user && <button onClick={handleLogout}><FontAwesomeIcon icon="right-from-bracket" /></button>}
          </div>
        </nav>
      </div>

      <div className="App">
        <header>
          <nav>
            <div className="nav-links">
              <Link to="/url" className={location.pathname === '/url' ? 'active' : ''}>URL </Link>
              <Link to="/wifi" className={location.pathname === '/wifi' ? 'active' : ''}>WiFi </Link>
              <Link to="/password" className={location.pathname === '/password' ? 'active' : ''}>Password </Link>
            </div>
          </nav>
        </header>

        {location.pathname === '/' && !user && (
          <div className="hero">
            <h1>QR Codes, nothing else</h1>
            <h2>#1 Copy url &nbsp;&nbsp;&nbsp; #2 Get QR Code</h2>
          </div>
        )}

        {location.pathname === '/url' && !user && (
          <div className="hero">
            <h1>QR Codes, nothing else</h1>
            <h2>#1 Copy url &nbsp;&nbsp;&nbsp; #2 Get QR Code</h2>
          </div>
        )}

        {location.pathname === '/wifi' && !user && (
          <div className="hero">
            <h1>QR Codes, nothing else</h1>
            <h2>#1 Write WiFi SSID/Name and Pass &nbsp;&nbsp;&nbsp; #2 Get QR Code</h2>
          </div>
        )}

        {location.pathname === '/password' && !user && (
          <div className="hero">
            <h1>QR Codes, nothing else</h1>
            <h2>#1 Generate Password &nbsp;&nbsp;&nbsp; #2 Get QR Code</h2>
          </div>
        )}

        <div className="qr">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/url" /> : <URLPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/home" element={user ? <LoggedInHome /> : <Navigate to="/login" />} />
            <Route path="/url" element={user ? <LoggedInHome /> : <URLPage />} />
            <Route path="/wifi" element={user ? <LoggedInWiFi /> : <WiFiPage />} />
            <Route path="/password" element={user ? <LoggedInPassword /> : <PasswordPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </>
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
