import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  BarChart3, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Menu,
  X,
  User
} from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Trading', href: '/trading', icon: TrendingUp },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-dark-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-dark-900 border-r border-dark-700">
          <div className="flex items-center justify-between p-4 border-b border-dark-700">
            <h1 className="text-xl font-bold text-gradient">Energy Trading</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-dark-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-dark-900 border-r border-dark-700">
          <div className="flex items-center p-4 border-b border-dark-700">
            <h1 className="text-xl font-bold text-gradient">Energy Trading</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-dark-700">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                <User size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-dark-400">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors duration-200"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-dark-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-dark-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-gradient">Energy Trading</h1>
          <div className="w-6" />
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 