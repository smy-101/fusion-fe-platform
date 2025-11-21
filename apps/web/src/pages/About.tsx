import React from 'react'

const About: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              This is an enterprise-grade frontend platform built with the latest technologies and best practices.
            </p>
            <h3 className="text-lg font-semibold mt-6 mb-3">Technology Stack</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>React 18 with TypeScript</li>
              <li>Vite for fast development and building</li>
              <li>Tailwind CSS for styling</li>
              <li>Zustand for state management</li>
              <li>TanStack Query for server state</li>
              <li>React Router v7 for routing</li>
              <li>Monorepo architecture with pnpm workspaces</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About