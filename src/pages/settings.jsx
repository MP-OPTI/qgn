// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { useToast } from '../contexts/ToastProvider';
import { useAuth } from '../hooks/useAuth';
import EmailStatus from '../components/Settings/EmailStatus';
import PasswordChange from '../components/Settings/PasswordChange';
import AccountDeletion from '../components/Settings/AccountDeletion';

const Settings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const addToast = useToast();
  
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      setNewEmail(user.email);
    }
  }, [user]);

  const handleCancelEdit = () => {
    setNewEmail(user.email);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <EmailStatus
            user={user}
            emailVerified={user?.emailVerified}
            newEmail={newEmail}
            setNewEmail={setNewEmail}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            handleCancelEdit={handleCancelEdit}
          />
          <PasswordChange
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmNewPassword={confirmNewPassword}
            setConfirmNewPassword={setConfirmNewPassword}
            handleCancelEdit={handleCancelEdit}
          />
        </>
      )}
      <AccountDeletion user={user} navigate={navigate} addToast={addToast} />
    </div>
  );
};

export default Settings;
