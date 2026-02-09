import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;