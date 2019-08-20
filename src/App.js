import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "../src/components/Home";
import Projects from "../src/components/Projects";
import ProjectsP from "../src/components/ProjectsP";
import About from "../src/components/About";
import Blog from "../src/components/Blog";
import firebase from "./firebase";

function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    firebase.isInitialized().then(val => {
      setFirebaseInitialized(val);
    });
  });

  return firebaseInitialized !== false ? (
    <Router>
      <div className="App">
        <ul className="sideItems" style={{ listStyleType: "none", padding: 0 }}>
          <li className="sideItem">
            <Link className="linkColor" to="/">
              Home
            </Link>
          </li>
          <li className="sideItem">
            <Link className="linkColor" to="/projects">
              Projects
            </Link>
          </li>
          <li className="sideItem">
            <Link className="linkColor" to="/about">
              About
            </Link>
          </li>
        </ul>
        <div className="container">
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/blog" component={Blog} />
          <Route exact path="/projects" component={Projects} />
          <Route exact path="/projectsp" component={ProjectsP} />
        </div>
      </div>
    </Router>
  ) : (
    <div id="loader">Loading ...</div>
  );
}

export default App;
