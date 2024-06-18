import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser, sendEmailVerification, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { useToast } from './toast';
import useAuth from './useAuth';

const Settings = () => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [newEmail, setNewEmail] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const { user, emailVerified, loading } = useAuth();
  const navigate = useNavigate();
  const addToast = useToast();

  useEffect(() => {
    if (user) {
      setNewEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    let timer;
    if (!emailVerified && !loading && verificationSent) {
      timer = setInterval(async () => {
        setCountdown((prevCountdown) => (prevCountdown <= 1 ? 5 : prevCountdown - 1));
        if (countdown <= 1) {
          try {
            if (user) {
              await user.reload();
              if (user.emailVerified) {
                addToast('Email verified!', 'success');
                window.location.reload();
              }
            }
          } catch (error) {
            addToast(error.message, 'error');
          }
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [user, emailVerified, loading, countdown, addToast, verificationSent]);

  const handleDeleteAccount = async () => {
    try {
      if (user) {
        await deleteUser(user);
        addToast('Account deleted successfully!', 'success');
        navigate('/'); // Redirect to home page after account deletion
      }
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Here you need to send the verification email to the new email address manually
        const actionCodeSettings = {
          url: window.location.href,
          handleCodeInApp: true,
        };
        await sendEmailVerification(user, actionCodeSettings);
        setVerificationSent(true);
        addToast('Verification email sent to your current email. Please check your inbox.', 'success');
      }
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleReauthenticate = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      addToast('Re-authentication successful. Please proceed to verify your new email.', 'success');
      handleSendVerificationEmail();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleChangeEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateEmail(user, newEmail);
        await sendEmailVerification(user);
        addToast('New email set and verification email sent to new address. Please check your inbox.', 'success');
        setEditingEmail(false);
        setVerificationSent(true);
      }
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleCancelEdit = () => {
    setNewEmail(user.email);
    setEditingEmail(false);
    setVerificationSent(false);
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="email-status">
            <p>Email Status: {emailVerified ? 'Verified' : 'Not Verified'}</p>
            <div>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={!editingEmail || verificationSent}
                placeholder="Enter new email"
              />
              {!editingEmail ? (
                <button onClick={() => setEditingEmail(true)} className="edit-email-button">
                  Edit Email
                </button>
              ) : (
                <>
                  {!verificationSent ? (
                    <>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                      <button onClick={handleReauthenticate} className="verify-email-button">
                        Verify Email
                      </button>
                    </>
                  ) : (
                    <>
                      <p>Verification email sent. Please check your inbox.</p>
                      <p>Checking again in {countdown} seconds...</p>
                    </>
                  )}
                  <button onClick={handleCancelEdit} className="cancel-button">
                    Cancel
                  </button>
                </>
              )}
            </div>
            {emailVerified && verificationSent && (
              <button onClick={handleChangeEmail} className="change-email-button">
                Change Email
              </button>
            )}
          </div>
        </>
      )}
      {!confirmDelete ? (
        <button onClick={() => setConfirmDelete(true)} className="delete-account-button">
          Delete Account
        </button>
      ) : (
        <div className="confirm-delete">
          <p>If you delete your account, you'll lose all your saved QR codes and you won't be able to get it back.</p>
          <button onClick={handleDeleteAccount} className="confirm-button">Yes</button>
          <button onClick={() => setConfirmDelete(false)} className="cancel-button">No</button>
        </div>
      )}
    </div>
  );
};

export default Settings;
