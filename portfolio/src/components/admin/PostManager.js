import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'

const getPosts = async () => {
  const response = await fetch('/api/posts')
  if (!response.ok) throw new Error('Failed to fetch posts')
  return response.json()
}

const createPost = async (postData) => {
  const response = await fetch('/api/contributions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
  console.log('response', response)
  if (!response.ok) throw new Error('Failed to create post')
  return response.json()
}

const updatePost = async (postId, postData) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
  if (!response.ok) throw new Error('Failed to update post')
  return response.json()
}

const deletePost = async (postId) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete post')
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
        // Update existing post
        // Replace with your API call
        await updatePost(selectedPost.id, formData)
      } else {
        // Create new post
        // Replace with your API call
        await createPost(formData)
      }

      // Refresh posts list
      fetchPosts()
      setFormData(initialFormState)
      setSelectedPost(null)
    } catch (err) {
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
      // Replace with your API call
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
      // Replace with your API call
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
    <div className="flex flex-col h-screen">
      {/* Header with Logout */}
      <div className="flex justify-between items-center bg-black/80 p-4 mb-6 rounded-lg">
        <h2 className="text-xl font-bold">Post Management</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main content - modify the existing grid container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Posts List - update the height calculation */}
        <div className="md:col-span-1 bg-black/80 rounded-lg p-4 h-[calc(100vh-280px)] overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Posts</h3>
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-md">
                {error}
              </div>
            )}
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  setSelectedPost(post)
                  setFormData(post)
                }}
                className={`p-4 rounded-md cursor-pointer transition-colors ${
                  selectedPost?.id === post.id
                    ? 'bg-blue-500/20 border border-blue-500/50'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <h4 className="font-medium">{post.title}</h4>
                <p className="text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Post Editor - no changes needed to internal content */}
        <div className="md:col-span-2 bg-black/80 rounded-lg p-6 h-[calc(100vh-280px)] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-6">
            {selectedPost ? 'Edit Post' : 'Create New Post'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
              >
                {selectedPost ? 'Update Post' : 'Create Post'}
              </button>
              {selectedPost && (
                <button
                  type="button"
                  onClick={() => handleDelete(selectedPost.id)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                >
                  Delete Post
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostManager
