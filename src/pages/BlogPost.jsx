// File: src/pages/BlogPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const q = query(collection(db, 'blogPosts'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const postData = querySnapshot.docs[0].data();
        setPost({ id: querySnapshot.docs[0].id, ...postData });
      }
    };

    fetchPost();
  }, [slug]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="blog-post">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <small>Published on: {post.createdAt?.toDate().toLocaleDateString()}</small>
      {post.lastEditedAt && <small> | Last edited: {post.lastEditedAt?.toDate().toLocaleDateString()}</small>}
      <small> | by {post.author}</small>
    </div>
  );
};

export default BlogPost;
