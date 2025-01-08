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
      const data = await apiCall('/api/contributions')
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
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
      setError(
        selectedPost ? 'Failed to update post.' : 'Failed to create post.',
      )
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
    )
      return

    setIsLoading(true)
    setError(null)
    try {
      await apiCall(`/api/contributions/${id}`, {
        method: 'DELETE',
      })
      await fetchPosts()
      handleCancel()
    } catch (error) {
      setError('Failed to delete post. Please try again.')
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
    <div className="min-h-screen bg-black">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-b border-white/10 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="font-mono text-xl text-white/90">Admin</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('posts')}
                className={`font-mono text-sm transition-colors ${
                  activeTab === 'posts'
                    ? 'text-white/90'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('calculators')}
                className={`font-mono text-sm transition-colors ${
                  activeTab === 'calculators'
                    ? 'text-white/90'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Calculators
              </button>
            </div>
          </div>
          <button
            onClick={logout}
            className="font-mono px-3 py-1.5 text-sm text-white/60 hover:text-white/90 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto pt-20 px-4 pb-8">
        {error && (
          <div className="mb-6 font-mono p-3 bg-red-500/5 border border-red-500/10 rounded text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {activeTab === 'posts' ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <PostList
                posts={posts}
                selectedPost={selectedPost}
                onEdit={handleEdit}
                isLoading={isLoading}
              />
            </div>
            <div className="md:col-span-3">
              <PostForm
                formData={formData}
                selectedPost={selectedPost}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
                onDelete={() => handleDelete(selectedPost._id)}
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
