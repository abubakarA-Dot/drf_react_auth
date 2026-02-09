import { Route, Redirect } from "react-router-dom"
import { useAuth } from "./Auth/AuthContext"

const PublicRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth()

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Redirect to="/profile" />
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

export default PublicRoute