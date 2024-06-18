//QRCodeGenerator.jsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db, auth } from './firebase';
import QRCodeForm from './QRCodeForm';
import QRCodeDisplay from './QRCodeDisplay';
import { sanitizeInput } from './utils/sanitizeInput';

const QRCodeGenerator = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingUrl, setEditingUrl] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    setLoading(true);

    const q = query(
      collection(db, 'qrCodes'),
      where('uid', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc') // Order by createdAt in descending order
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
  }, [auth.currentUser]);

  const handleSubmit = async (url) => {
    const sanitizedUrl = sanitizeInput(url);
    if (sanitizedUrl.trim() && auth.currentUser) {
      try {
        await addDoc(collection(db, 'qrCodes'), {
          uid: auth.currentUser.uid,
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

  return (
    <div className="qr-container">
      <div className="qr-generator">
        <QRCodeForm handleSubmit={handleSubmit} showGenerateButton={true} isLoggedIn={!!auth.currentUser} />
      </div>
      <div className="qr-codes">
        {auth.currentUser && (
          <div>
            {loading ? (
              <p>Loading QR codes...</p>
            ) : (
              <div className="qr-codes-grid">
                {qrCodes.length > 0 ? (
                  qrCodes.map((qrCode) => (
                    <QRCodeDisplay
                      key={qrCode.id}
                      qrCode={qrCode}
                      handleRemove={handleRemove}
                      handleEdit={handleEdit}
                      editingId={editingId}
                      editingUrl={editingUrl}
                      setEditingUrl={setEditingUrl}
                      handleEditSubmit={handleEditSubmit}
                    />
                  ))
                ) : (
                  <p className="inittxt">No QR codes yet... <br></br><br></br>Start by creating some above. You can make a QR Code with any text or URL.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
