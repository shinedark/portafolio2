import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
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
  const [searchPost, setSearchPost] = useState("intro");
  const [allPosts, setAllPosts] = useState(false);
  const [postType, setPostType] = useState("");
  const [title, setTitle] = useState("");
  const [blogPost, setBlogPost] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [getBlogPostTitle, setGetBlogPostTitle] = useState("");
  const [getBlogBody, setBlogBody] = useState("");

  const renderBlogPostCreate = () => {
    if (firebase.checkForWrite()) {
      console.log("bingo");
      return (
        <div>
          <form className="blog" onSubmit={e => e.preventDefault() && false}>
            <input
              value={postType}
              onChange={e => setPostType(e.target.value)}
              type="text"
              placeholder="post type"
            />
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
    const blogPostsF = firebase.db.ref(`blog/post/${searchPost}`).limitToLast(1);
    if (!allPosts) {
      blogPostsF.once("value", snapshot => {
        snapshot.forEach(child => {
          const post = child.val().blogPost;
          const postTitle = child.val().title;
          setGetBlogPostTitle(postTitle);
          setBlogBody(post);
          return post;
        });
      });
    } 
  }, [allPosts, searchPost]);

useEffect(() => {
    const dataArray = [];
    const blogPostsAll = firebase.db.ref(`blog/post/${searchPost}`);
    if (allPosts) {
      blogPostsAll.once("value", snapshot => {
        snapshot.forEach(function(childSnapshot) {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          dataArray.push({key: childKey, data: childData})
        });       
    }).then(function() {
      setBlogPosts(dataArray);
    });
    }
  }, [allPosts, searchPost])
 
  const renderBlogPosts = () => {
    if (!allPosts) {
      return (
        <div>
          <h2>search post</h2>
          <ol>
            <div className="searchD" onClick={() => setSearchPost("intro")}>
              Intro
            </div>
            <div className="searchD" onClick={() => setSearchPost("dev")}>
              Dev Articles
            </div>
            <div className="searchD" onClick={() => setSearchPost("self")}>
              Thoughts Articles
            </div>
          </ol>
          <h4>{getBlogPostTitle}</h4>
          <p className="blogBody">{ReactHtmlParser(getBlogBody)}</p>
          <div className="searchD" onClick={() => setAllPosts(true)}>
            All Posts
          </div>
        </div>
      );
    } 
    else {
      const list = blogPosts;
      const listPostsItems = list.map((d,i) =>(
        <div style={{marginTop: '20px', marginBottom: '80px'}} key={d.key}>
          <h4>{d.data.title}</h4>
          <h6>Blog Post #{i}</h6>
          <p className="blogBody"> {ReactHtmlParser(d.data.blogPost)} </p>
        </div>
      ));
      return (
        <div>
          <h2>search post</h2>
          <ol>
            <div className="searchD" onClick={() => setSearchPost("intro")}>
              Intro
            </div>
            <div className="searchD" onClick={() => setSearchPost("dev")}>
              Dev Articles
            </div>
            <div className="searchD" onClick={() => setSearchPost("self")}>
              Thoughts Articles
            </div>
          </ol>
          {listPostsItems}
          <div className="searchD" onClick={() => setAllPosts(false)}>
            See Less Posts
          </div>
        </div>

      )
    }
  };
  
  return (
    <div className="App">
      <h1>Thought's and Practice</h1>
      {renderBlogPostCreate() || renderBlogPosts()}
    </div>
  );
  async function submitBlog() {
    try {
      console.log("submited", title, blogPost, postType);
      await firebase.addBlogPost(title, blogPost, postType);
      await setTitle("");
      await setBlogPost("");
      await setPostType("");
    } catch (error) {
      alert(error.message);
    }
  }
}

export default Blog;
