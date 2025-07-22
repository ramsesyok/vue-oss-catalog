import { defineStore } from 'pinia'

interface AuthState {
  basicUser: string
  basicPass: string
  // future: jwtToken?: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    basicUser: import.meta.env.VITE_BASIC_USER ?? '',
    basicPass: import.meta.env.VITE_BASIC_PASS ?? '',
  }),
  actions: {
    setBasic (user: string, pass: string) {
      this.basicUser = user
      this.basicPass = pass
    },
    // future: setJwt(token: string) { ... }
  },
})
