import axios from "axios"

const client = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

client.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error)
  }
)

const apiClient = {
  get: (url, config) => client.get(url, config),
  post: (url, data, config) => client.post(url, data, config),
  put: (url, data, config) => client.put(url, data, config),
  delete: (url, config) => client.delete(url, config),
}

export default apiClient