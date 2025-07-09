import { TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, PieChart, Activity } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Reconciliation Analytics</h1>
          <p className="text-sm text-dark-400 mt-1">Comprehensive analysis of trade reconciliation performance and compliance • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-dark-400">
          <Activity size={16} />
          <span>Last updated: 1 min ago</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Match Rate</p>
              <p className="text-2xl font-bold text-white mt-1">99.2%</p>
              <p className="text-xs text-success-400 mt-1">+0.3% this week</p>
            </div>
            <div className="w-10 h-10 bg-success-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-success-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-white mt-1">2.3h</p>
              <p className="text-xs text-primary-400 mt-1">-0.5h improvement</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Clock className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Compliance Score</p>
              <p className="text-2xl font-bold text-white mt-1">98.5%</p>
              <p className="text-xs text-cyan-400 mt-1">Above target</p>
            </div>
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-cyan-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Critical Issues</p>
              <p className="text-2xl font-bold text-white mt-1">3</p>
              <p className="text-xs text-danger-400 mt-1">Requires attention</p>
            </div>
            <div className="w-10 h-10 bg-danger-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-danger-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Daily Reconciliation Trends</h2>
          <div className="h-64 bg-dark-800/20 rounded-lg flex items-center justify-center border border-dark-700/20">
            <div className="text-center">
              <PieChart className="text-dark-400 mx-auto mb-2" size={48} />
              <p className="text-dark-400">Chart component coming soon</p>
              <p className="text-sm text-dark-500">Daily reconciliation volume and success rates</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Commodity Breakdown</h2>
          <div className="h-64 bg-dark-800/20 rounded-lg flex items-center justify-center border border-dark-700/20">
            <div className="text-center">
              <BarChart3 className="text-dark-400 mx-auto mb-2" size={48} />
              <p className="text-dark-400">Chart component coming soon</p>
              <p className="text-sm text-dark-500">Reconciliation performance by commodity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Trader Performance</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div>
                <p className="text-white font-medium">John Trader</p>
                <p className="text-sm text-dark-400">Crude Oil Specialist</p>
              </div>
              <div className="text-right">
                <p className="text-success-400 font-semibold">99.8%</p>
                <p className="text-xs text-dark-400">Match Rate</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div>
                <p className="text-white font-medium">Sarah Risk</p>
                <p className="text-sm text-dark-400">Risk Manager</p>
              </div>
              <div className="text-right">
                <p className="text-success-400 font-semibold">99.5%</p>
                <p className="text-xs text-dark-400">Match Rate</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div>
                <p className="text-white font-medium">Mike Energy</p>
                <p className="text-sm text-dark-400">Natural Gas Trader</p>
              </div>
              <div className="text-right">
                <p className="text-warning-400 font-semibold">97.2%</p>
                <p className="text-xs text-dark-400">Match Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Discrepancy Analysis</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div>
                <p className="text-white font-medium">Price Mismatches</p>
                <p className="text-sm text-dark-400">Most common issue</p>
              </div>
              <div className="text-right">
                <p className="text-danger-400 font-semibold">8</p>
                <p className="text-xs text-dark-400">This month</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div>
                <p className="text-white font-medium">Missing Records</p>
                <p className="text-sm text-dark-400">Risk management</p>
              </div>
              <div className="text-right">
                <p className="text-warning-400 font-semibold">3</p>
                <p className="text-xs text-dark-400">This month</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div>
                <p className="text-white font-medium">Quantity Errors</p>
                <p className="text-sm text-dark-400">Unit conversions</p>
              </div>
              <div className="text-right">
                <p className="text-danger-400 font-semibold">1</p>
                <p className="text-xs text-dark-400">This month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Compliance Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white text-sm">Regulatory Compliance</span>
                <span className="text-success-400 text-sm">100%</span>
              </div>
              <div className="w-full bg-dark-800/40 rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white text-sm">Audit Readiness</span>
                <span className="text-success-400 text-sm">98.5%</span>
              </div>
              <div className="w-full bg-dark-800/40 rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white text-sm">Documentation</span>
                <span className="text-warning-400 text-sm">95.2%</span>
              </div>
              <div className="w-full bg-dark-800/40 rounded-full h-2">
                <div className="bg-warning-500 h-2 rounded-full" style={{ width: '95.2%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 