import React , { useState , useEffect } from "react";
import firebase from "../firebase";
import "../App.css";

function Blog(props) {
  const checkForUser = () => {
    if (!firebase.getCurrentUsername()) {
      // not logged in
      props.history.replace("/projects");
      return null;
    }
  };
  checkForUser();
  const [title, setTitle] = useState('');
  const [blogPost, setBlogPost] = useState('');
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
    const blogPosts = firebase.db.ref(`blog/post`)
    blogPosts.once("value" , snapshot => { 
        snapshot.forEach((child) => {
            const post = child.val();
            console.log(post);
            return post 
        })
    })
},[])

  const renderBlogPosts = () => {
   
    return (
        <div>
            <h2>Posts</h2>
        </div>
    )
  }

  return (
    <div className="App">
      <h1>Blog</h1>
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
