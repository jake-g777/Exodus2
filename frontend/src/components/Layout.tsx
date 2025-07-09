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
  User,
  Activity,
  FolderOpen,
  Database,
  Bell,
  Shield
} from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Tie-outs', href: '/trading', icon: TrendingUp },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Datamappings', href: '/datamappings', icon: Database },
  { name: 'Notifications', href: '/notifications', icon: Bell },
]

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Shield },
]

const settingsNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/95 border-b border-dark-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gradient">Exodus</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative group">
                                <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
              <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Connected to NY4
              </div>
            </div>
            
            {/* User Profile and Logout */}
            <div className="flex items-center space-x-3 ml-6 pl-4 border-l border-dark-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-primary-600/20 rounded-lg flex items-center justify-center border border-primary-500/30">
                  <User size={14} className="text-primary-400" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-dark-400 capitalize">{user?.role.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center px-3 py-1.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors duration-200"
              >
                <LogOut size={16} className="mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-black/95 border-r border-dark-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 border-b border-dark-800/50">
            <h1 className="text-lg font-semibold text-gradient">Navigation</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-dark-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' 
                      : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={16} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
            
            {/* Admin Panel - Only for admin users */}
            {user?.role === 'admin' && (
              <>
                <div className="pt-4 mt-4 border-t border-dark-800/50">
                  <p className="px-3 text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">Admin</p>
                </div>
                {adminNavigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-red-600/20 text-red-400 border border-red-500/30' 
                          : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon size={16} className="mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </>
            )}
            
            {/* Settings */}
            <div className="pt-4 mt-4 border-t border-dark-800/50">
              <p className="px-3 text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">System</p>
            </div>
            {settingsNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' 
                      : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={16} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar - Slim with icons only */}
      <div className="hidden lg:fixed lg:flex lg:w-16 lg:flex-col" style={{ top: '60px', bottom: '0px' }}>
        <div className="flex flex-col flex-grow bg-black/95 border-r border-dark-800/50 backdrop-blur-sm">
          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <div key={item.name} className="relative">
                  <Link
                    to={item.href}
                    className={`group flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' 
                        : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                    }`}
                  >
                    <item.icon size={18} />
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none">
                      {item.name}
                    </div>
                  </Link>
                </div>
              )
            })}
          </nav>
          
          {/* Admin Panel - Only for admin users */}
          {user?.role === 'admin' && (
            <div className="p-2 border-t border-dark-800/50">
              {adminNavigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <div key={item.name} className="relative">
                    <Link
                      to={item.href}
                      className={`group flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-red-600/20 text-red-400 border border-red-500/30' 
                          : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                      }`}
                    >
                      <item.icon size={18} />
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none">
                        {item.name}
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
          
          {/* Settings at bottom */}
          <div className="p-2 border-t border-dark-800/50">
            {settingsNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <div key={item.name} className="relative">
                  <Link
                    to={item.href}
                    className={`group flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' 
                        : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                    }`}
                  >
                    <item.icon size={18} />
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none">
                      {item.name}
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom navbar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-16 bg-black/95 border-t border-dark-800/50 backdrop-blur-sm z-30">
        <div className="flex items-center justify-between px-4 py-2 text-xs text-dark-400">
          <div className="flex items-center space-x-4">
            <span>v1.0.0</span>
            <span>•</span>
            <span>Premium Subscription</span>
            <span>•</span>
            <span>Exodus Trading Corp</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-16 pt-12">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-dark-800/50 bg-black/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-dark-400 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold text-gradient">Navigation</h1>
          <div className="w-5" />
        </div>

        {/* Page content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 