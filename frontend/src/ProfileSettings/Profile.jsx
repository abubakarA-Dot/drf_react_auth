import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

function Profile() {
  const history = useHistory();

  const { data: user } = useQuery({
  queryKey: ["users/me"],
  queryFn: () => apiClient.get("/users/me").then(res => res.data),
});

  const handleLogout = async () => {
    try {
      await apiClient.post("/logout");
      history.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  if (!user) return history.push("/login");

  return (
    <div>
      <h2>Profile Page</h2>
      <p>Welcome to your profile! {user?.name || user?.email}</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default Profile;
