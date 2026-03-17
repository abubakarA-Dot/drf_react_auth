import { Switch, Route } from "react-router-dom"
import Login from "./Auth/Login"
import Registration from "./Auth/Registration"
import PublicRoute from "./PublicRoutes"
import PrivateRoute from "./PrivateRoute"
import Profile from "./ProfileSettings/Profile"
import Settings from "./ProfileSettings/Settings"
import Header from "./Navbar/Header"
import UsersList from "./Users/List"
import { EditUser } from "./Users/Edit"

const AppRoutes = () => {
  return (
    <>
      <Header />
      <Switch>
        <PublicRoute exact path="/login" component={Login} />
        <PublicRoute exact path="/register" component={Registration} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/settings" component={Settings} />
        <PrivateRoute exact path="/users" component={UsersList} />
        <PrivateRoute exact path="/edit_user/:id" component={EditUser} />
      </Switch>
    </>
  )
}

export default AppRoutes