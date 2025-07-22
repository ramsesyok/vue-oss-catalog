import type { AppConfig } from '@/config'
import type { ApiError, Problem } from '@/types/problem'
import axios, { type AxiosError } from 'axios'
import { OpenAPI } from '@/api'

export function configureHttp (config: AppConfig) {
  axios.defaults.baseURL = config.apiBaseUrl
  axios.defaults.timeout = 30_000
  OpenAPI.BASE = config.apiBaseUrl
}

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
