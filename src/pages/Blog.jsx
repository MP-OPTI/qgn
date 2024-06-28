// File: src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
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

    if (editId) {
      // Edit post
      const postRef = doc(db, 'blogPosts', editId);
      await updateDoc(postRef, { title, content, slug, titleTag, lastEditedAt: now });
      setPosts(posts.map(post => post.id === editId ? { ...post, title, content, slug, titleTag, lastEditedAt: now } : post));
      addToast('Post updated!', 'success');
    } else {
      // Add new post
      const newPost = {
        title,
        content,
        slug,
        titleTag,
        createdAt: now,
        lastEditedAt: now,
        author: user.email
      };
      const docRef = await addDoc(collection(db, 'blogPosts'), newPost);
      setPosts([...posts, { id: docRef.id, ...newPost }]);
      addToast('Post added!', 'success');
    }
    setTitle('');
    setContent('');
    setEditId(null);
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'blogPosts', id));
    setPosts(posts.filter(post => post.id !== id));
    addToast('Post deleted!', 'success');
  };

  return (
    <div className="blog">
      <h1>Blog</h1>
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
          <button type="submit">{editId ? 'Update Post' : 'Add Post'}</button>
        </form>
      )}
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 100)}...</p>
            <Link to={`/blog/${post.slug}`}>Read more</Link>
            <small>Published on: {post.createdAt?.toDate().toLocaleDateString()}</small>
            {post.lastEditedAt && <small> | Last edited: {post.lastEditedAt?.toDate().toLocaleDateString()}</small>}
            <small> | by {post.author}</small>
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
