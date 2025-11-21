import React from 'react'
import { Button } from '@fusion/ui'

const Home: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Fusion FE Platform
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Enterprise frontend application built with React, TypeScript, and modern tooling
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">React 18</h3>
              <p className="text-gray-600 mb-4">Modern React with hooks and concurrent features</p>
              <Button variant="primary" size="sm">Test Button</Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">TypeScript</h3>
              <p className="text-gray-600">Type-safe development with full IntelliSense</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-gray-600">Utility-first CSS framework for rapid UI development</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home