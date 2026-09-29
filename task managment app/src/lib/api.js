import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 7000,
})

// Yahan Axios request interceptor isliye use kiya hai kyunki har protected API request ko ek jagah se saved JWT header chahiye.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('task-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Yahan Axios response interceptor isliye use kiya hai kyunki kisi bhi endpoint se 401 aaye toh auth context ko logout event bhejna hai.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) window.dispatchEvent(new Event('auth:expired'))
    return Promise.reject(error)
  },
)

export default api