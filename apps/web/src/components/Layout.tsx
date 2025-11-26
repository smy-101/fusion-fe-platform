import React from 'react'
import { Outlet, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@fusion/ui/Button'

const Layout: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Fusion Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
              {user && (
                <>
                  <span className="text-gray-700 px-3 py-2 text-sm">
                    欢迎, {user.name}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={logout}
                  >
                    登出
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout