import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const isLoggedIn = ref(false)

  function login(user: User) {
    currentUser.value = user
    isLoggedIn.value = true
  }

  function logout() {
    currentUser.value = null
    isLoggedIn.value = false
  }

  return {
    currentUser,
    isLoggedIn,
    login,
    logout
  }
})