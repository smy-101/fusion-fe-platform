import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './index'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    padding: 'md',
    children: (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
        <p className="text-gray-600">This is a default card with medium padding.</p>
      </div>
    ),
  },
}

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Padding</h3>
        <p className="text-gray-600">This card has no padding, useful for custom layouts.</p>
      </div>
    ),
  },
}

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Small Padding</h3>
        <p className="text-gray-600">This card has small padding.</p>
      </div>
    ),
  },
}

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Large Padding</h3>
        <p className="text-gray-600">This card has large padding, giving more breathing room.</p>
      </div>
    ),
  },
}

export const WithCustomContent: Story = {
  args: {
    padding: 'md',
    children: (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">A</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Alex Johnson</h4>
            <p className="text-sm text-gray-600">Product Designer</p>
          </div>
        </div>
        <p className="text-gray-700">
          Passionate about creating beautiful and functional user interfaces. 
          Love working with React and TypeScript.
        </p>
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Design</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">React</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">TypeScript</span>
        </div>
      </div>
    ),
  },
}

export const FormCard: Story = {
  args: {
    padding: 'lg',
    children: (
      <form className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Contact Form</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter your message"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Send Message
        </button>
      </form>
    ),
  },
}