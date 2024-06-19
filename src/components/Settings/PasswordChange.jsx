//PasswordChange.jsx

import React, { useState } from 'react';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useToast } from '../../contexts/ToastProvider';

const PasswordChange = ({ currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmNewPassword, setConfirmNewPassword, handleCancelEdit }) => {
  const [editingPassword, setEditingPassword] = useState(false);
  const addToast = useToast();

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        addToast('Password updated successfully!', 'success');
        setEditingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  return (
    <div className="password-change">
      <h3>Change Password</h3>
      <div>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        {!editingPassword ? (
          <button onClick={() => setEditingPassword(true)} className="edit-password-button">
            Change Password
          </button>
        ) : (
          <>
            <button onClick={handleChangePassword} className="change-password-button">
              Update Password
            </button>
            <button onClick={handleCancelEdit} className="cancel-button">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordChange;
