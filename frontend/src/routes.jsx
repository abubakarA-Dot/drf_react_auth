import { Switch, Route } from "react-router-dom"
import Login from "./Auth/Login"
import Registration from "./Auth/Registration"
import PublicRoute from "./PublicRoutes"
import PrivateRoute from "./PrivateRoute"
import Profile from "./ProfileSettings/Profile"
import Header from "./Navbar/Header"

const AppRoutes = () => {
  return (
    <>
      <Header />
      <Switch>
        <PublicRoute exact path="/login" component={Login} />
        <PublicRoute exact path="/register" component={Registration} />
        <PrivateRoute exact path="/profile" component={Profile} />
        {/* <PrivateRoute exact path="/dashboard" component={Dashboard} /> */}
      </Switch>
    </>
  )
}

export default AppRoutes