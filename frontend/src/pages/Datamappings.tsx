import { Database, Plus, Search, Filter, Activity, Settings, RefreshCw } from 'lucide-react'

export default function Datamappings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Data Mappings</h1>
          <p className="text-sm text-dark-400 mt-1">Data Integration & Mapping • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-dark-400">
          <Activity size={16} />
          <span>Last updated: 1 min ago</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={16} />
            <input
              type="text"
              placeholder="Search mappings..."
              className="pl-10 pr-4 py-2 bg-dark-900/40 border border-dark-800/40 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors duration-200">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button className="flex items-center px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors duration-200">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
          <Plus size={16} className="mr-2" />
          New Mapping
        </button>
      </div>
      
      {/* Mapping Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Total Mappings</p>
              <p className="text-2xl font-bold text-white mt-1">156</p>
              <p className="text-xs text-success-400 mt-1">+12 this week</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Database className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Active</p>
              <p className="text-2xl font-bold text-white mt-1">142</p>
              <p className="text-xs text-primary-400 mt-1">91% success rate</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Activity className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Failed</p>
              <p className="text-2xl font-bold text-white mt-1">8</p>
              <p className="text-xs text-danger-400 mt-1">Requires attention</p>
            </div>
            <div className="w-10 h-10 bg-danger-500/20 rounded-lg flex items-center justify-center">
              <Settings className="text-danger-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Data Sources</p>
              <p className="text-2xl font-bold text-white mt-1">23</p>
              <p className="text-xs text-warning-400 mt-1">3 pending sync</p>
            </div>
            <div className="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
              <RefreshCw className="text-warning-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Mappings Table */}
      <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-dark-800/30">
          <h2 className="text-lg font-semibold text-white">Recent Mappings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-800/20">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Mapping Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Source</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Target</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Last Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/30">
              <tr className="hover:bg-dark-800/10 transition-colors duration-200">
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-white">Trade Data Mapping</p>
                    <p className="text-xs text-dark-400">ID: MAP-001</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-white">Bloomberg API</td>
                <td className="px-5 py-4 text-sm text-white">Internal DB</td>
                <td className="px-5 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">
                    Active
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-dark-400">2 min ago</td>
              </tr>
              
              <tr className="hover:bg-dark-800/10 transition-colors duration-200">
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-white">Risk Metrics Mapping</p>
                    <p className="text-xs text-dark-400">ID: MAP-002</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-white">Reuters Feed</td>
                <td className="px-5 py-4 text-sm text-white">Risk Engine</td>
                <td className="px-5 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">
                    Processing
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-dark-400">5 min ago</td>
              </tr>
              
              <tr className="hover:bg-dark-800/10 transition-colors duration-200">
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-white">Compliance Data</p>
                    <p className="text-xs text-dark-400">ID: MAP-003</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-white">Regulatory API</td>
                <td className="px-5 py-4 text-sm text-white">Compliance DB</td>
                <td className="px-5 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-danger-500/20 text-danger-400 rounded-full">
                    Failed
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-dark-400">15 min ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 