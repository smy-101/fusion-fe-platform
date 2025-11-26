import React from 'react'
import { Outlet } from 'react-router'
import ProtectedRoute from './ProtectedRoute'

interface AuthLayoutProps {
  children?: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute>
      {children || <Outlet />}
    </ProtectedRoute>
  )
}

export default AuthLayout