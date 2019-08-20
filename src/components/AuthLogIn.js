import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../firebase";
import "../App.css";

function AuthLogIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="App">
      <div className="containerAuth">
        <h2>Log In</h2>
        <form onSubmit={e => e.preventDefault() && false}>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="btnAuth" onClick={login} type="submit">
            Submit
          </button>
        </form>
        <Link className="link" to="/signup">
          {" "}
          Don't have a account please <strong>Sign Up</strong>
        </Link>
      </div>
    </div>
  );
  async function login() {
    try {
      await firebase.login(email, password);
      props.history.replace("/projectsp");
    } catch (error) {
      alert(error.message);
    }
  }
}
export default withRouter(AuthLogIn);
