import { Shield, Users, Settings, Activity, Database, Server, Key, Eye } from 'lucide-react'

export default function Admin() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
          <p className="text-sm text-dark-400 mt-1">System Administration • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-dark-400">
          <Shield size={16} />
          <span>Admin Access</span>
        </div>
      </div>
      
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Active Users</p>
              <p className="text-2xl font-bold text-white mt-1">47</p>
              <p className="text-xs text-success-400 mt-1">+3 this week</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Users className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">System Health</p>
              <p className="text-2xl font-bold text-white mt-1">98%</p>
              <p className="text-xs text-primary-400 mt-1">All systems operational</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Activity className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Database</p>
              <p className="text-2xl font-bold text-white mt-1">2.3TB</p>
              <p className="text-xs text-warning-400 mt-1">75% capacity</p>
            </div>
            <div className="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
              <Database className="text-warning-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">API Calls</p>
              <p className="text-2xl font-bold text-white mt-1">1.2M</p>
              <p className="text-xs text-primary-400 mt-1">Today</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Server className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">User Management</h2>
            <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center">
                  <Users size={14} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Active Users</p>
                  <p className="text-xs text-dark-400">47 users online</p>
                </div>
              </div>
              <span className="text-sm text-primary-400">47</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center">
                  <Key size={14} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Admin Users</p>
                  <p className="text-xs text-dark-400">5 administrators</p>
                </div>
              </div>
              <span className="text-sm text-primary-400">5</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warning-600/20 rounded-lg flex items-center justify-center">
                  <Eye size={14} className="text-warning-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Pending Approvals</p>
                  <p className="text-xs text-dark-400">3 user requests</p>
                </div>
              </div>
              <span className="text-sm text-warning-400">3</span>
            </div>
          </div>
        </div>

        {/* System Monitoring */}
        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">System Monitoring</h2>
            <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              View Details
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">CPU Usage</span>
                <span className="text-sm text-primary-400">45%</span>
              </div>
              <div className="w-full bg-dark-800/40 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">Memory Usage</span>
                <span className="text-sm text-warning-400">78%</span>
              </div>
              <div className="w-full bg-dark-800/40 rounded-full h-2">
                <div className="bg-warning-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">Disk Usage</span>
                <span className="text-sm text-primary-400">62%</span>
              </div>
              <div className="w-full bg-dark-800/40 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">Network</span>
                <span className="text-sm text-primary-400">23%</span>
              </div>
              <div className="w-full bg-dark-800/40 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Admin Activity</h2>
          <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <div>
                <p className="text-sm text-white font-medium">User access granted</p>
                <p className="text-xs text-dark-400">New user account created for John Smith</p>
              </div>
            </div>
            <span className="text-xs text-dark-400">2 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <div>
                <p className="text-sm text-white font-medium">System backup completed</p>
                <p className="text-xs text-dark-400">Daily backup to cloud storage successful</p>
              </div>
            </div>
            <span className="text-xs text-dark-400">1 hour ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning-400 rounded-full"></div>
              <div>
                <p className="text-sm text-white font-medium">Security alert</p>
                <p className="text-xs text-dark-400">Multiple failed login attempts detected</p>
              </div>
            </div>
            <span className="text-xs text-dark-400">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  )
} 