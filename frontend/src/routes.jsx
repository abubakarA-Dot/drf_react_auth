import { Switch } from "react-router-dom"
import Login from "./Auth/Login"
import Registration from "./Auth/Registration"
import PublicRoute from "./PublicRoutes"
import Profile from "./ProfileSettings/Profile"

const AppRoutes = () => {
  return (
    <Switch>
      <PublicRoute
        exact
        path="/login"
        component={Login}
      />

      <PublicRoute
        exact
        path="/register"
        component={Registration}
      />
      <PublicRoute
        exact
        path="/profile"
        component={Profile}
      />
    </Switch>
  )
}

export default AppRoutes
