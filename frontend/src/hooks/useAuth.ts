import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { authApi } from '../services/authApi'
import { User } from '../types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem('auth')
    return stored ? JSON.parse(stored) : { user: null, accessToken: null, refreshToken: null }
  })

  const queryClient = useQueryClient()

  // Check if user is authenticated
  const { data: user, isLoading } = useQuery(
    ['user', authState.accessToken],
    () => authApi.getProfile(),
    {
      enabled: !!authState.accessToken,
      retry: false,
      onError: () => {
        // Clear auth state on error
        setAuthState({ user: null, accessToken: null, refreshToken: null })
        localStorage.removeItem('auth')
      }
    }
  )

  // Login mutation
  const loginMutation = useMutation(authApi.login, {
    onSuccess: (data) => {
      const newAuthState = {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      }
      setAuthState(newAuthState)
      localStorage.setItem('auth', JSON.stringify(newAuthState))
      queryClient.invalidateQueries(['user'])
    }
  })

  // Logout mutation
  const logoutMutation = useMutation(authApi.logout, {
    onSuccess: () => {
      setAuthState({ user: null, accessToken: null, refreshToken: null })
      localStorage.removeItem('auth')
      queryClient.clear()
    }
  })

  // Update auth state when user data changes
  useEffect(() => {
    if (user && authState.user?.id !== user.id) {
      const newAuthState = { ...authState, user }
      setAuthState(newAuthState)
      localStorage.setItem('auth', JSON.stringify(newAuthState))
    }
  }, [user, authState])

  const login = (email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password })
  }

  const logout = () => {
    if (authState.refreshToken) {
      return logoutMutation.mutateAsync({ refreshToken: authState.refreshToken })
    }
    // If no refresh token, just clear state
    setAuthState({ user: null, accessToken: null, refreshToken: null })
    localStorage.removeItem('auth')
    queryClient.clear()
  }

  return {
    user: authState.user,
    isAuthenticated: !!authState.accessToken,
    isLoading: isLoading || loginMutation.isLoading || logoutMutation.isLoading,
    login,
    logout,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error
  }
} 