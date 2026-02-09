import { Button, Form } from 'reactstrap'
import client from '../apiClient'
import { useHistory } from "react-router-dom"
import { useAuth } from './AuthContext'

function Login() {
    const history = useHistory()
    const { user, refetch } = useAuth()

    if (user) {
        history.push("/profile")
        return null
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        const data = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        try {
            await client.post('/login', data)
            console.log("User logged in successfully")
            await refetch()
            history.push("/profile")
        } catch (error) {
            console.log(error?.response, "error data")
            console.error("Login failed", error)
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <Form onSubmit={handleLogin}>
                <input type="email" name="email" placeholder="Email" required />
                <br />
                <input type="password" name="password" placeholder="Password" required />
                <br />
                <Button className="btn btn-primary" type="submit">Login</Button>
            </Form>
        </div>
    )
}

export default Login