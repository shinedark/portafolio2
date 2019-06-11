import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import Home from '../src/components/Home';
import Projects from '../src/components/Projects';
import About from '../src/components/About';


function App (props) { 

  

    return (
      <Router>
          <div className="App">
            <ul className="sideItems" style={{ listStyleType: "none", padding: 0 }}>
              <li className="sideItem">
                <Link className="linkColor" to="/">Home</Link>
              </li>
              <li className="sideItem">
                <Link className="linkColor" to="/projects">Projects</Link>
              </li>
              <li className="sideItem">
                <Link className="linkColor" to="/about">About</Link>
              </li>
            </ul>
            <div className="container" >
              <Route exact path="/" component={Home}/>
              <Route exact path="/about" component={About} />
              <Route exact path="/projects" component={Projects} />
            </div>
            
          </div>
      </Router>
    )
}

export default App;

