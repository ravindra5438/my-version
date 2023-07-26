import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const UserAccess = ({ component: Component, ...rest }) => {

  let token = sessionStorage.getItem('loginDetails');
  
  return (
    <Route
      {...rest}
      render={props =>
          (token) ?
            (
              <Component {...props} />
            ) :
            (<Redirect to="/login" />)
      }
    />
  )
}

export default UserAccess