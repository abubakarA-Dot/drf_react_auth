import { Switch } from "react-router-dom"
import Login from "./Auth/Login"
import Registration from "./Auth/Registration"
import PublicRoute from "./PublicRoutes"
import Profile from "./ProfileSettings/Profile"
import { useQuery } from "@tanstack/react-query"
import { useHistory } from "react-router-dom";
import apiClient from "./apiClient"

const AppRoutes = () => {
  const history = useHistory();
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["users/me"],
    queryFn: () => apiClient.get("/users/me").then(res => res.data),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user && !['/login', '/register'].includes(window.location.pathname)) {
    history.push("/login");
    return null;
  }
  return (
    <>
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
    </>
  )
}

export default AppRoutes