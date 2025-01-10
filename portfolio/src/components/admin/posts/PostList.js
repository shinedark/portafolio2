import React from 'react'
import './../Admin.css'

function PostList({ posts, selectedPost, onEdit, isLoading }) {
  return (
    <div className="post-list-container">
      <div className="post-list-header">
        <h2 className="post-list-title">Posts</h2>
        <button onClick={() => onEdit(null)} className="new-post-button">
          + New
        </button>
      </div>

      <div className="posts-container">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => onEdit(post)}
            className={`post-item ${
              selectedPost?._id === post._id ? 'selected' : ''
            }`}
          >
            <div className="post-item-header">
              <h3 className="post-title">{post.title}</h3>
              <span className="post-type">{post.type}</span>
            </div>
            <p className="post-content">{post.content}</p>
          </div>
        ))}

        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner" />
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-title">No posts yet</p>
            <p className="empty-state-subtitle">Create your first post</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostList
