// src/hooks/useQRCode.js
import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { sanitizeInput } from '../utils/sanitizeInput';

export const useQRCode = (user) => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingUrl, setEditingUrl] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingTags, setEditingTags] = useState('');

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
        const data = doc.data();
        qrCodesData.push({ ...data, id: doc.id, tags: data.tags || [] });
      });
      setQrCodes(qrCodesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (url, title, tags = '', type) => {
    const sanitizedUrl = sanitizeInput(url);
    if (sanitizedUrl.trim() && user) {
      try {
        await addDoc(collection(db, 'qrCodes'), {
          uid: user.uid,
          value: sanitizedUrl,
          title: title || 'Untitled',
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Ensure tags is always a string
          type, // Add the type field here
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

  const handleEdit = (id, value, title, tags) => {
    if (editingId === id) {
      setEditingId(null);
      setEditingUrl('');
      setEditingTitle('');
      setEditingTags('');
    } else {
      setEditingId(id);
      setEditingUrl(value);
      setEditingTitle(title);
      setEditingTags(Array.isArray(tags) ? tags.join(', ') : '');
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
          title: editingTitle || 'Untitled',
          tags: editingTags.split(',').map(tag => tag.trim()).filter(tag => tag),
          updatedAt: new Date(),
        });
        setEditingId(null);
        setEditingUrl('');
        setEditingTitle('');
        setEditingTags('');
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
    editingTitle,
    editingTags,
    setEditingUrl,
    setEditingTitle,
    setEditingTags,
    handleSubmit,
    handleRemove,
    handleEdit,
    handleEditSubmit
  };
};
