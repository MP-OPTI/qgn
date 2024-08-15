// File: src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastProvider, useToast } from './contexts/ToastProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import './fontawesome';
import URLPage from './pages/URL';
import Register from './pages/Register';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import LoggedInHome from './pages/LoggedInHome';
import LoggedInWiFi from './pages/LoggedInWiFi';
import LoggedInPassword from './pages/LoggedInPassword';
import LoggedInFiles from './pages/LoggedInFilesPage'
import WiFiPage from './pages/WiFi';
import PasswordPage from './pages/Password';
import FilesPage from './pages/FilesPage';
import Footer from './components/Footer';
import Hero from './components/Hero';
import AdminPage from './pages/AdminPage'; 
import ProtectedRoute from './components/ProtectedRoute';
import { useSpring, animated } from '@react-spring/web';

const MainApp = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const addToast = useToast();
  const navigate = useNavigate();
  
  const loadingAnimation = useSpring({
    opacity: loading ? 0 : 1,
    config: { duration: 400 }
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      addToast('You are now logged out!', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const renderHero = (path) => {
    if (!user) {
      const heroContent = {
        '/': ['QR Codes, nothing else', '#1 Copy url   #2 Get QR Code'],
        '/url': ['QR Codes, nothing else', '#1 Copy url   #2 Get QR Code'],
        '/wifi': ['QR Codes, nothing else', '#1 Write WiFi SSID/Name and Pass   #2 Get QR Code'],
        '/password': ['QR Codes, nothing else', '#1 Generate Password   #2 Get QR Code']
      };

      if (heroContent[path]) {
        return <Hero title={heroContent[path][0]} subtitle={heroContent[path][1]} />;
      } else {
        return null;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <animated.div style={loadingAnimation}>
        Loading...
      </animated.div>
    );
  }

  return (
    <>
    <animated.div style={loadingAnimation}>
      <div className="top">
        <nav>
          <i><Link to="/">qgn</Link></i>
          <div className="nav-links">
            {!user && <Link to="/register"><i>Register</i> <FontAwesomeIcon icon="user-plus" /></Link>}
            {!user && <Link to="/login"><i>Login</i> <FontAwesomeIcon icon="right-to-bracket" /></Link>}
            {user && <Link to="/settings"><FontAwesomeIcon icon="user" /></Link>}
            {user && user.role === 'Admin' && <Link to="/admin"><FontAwesomeIcon icon="cogs" /></Link>}
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
              <Link to="/files" className={location.pathname === '/files' ? 'active' : ''}>Files </Link>
            </div>
          </nav>
        </header>

        {renderHero(location.pathname)}

        <div className="qr">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/url" /> : <URLPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<ProtectedRoute user={user} loading={loading}><Settings /></ProtectedRoute>} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/home" element={user ? <LoggedInHome /> : <Navigate to="/login" />} />
            <Route path="/url" element={user ? <LoggedInHome /> : <URLPage />} />
            <Route path="/wifi" element={user ? <LoggedInWiFi /> : <WiFiPage />} />
            <Route path="/password" element={user ? <LoggedInPassword /> : <PasswordPage />} />
            <Route path="/files" element={user ? <LoggedInFiles/> : <FilesPage />} />
            <Route path="/admin" element={<ProtectedRoute user={user} loading={loading} role="Admin"><AdminPage /></ProtectedRoute>} />
          </Routes>
        </div>

        <Footer />
      </div>
      </animated.div>
    </>
  );
};

const App = () => (
  <ToastProvider>
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  </ToastProvider>
);

export default App;
