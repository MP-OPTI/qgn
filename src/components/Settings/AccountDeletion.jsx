//AccountDeletion.jsx
import React, { useState } from 'react';
import { deleteUser } from 'firebase/auth';

const AccountDeletion = ({ user, navigate, addToast }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      if (user) {
        await deleteUser(user);
        addToast('Account deleted successfully!', 'success');
        navigate('/');
      }
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  return (
    <div className="delete-account">
      <h3>Account deletion</h3>
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

export default AccountDeletion;
