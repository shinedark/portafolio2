import React from 'react'

function PostForm({
  formData,
  selectedPost,
  isLoading,
  onSubmit,
  onChange,
  onDelete,
  onCancel,
}) {
  return (
    <div className="sticky top-20">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            disabled={isLoading}
            className="font-mono w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg
              focus:outline-none focus:border-white/20 transition-colors text-white/90 text-sm
              placeholder:text-white/20 disabled:opacity-50"
            placeholder="Title"
          />
        </div>

        <div className="flex gap-2">
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={onChange}
            required
            disabled={isLoading}
            className="font-mono px-3 py-2 bg-transparent border border-white/10 rounded-lg
              focus:outline-none focus:border-white/20 transition-colors text-white/90 text-sm
              disabled:opacity-50"
          >
            <option value="code">Code</option>
            <option value="design">Design</option>
            <option value="docs">Documentation</option>
            <option value="test">Test</option>
            <option value="blog">Blog</option>
            <option value="other">Other</option>
          </select>

          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={onChange}
            disabled={isLoading}
            className="font-mono flex-1 px-3 py-2 bg-transparent border border-white/10 rounded-lg
              focus:outline-none focus:border-white/20 transition-colors text-white/90 text-sm
              placeholder:text-white/20 disabled:opacity-50"
            placeholder="Image URL (optional)"
          />
        </div>

        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={onChange}
          required
          disabled={isLoading}
          rows={12}
          className="font-mono w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg
            focus:outline-none focus:border-white/20 transition-colors text-white/90 text-sm
            placeholder:text-white/20 resize-none disabled:opacity-50"
          placeholder="Write your content..."
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="font-mono flex-1 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10
              disabled:opacity-50 rounded-lg transition-colors text-sm text-white/90"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border border-white/20 border-t-white/90 rounded-full animate-spin"></div>
                <span>{selectedPost ? 'Updating...' : 'Creating...'}</span>
              </span>
            ) : (
              <span>{selectedPost ? 'Update' : 'Create'}</span>
            )}
          </button>

          {selectedPost && (
            <>
              <button
                type="button"
                onClick={onDelete}
                disabled={isLoading}
                className="font-mono px-4 py-2 border border-red-500/20 text-red-400 
                  hover:bg-red-500/10 disabled:opacity-50 rounded-lg transition-colors text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="font-mono px-4 py-2 border border-white/10 hover:bg-white/5 
                  rounded-lg transition-colors text-sm text-white/90 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default PostForm
