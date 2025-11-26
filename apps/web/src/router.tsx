import { createBrowserRouter } from 'react-router'
import Layout from './components/Layout'
import AuthLayout from './components/AuthLayout'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout><Layout /></AuthLayout>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
])