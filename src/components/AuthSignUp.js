import React , { useState  } from "react";
import { Link, withRouter } from 'react-router-dom'
import firebase from '../firebase'
import '../App.css';

function AuthSignUp (props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name , setName] = useState('');


  const validateForm  = () => {
      return (
        email.length > 0 &&
        name.length > 0 &&
        password.length >= 6 
      );
  }  

return (
    <div className="App">
      <h2>Sign Up</h2>
      <div className="container">
        <form onSubmit={e => e.preventDefault() && false }>
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
          <button onClick={onRegister} type="submit">Submit</button>
        </form>
      </div>
      <Link className="link" to="/login">Already have a account? plase log in </Link>
    </div>
  )
    async function onRegister() {
    try {
      await firebase.register(name, email, password)
      props.history.replace('/projectsp')
    } catch(error) {
      alert(error.message)
    }
  }
}

export default withRouter(AuthSignUp);
