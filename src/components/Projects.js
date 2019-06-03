import React from "react";
import {  Link } from "react-router-dom";
import '../App.css';



function Projects (props) { 

    return (
          <div className="auth">
            <h3>Log In or Sign Up to explore Projects</h3>
            <ul className="sideItems2" style={{ listStyleType: "none", padding: 0 }}>
              <li className="sideItem2">
                <Link className="linkColor" to="/login">Log In</Link>
              </li>
              <li className="sideItem2">
                <Link className="linkColor" to="/signup">Sign Up</Link>
              </li>
            </ul>
            
          </div>
    )
}

export default Projects;