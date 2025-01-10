import React, { useState, useEffect } from 'react'
import { apiCall } from '../../utils/api'
import { useAuth } from '../auth/AuthContext'
import PostList from './posts/PostList'
import PostForm from './posts/PostForm'
import CalculatorManager from './calculators/CalculatorManager'

function PostManager() {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'code',
    imageUrl: '',
  })

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiCall('/api/contributions')
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to fetch posts. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        date: new Date().toISOString(),
      }

      if (selectedPost) {
        await apiCall(`/api/contributions/${selectedPost._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiCall('/api/contributions', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      await fetchPosts()
      handleCancel()
    } catch (error) {
      const errorMessage =
        error.message ||
        (selectedPost ? 'Failed to update post.' : 'Failed to create post.')
      setError(errorMessage)
      console.error('Error saving post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this post? This action cannot be undone.',
      )
    ) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await apiCall(`/api/contributions/${id}`, {
        method: 'DELETE',
      })
      await fetchPosts()
      handleCancel()
    } catch (error) {
      const errorMessage =
        error.message || 'Failed to delete post. Please try again.'
      setError(errorMessage)
      console.error('Error deleting post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (post) => {
    setSelectedPost(post)
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        type: post.type,
        imageUrl: post.imageUrl || '',
      })
    }
  }

  const handleCancel = () => {
    setSelectedPost(null)
    setFormData({
      title: '',
      content: '',
      type: 'code',
      imageUrl: '',
    })
    setError(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin</h1>
            <div className="tab-buttons">
              <button
                onClick={() => setActiveTab('posts')}
                className={`tab-button ${
                  activeTab === 'posts' ? 'active' : ''
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('calculators')}
                className={`tab-button ${
                  activeTab === 'calculators' ? 'active' : ''
                }`}
              >
                Calculators
              </button>
            </div>
          </div>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        {error && <div className="admin-error">{error}</div>}

        {activeTab === 'posts' ? (
          <div className="content-grid">
            <div className="post-section">
              <PostList
                posts={posts}
                selectedPost={selectedPost}
                onEdit={handleEdit}
                isLoading={isLoading}
              />
            </div>
            <div className="form-section">
              <PostForm
                formData={formData}
                selectedPost={selectedPost}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
                onDelete={
                  selectedPost ? () => handleDelete(selectedPost._id) : null
                }
                onCancel={handleCancel}
              />
            </div>
          </div>
        ) : (
          <CalculatorManager />
        )}
      </div>
    </div>
  )
}

export default PostManager
