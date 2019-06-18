import React from "react";
import { auth} from './fire';
import { Redirect, Route } from "react-router-dom";

const isAuthenticated = () => {
  const { currentUser } = auth;
  console.log(currentUser);
  return currentUser;
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