//useQRCode.js
import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { sanitizeInput } from '../utils/sanitizeInput';

export const useQRCode = (user) => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingUrl, setEditingUrl] = useState('');

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const q = query(
      collection(db, 'qrCodes'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const qrCodesData = [];
      querySnapshot.forEach((doc) => {
        qrCodesData.push({ ...doc.data(), id: doc.id });
      });
      setQrCodes(qrCodesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (url) => {
    const sanitizedUrl = sanitizeInput(url);
    if (sanitizedUrl.trim() && user) {
      try {
        await addDoc(collection(db, 'qrCodes'), {
          uid: user.uid,
          value: sanitizedUrl,
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Error adding document: ", error);
        alert(error.message);
      }
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, 'qrCodes', id));
    } catch (error) {
      console.error("Error removing document: ", error);
      alert(error.message);
    }
  };

  const handleEdit = (id, value) => {
    if (editingId === id) {
      setEditingId(null);
      setEditingUrl('');
    } else {
      setEditingId(id);
      setEditingUrl(value);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const sanitizedUrl = sanitizeInput(editingUrl);
    if (sanitizedUrl.trim()) {
      try {
        const docRef = doc(db, 'qrCodes', editingId);
        await updateDoc(docRef, {
          value: sanitizedUrl,
          updatedAt: new Date(),
        });
        setEditingId(null);
        setEditingUrl('');
      } catch (error) {
        console.error("Error updating document: ", error);
        alert(error.message);
      }
    }
  };

  return {
    qrCodes,
    loading,
    editingId,
    editingUrl,
    setEditingUrl,
    handleSubmit,
    handleRemove,
    handleEdit,
    handleEditSubmit
  };
};
