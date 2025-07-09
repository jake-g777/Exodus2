import { Bell, Check, X, AlertTriangle, Info, Clock, Filter, Search } from 'lucide-react'

export default function Notifications() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Notifications</h1>
          <p className="text-sm text-dark-400 mt-1">System Alerts & Messages • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-dark-400">
          <Bell size={16} />
          <span>Last updated: 30 sec ago</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={16} />
            <input
              type="text"
              placeholder="Search notifications..."
              className="pl-10 pr-4 py-2 bg-dark-900/40 border border-dark-800/40 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors duration-200">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 text-sm text-primary-400 hover:text-primary-300 hover:bg-dark-800/50 rounded-lg transition-colors duration-200">
            <Check size={16} className="mr-2" />
            Mark All Read
          </button>
        </div>
      </div>
      
      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-white mt-1">47</p>
              <p className="text-xs text-dark-400 mt-1">This week</p>
            </div>
            <div className="w-10 h-10 bg-dark-500/20 rounded-lg flex items-center justify-center">
              <Bell className="text-dark-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Unread</p>
              <p className="text-2xl font-bold text-white mt-1">12</p>
              <p className="text-xs text-warning-400 mt-1">Requires attention</p>
            </div>
            <div className="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-warning-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Critical</p>
              <p className="text-2xl font-bold text-white mt-1">3</p>
              <p className="text-xs text-danger-400 mt-1">High priority</p>
            </div>
            <div className="w-10 h-10 bg-danger-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-danger-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Info</p>
              <p className="text-2xl font-bold text-white mt-1">32</p>
              <p className="text-xs text-primary-400 mt-1">System updates</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Info className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {/* Critical Notification */}
        <div className="bg-dark-900/30 border border-danger-500/20 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-danger-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-danger-400" size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-white">Critical: Data Pipeline Failure</h3>
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-danger-500/20 text-danger-400 rounded-full">
                    Critical
                  </span>
                </div>
                <p className="text-sm text-dark-400 mb-2">
                  Bloomberg API connection failed. Trade data synchronization interrupted. Immediate action required.
                </p>
                <div className="flex items-center space-x-4 text-xs text-dark-400">
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    5 min ago
                  </span>
                  <span>System Alert</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-dark-400 hover:text-white transition-colors">
                <Check size={16} />
              </button>
              <button className="p-1 text-dark-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Warning Notification */}
        <div className="bg-dark-900/30 border border-warning-500/20 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-warning-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-warning-400" size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-white">High Memory Usage Detected</h3>
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-warning-500/20 text-warning-400 rounded-full">
                    Warning
                  </span>
                </div>
                <p className="text-sm text-dark-400 mb-2">
                  Server memory usage has reached 85%. Consider scaling resources to prevent performance issues.
                </p>
                <div className="flex items-center space-x-4 text-xs text-dark-400">
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    12 min ago
                  </span>
                  <span>System Monitor</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-dark-400 hover:text-white transition-colors">
                <Check size={16} />
              </button>
              <button className="p-1 text-dark-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Info Notification */}
        <div className="bg-dark-900/30 border border-primary-500/20 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="text-primary-400" size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-white">New Trade Reconciliation Completed</h3>
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">
                    Info
                  </span>
                </div>
                <p className="text-sm text-dark-400 mb-2">
                  Batch reconciliation for 1,234 trades completed successfully. All records matched within tolerance.
                </p>
                <div className="flex items-center space-x-4 text-xs text-dark-400">
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    25 min ago
                  </span>
                  <span>Reconciliation Engine</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-dark-400 hover:text-white transition-colors">
                <Check size={16} />
              </button>
              <button className="p-1 text-dark-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Success Notification */}
        <div className="bg-dark-900/30 border border-success-500/20 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-success-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Check className="text-success-400" size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-white">Backup Completed Successfully</h3>
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-success-500/20 text-success-400 rounded-full">
                    Success
                  </span>
                </div>
                <p className="text-sm text-dark-400 mb-2">
                  Daily database backup completed. 2.3GB of data backed up to secure cloud storage.
                </p>
                <div className="flex items-center space-x-4 text-xs text-dark-400">
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    1 hour ago
                  </span>
                  <span>Backup System</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-dark-400 hover:text-white transition-colors">
                <Check size={16} />
              </button>
              <button className="p-1 text-dark-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 