import React from 'react'
import './../Admin.css'
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
    <div className="form-container">
      <form onSubmit={onSubmit} className="form-content">
        <div>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            disabled={isLoading}
            className="form-input"
            placeholder="Title"
          />
        </div>

        <div className="form-row">
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={onChange}
            required
            disabled={isLoading}
            className="form-select"
          >
            <option value="code">Code</option>
            <option value="design">Design</option>
            <option value="docs">Documentation</option>
            <option value="test">Test</option>
            <option value="blog">Blog</option>
            <option value="calculator">Calculator</option>
            <option value="other">Other</option>
          </select>

          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={onChange}
            disabled={isLoading}
            className="form-input form-url-input"
            placeholder="Image URL (optional)"
          />
        </div>

        {formData.type === 'calculator' && (
          <div className="form-row">
            <select
              id="calculatorType"
              name="calculatorType"
              value={formData.calculatorType || ''}
              onChange={onChange}
              required={formData.type === 'calculator'}
              disabled={isLoading}
              className="form-select"
            >
              <option value="">Select Calculator Type</option>
              <option value="compound">Compound Interest</option>
              <option value="mortgage">Mortgage</option>
              <option value="savings">Savings</option>
              <option value="investment">Investment</option>
              <option value="tax">Tax</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        )}

        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={onChange}
          required
          disabled={isLoading}
          rows={12}
          className="form-textarea"
          placeholder="Write your content..."
        />

        <div className="button-row">
          <button type="submit" disabled={isLoading} className="submit-button">
            <span className={isLoading ? 'button-text' : 'button-text-visible'}>
              {selectedPost ? 'Update' : 'Create'}
            </span>
            {isLoading && (
              <div className="loading-spinner-container">
                <div className="spinner" />
              </div>
            )}
          </button>

          {selectedPost && (
            <>
              <button
                type="button"
                onClick={onDelete}
                disabled={isLoading}
                className="delete-button"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="cancel-button"
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
