import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import firebase from "../firebase";
import "../App.css";

function AuthSignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="App">
      <div>
        <h2>Sign Up</h2>
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
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="Name"
          />
          <button className="btnAuth" onClick={onRegister} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  async function onRegister() {
    try {
      await firebase.register(name, email, password);
      props.history.replace("/projectsp");
    } catch (error) {
      alert(error.message);
    }
  }
}

export default withRouter(AuthSignUp);
