import type { ApiError, Problem } from '@/types/problem'
import axios, { type AxiosError } from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.timeout = 30_000

axios.interceptors.request.use(config => {
  const user = import.meta.env.VITE_BASIC_USER
  const pass = import.meta.env.VITE_BASIC_PASS
  const credentials = btoa(`${user}:${pass}`)
  config.headers = config.headers || {}
  if (!('Authorization' in config.headers)) {
    config.headers['Authorization'] = `Basic ${credentials}`
  }
  return config
})

axios.interceptors.response.use(
  response => response,
  (error: AxiosError<Problem>) => {
    const problem = error.response?.data
    const apiError: ApiError = new Error(problem?.title || 'ネットワークエラー') as ApiError
    apiError.status = error.response?.status
    if (problem && problem.title) {
      apiError.problem = problem
    }
    return Promise.reject(apiError)
  },
)

export { default } from 'axios'
