import { useState, useEffect } from 'react'
import { useCurrentUser } from '@fusion/shared'

interface User {
  id: number
  username: string
  name: string
  role: string
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const { data: currentUserData, isLoading: currentUserLoading } = useCurrentUser()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('解析用户数据失败:', error)
        logout()
      }
    }
    
    setLoading(false)
  }, [])

  // 同步react-query的用户数据
  useEffect(() => {
    if (currentUserData?.data) {
      setUser(currentUserData.data)
      setIsAuthenticated(true)
    }
  }, [currentUserData])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  return {
    isAuthenticated,
    user,
    loading: loading || currentUserLoading,
    logout
  }
}