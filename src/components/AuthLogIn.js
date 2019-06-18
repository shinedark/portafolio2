import React , { useState , useEffect } from "react";
import {Link, Redirect} from "react-router-dom";
import { auth} from '../fire';
import '../App.css';

function AuthLogIn (props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createdUser , setCreatedUser] = useState(null);

  useEffect(() => {
    // console.log(props)
  })

  const handleSubmit = (event) =>  {
      event.preventDefault();
      if (validateForm()) {
        auth.signInWithEmailAndPassword(email, password)
        .then(setCreatedUser(true))
        .catch((error) => {
          console.log(error)
        });
      }
  }


  const validateForm  = () => {
      return (
        email.length > 0 &&
        password.length >= 6 
      )
  }  

return (
    <div className="App">
      {createdUser &&(
        <Redirect to="/projectsp" />
      )}
      <h2>Log In</h2>
      <div className="container">
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Submit</button>
        </form>
      </div>
      <Link className="link" to="/signup"> Don't have a account please Sing Up</Link>
    </div>
  );
}
export default AuthLogIn;
