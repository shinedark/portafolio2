import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'

const API_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : ''

const getPosts = async () => {
  const response = await fetch(`${API_URL}/api/contributions`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch posts')
  }
  return response.json()
}

const createPost = async (postData) => {
  console.log('Creating post:', postData)
  const formattedData = {
    date: new Date().toISOString(),
    title: postData.title,
    content: postData.content,
    imageUrl: postData.imageUrl || '',
    type: 'blog',
  }

  const response = await fetch(`${API_URL}/api/contributions`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create post')
  }

  return response.json()
}

const updatePost = async (postId, postData) => {
  console.log('Attempting to update post:', {
    postId,
    postData,
  })

  const formattedData = {
    title: postData.title,
    content: postData.content,
    type: 'blog',
    imageUrl: postData.imageUrl || '',
  }

  const response = await fetch(`${API_URL}/api/contributions/${postId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Server error: ${response.status} ${response.statusText}`,
    }))
    console.error('Update failed:', {
      status: response.status,
      errorData,
      postId,
    })
    throw new Error(
      errorData.message || `Failed to update post (${response.status})`,
    )
  }

  return response.json()
}

const deletePost = async (postId) => {
  console.log('Attempting to delete post:', { postId })

  const response = await fetch(`${API_URL}/api/contributions/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Server error: ${response.status} ${response.statusText}`,
    }))
    console.error('Delete failed:', {
      status: response.status,
      errorData,
      postId,
    })
    throw new Error(errorData.message || 'Failed to delete post')
  }

  return response.json()
}

function PostManager() {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { logout } = useAuth()

  const initialFormState = {
    title: '',
    content: '',
    imageUrl: '',
  }

  const [formData, setFormData] = useState(initialFormState)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (selectedPost) {
        await updatePost(selectedPost._id, formData)
      } else {
        await createPost(formData)
      }

      fetchPosts()
      setFormData(initialFormState)
      setSelectedPost(null)
    } catch (err) {
      console.error('Error details:', err)
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    setIsLoading(true)
    setError(null)

    try {
      await deletePost(postId)
      fetchPosts()
      setFormData(initialFormState)
      setSelectedPost(null)
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getPosts()
      setPosts(response)
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white/90">Blog Manager</h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Posts List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 h-[calc(100vh-180px)] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white/90">Posts</h2>
            <button
              onClick={() => {
                setSelectedPost(null)
                setFormData(initialFormState)
              }}
              className="px-3 py-1.5 text-sm bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              New Post
            </button>
          </div>

          <div className="space-y-3">
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => {
                  setSelectedPost(post)
                  setFormData({
                    title: post.title,
                    content: post.content,
                    imageUrl: post.imageUrl || '',
                  })
                }}
                className={`group relative p-4 rounded-lg cursor-pointer transition-all ${
                  selectedPost?._id === post._id
                    ? 'bg-blue-500/10 border border-blue-500/30'
                    : 'bg-gray-700/30 hover:bg-gray-700/50 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-white/90 group-hover:text-white transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {post.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                )}

                <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Form */}
        <div className="md:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 h-[calc(100vh-180px)] overflow-y-auto">
          <h2 className="text-lg font-medium text-white/90 mb-6">
            {selectedPost ? 'Edit Post' : 'Create New Post'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm text-gray-400">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="Enter post title..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm text-gray-400">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none"
                placeholder="Write your post content..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm text-gray-400">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg transition-colors text-sm font-medium"
              >
                {selectedPost ? 'Update Post' : 'Create Post'}
              </button>

              {selectedPost && (
                <>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedPost._id)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPost(null)
                      setFormData(initialFormState)
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-lg transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostManager
