import React from 'react'

function PostList({ posts, selectedPost, onEdit, isLoading }) {
  return (
    <div className="sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-mono text-sm text-white/60 uppercase tracking-wider">
          Posts
        </h2>
        <button
          onClick={() => onEdit(null)}
          className="font-mono text-xs px-2 py-1 text-white/60 hover:text-white/90 border border-white/10 hover:bg-white/5 rounded transition-colors"
        >
          + New
        </button>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => onEdit(post)}
            className={`group p-3 rounded cursor-pointer transition-all ${
              selectedPost?._id === post._id
                ? 'bg-white/5 border border-white/20'
                : 'hover:bg-white/5 border border-transparent hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-mono text-sm text-white/90 group-hover:text-white">
                {post.title}
              </h3>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                {post.type}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-white/40 line-clamp-2">
              {post.content}
            </p>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border border-white/20 border-t-white/90"></div>
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="font-mono text-sm text-white/40">No posts yet</p>
            <p className="font-mono text-xs text-white/20 mt-1">
              Create your first post
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostList
