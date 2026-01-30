// new
import { Route, Redirect } from "react-router-dom"

const PublicRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = false // replace later

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

export default PublicRoute
