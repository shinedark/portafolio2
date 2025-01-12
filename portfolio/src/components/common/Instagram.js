import React, { useState, useEffect } from 'react'
import './Instagram.css'

const Instagram = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // You'll need to replace this with your actual Instagram access token
  const INSTAGRAM_TOKEN = process.env.REACT_APP_INSTAGRAM_TOKEN

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        if (!INSTAGRAM_TOKEN) {
          throw new Error('Instagram access token is required')
        }

        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${INSTAGRAM_TOKEN}`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts')
        }

        const data = await response.json()

        setPosts(data.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchInstagramPosts()
  }, [])

  if (loading) {
    return (
      <div className="instagram-container loading">
        Loading Instagram feed...
      </div>
    )
  }

  if (error) {
    return <div className="instagram-container error">{error}</div>
  }

  return (
    <div className="instagram-container">
      <div className="instagram-grid">
        {posts.slice(0, 18).map((post) => (
          <div key={post.id} className="instagram-post">
            <a href={post.permalink} target="_blank" rel="noopener noreferrer">
              {post.media_type === 'VIDEO' ? (
                <video
                  src={post.media_url}
                  poster={post.thumbnail_url}
                  muted
                  loop
                  playsInline
                  onClick={(e) => e.preventDefault()}
                  onMouseOver={(e) => e.target.play()}
                  onMouseOut={(e) => e.target.pause()}
                />
              ) : (
                <img src={post.media_url} alt="Instagram post" />
              )}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Instagram
