//EmailStatus.jsx
import React, { useState, useEffect } from 'react';
import { sendEmailVerification, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useToast } from '../../contexts/ToastProvider';

const EmailStatus = ({ user, emailVerified, newEmail, setNewEmail, currentPassword, setCurrentPassword, handleCancelEdit }) => {
  const [editingEmail, setEditingEmail] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const addToast = useToast();

  useEffect(() => {
    let timer;
    if (!emailVerified && verificationSent) {
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
  }, [user, emailVerified, verificationSent, countdown, addToast]);

  const handleSendVerificationEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
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

  return (
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
  );
};

export default EmailStatus;
