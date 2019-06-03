import React , { useState  } from "react";
import firebase from 'firebase';
import { auth } from '../fire';
import {
  Link,
  Redirect,
} from "react-router-dom";
import '../App.css';

function AuthSignUp () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patient , setPatient] = useState('');
  const [createdUser , setCreatedUser] = useState(null);



  const UserRef = (user , patient ) => {
      auth.onAuthStateChanged(user => {
        firebase.database().ref(`/users/${user.uid}/`)
        .push({ patient })
    });
  }

  const handleSubmit = (event) =>  {
      event.preventDefault();
      if (validateForm()) {
        auth.createUserWithEmailAndPassword(email, password)
        .then(user => UserRef(user, patient) , setCreatedUser(true))
        .catch((error) => {
          console.log(error)
        });
      }
  }

  const validateForm  = () => {
      return (
        email.length > 0 &&
        patient.length > 0 &&
        password.length >= 6 
      );
  }  

return (
    <div className="App">
      {createdUser &&(
        <Redirect to="/projectsp" />
      )}
      <h2>Sign Up</h2>
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
          <input
            value={patient}
            onChange={e => setPatient(e.target.value)}
            type="text"
            placeholder="Name"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <Link className="link" to="/login">Already have a account? plase log in </Link>
    </div>
  );
}

export default AuthSignUp;

