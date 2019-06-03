import React from "react";
import firebase from 'firebase'
import { Redirect, Route } from "react-router-dom";

const isAuthenticated = () => {
  const { currentUser } = firebase.auth();
  // console.log(currentUser);
  return !!currentUser;
}

export  const Protected = ({component: Component, ...rest}) => (
  <Route {...rest} render={renderProps => (
    isAuthenticated ? (
      <Component {...renderProps} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: {from: renderProps.location}
      }} />
    )
  )}/>
)

