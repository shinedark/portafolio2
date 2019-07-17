import React , { useState , useEffect } from "react";
import firebase from "../firebase";
import "../App.css";

function Blog(props) {
  const checkForUser = () => {
    if (!firebase.getCurrentUsername()) {
      // not logged in
      props.history.replace("/login");
      return null;
    }
  };
  checkForUser();
  const [title, setTitle] = useState('');
  const [blogPost, setBlogPost] = useState('');
  const [getBlogPostTitle, setGetBlogPostTitle] = useState('');
  const [getBlogBody, setBlogBody] = useState('');
  const renderBlogPostCreate = () => {
    if (firebase.checkForWrite()) {
      console.log("bingo");
      return (
        <div>
          <form className="blog" onSubmit={e => e.preventDefault() && false}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
            />
            <textarea
              value={blogPost}
              onChange={e => setBlogPost(e.target.value)}
              type="text"
              placeholder="blog Post"
            />
            <button onClick={submitBlog} type="submit">
              Submit
            </button>
          </form>
        </div>
      );
    }
  };

  useEffect(() => {
    const blogPosts = firebase.db.ref(`blog/post`).limitToLast(1)
    blogPosts.once("value" , snapshot => { 
        snapshot.forEach((child) => {
            const post = child.val().blogPost;
            const postTitle = child.val().title;
            setGetBlogPostTitle(postTitle)
            setBlogBody(post)
            return post 
        })
    })
},[])

  const renderBlogPosts = () => {
   
    return (
        <div>
            <h2>Posts</h2>
            <h4>{getBlogPostTitle}</h4>
            <p className="blogBody">{getBlogBody}</p>
        </div>
    )
  }

  return (
    <div className="App">
      <h1>Thought's and Practice</h1>
      {renderBlogPostCreate() || renderBlogPosts()}
    </div>
  )
  async function submitBlog() {
    try {
      console.log('submited', title, blogPost)
      await firebase.addBlogPost(title, blogPost)
      await setTitle('') 
      await setBlogPost('')
    } catch(error) {
      alert(error.message)
    }
  }
}

export default Blog;
