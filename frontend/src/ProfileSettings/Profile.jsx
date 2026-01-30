import { useHistory } from "react-router-dom"
import { Button } from "reactstrap"
import apiClient from "../apiClient";


function Profile() {
  const history  = useHistory();

  const handleLogout = async () => {
    try {
      await apiClient.post('/logout');
      history.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div>
      <h2>Profile Page</h2>
        <p>Welcome to your profile!</p>
        <div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
    </div>
  )
}

export default Profile
