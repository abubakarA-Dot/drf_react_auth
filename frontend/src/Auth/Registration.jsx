import { Form } from "reactstrap";
import client from '../apiClient';
import { useHistory } from "react-router-dom"

function Registration() {
  const history = useHistory()
  const handleRegistration = async (e) => {
    
        e.preventDefault()

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }

        try {
            await client.post('/register', data)
            history.push("/login")
        } catch (error) {
            console.error("Registration failed", error)
        }
    }

  return (
    <div>
      <h2>Register</h2>

      <Form onSubmit={handleRegistration}>
        <input type="text" placeholder="Name" name="name" />
        <br />
        <input type="email" placeholder="Email" name="email" />
        <br />
        <input type="password" placeholder="Password" name="password" />
        <br />
        <button type="submit">Register</button>
      </Form>
    </div>
  )
}

export default Registration
