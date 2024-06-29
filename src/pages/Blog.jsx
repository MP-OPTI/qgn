// src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastProvider';
import { Timestamp } from 'firebase/firestore';

const Blog = () => {
  const { user } = useAuth();
  const addToast = useToast();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = await getDocs(collection(db, 'blogPosts'));
      setPosts(postsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchPosts();
  }, []);

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    const now = Timestamp.now();
    const slug = generateSlug(title);
    const titleTag = title;
    let featuredImageUrl = '';

    if (featuredImage) {
      const storage = getStorage();
      const storageRef = ref(storage, `featuredImages/${featuredImage.name}`);
      await uploadBytes(storageRef, featuredImage);
      featuredImageUrl = await getDownloadURL(storageRef);
    }

    if (editId) {
      const postRef = doc(db, 'blogPosts', editId);
      await updateDoc(postRef, { title, content, slug, titleTag, lastEditedAt: now, featuredImageUrl });
      setPosts(posts.map(post => post.id === editId ? { ...post, title, content, slug, titleTag, lastEditedAt: now, featuredImageUrl } : post));
      addToast('Post updated!', 'success');
    } else {
      const newPost = {
        title,
        content,
        slug,
        titleTag,
        createdAt: now,
        lastEditedAt: now,
        author: user.email,
        featuredImageUrl
      };
      const docRef = await addDoc(collection(db, 'blogPosts'), newPost);
      setPosts([...posts, { id: docRef.id, ...newPost }]);
      addToast('Post added!', 'success');
    }
    setTitle('');
    setContent('');
    setFeaturedImage(null);
    setEditId(null);
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post.id);
    setFeaturedImage(null); // Optionally set the current featured image URL to state if needed
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'blogPosts', id));
    setPosts(posts.filter(post => post.id !== id));
    addToast('Post deleted!', 'success');
  };

  return (
    <div className="blog">
      <div className="blog-hero">
        <h1>qgn - QR Blog</h1>
        <h2>Everything QR Codes</h2>
      </div>
      <div className="blog-edit">
        {user && (
          <form onSubmit={handleAddPost}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFeaturedImage(e.target.files[0])}
            />
            <button type="submit">{editId ? 'Update Post' : 'Add Post'}</button>
          </form>
        )}
      </div>
      <div className="blog-post-featured">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h2>{post.title}</h2>
            {post.featuredImageUrl && <img src={post.featuredImageUrl} alt="Featured" />}
            <div className="snippet">{post.content.substring(0, 100)}...</div>
            <Link to={`/blog/${post.slug}`}>Read more</Link>
            <div className="meta">
              <small>Published on: {post.createdAt?.toDate().toLocaleDateString()}</small>
              {post.lastEditedAt && <small> | Last edited: {post.lastEditedAt?.toDate().toLocaleDateString()}</small>}
              <small> | by {post.author}</small>
            </div>
            {user && user.email === post.author && (
              <div>
                <button onClick={() => handleEdit(post)}>Edit</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
