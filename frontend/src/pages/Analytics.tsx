import { TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, PieChart } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reconciliation Analytics</h1>
        <p className="text-dark-400">Comprehensive analysis of trade reconciliation performance and compliance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Match Rate</h3>
              <p className="text-3xl font-bold text-success-400">99.2%</p>
            </div>
            <div className="w-12 h-12 bg-success-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-success-400" size={24} />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Avg Resolution Time</h3>
              <p className="text-3xl font-bold text-primary-400">2.3h</p>
            </div>
            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Clock className="text-primary-400" size={24} />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Compliance Score</h3>
              <p className="text-3xl font-bold text-cyan-400">98.5%</p>
            </div>
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-cyan-400" size={24} />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Critical Issues</h3>
              <p className="text-3xl font-bold text-danger-400">3</p>
            </div>
            <div className="w-12 h-12 bg-danger-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-danger-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Daily Reconciliation Trends</h2>
          <div className="h-64 bg-dark-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="text-dark-400 mx-auto mb-2" size={48} />
              <p className="text-dark-400">Chart component coming soon</p>
              <p className="text-sm text-dark-500">Daily reconciliation volume and success rates</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Commodity Breakdown</h2>
          <div className="h-64 bg-dark-700 rounded-lg flex items-center justify-center">
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
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Trader Performance</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div>
                <p className="text-white font-medium">John Trader</p>
                <p className="text-sm text-dark-400">Crude Oil Specialist</p>
              </div>
              <div className="text-right">
                <p className="text-success-400 font-semibold">99.8%</p>
                <p className="text-xs text-dark-400">Match Rate</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div>
                <p className="text-white font-medium">Sarah Risk</p>
                <p className="text-sm text-dark-400">Risk Manager</p>
              </div>
              <div className="text-right">
                <p className="text-success-400 font-semibold">99.5%</p>
                <p className="text-xs text-dark-400">Match Rate</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
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

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Discrepancy Analysis</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div>
                <p className="text-white font-medium">Price Mismatches</p>
                <p className="text-sm text-dark-400">Most common issue</p>
              </div>
              <div className="text-right">
                <p className="text-danger-400 font-semibold">8</p>
                <p className="text-xs text-dark-400">This month</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div>
                <p className="text-white font-medium">Missing Records</p>
                <p className="text-sm text-dark-400">Risk management</p>
              </div>
              <div className="text-right">
                <p className="text-warning-400 font-semibold">3</p>
                <p className="text-xs text-dark-400">This month</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
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

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Compliance Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">Regulatory Compliance</span>
                <span className="text-success-400">100%</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">Audit Readiness</span>
                <span className="text-success-400">98.5%</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white">Documentation</span>
                <span className="text-warning-400">95.2%</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div className="bg-warning-500 h-2 rounded-full" style={{ width: '95.2%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Reconciliation Activity Timeline</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
            <div className="w-3 h-3 bg-success-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white">Trade TRADE-001 successfully reconciled</p>
              <p className="text-sm text-dark-400">All fields matched between trader and risk management records</p>
            </div>
            <span className="text-sm text-dark-400">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
            <div className="w-3 h-3 bg-danger-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white">Critical discrepancy detected in TRADE-002</p>
              <p className="text-sm text-dark-400">Price mismatch: $3.20 vs $3.25 - requires immediate attention</p>
            </div>
            <span className="text-sm text-dark-400">4 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
            <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white">New trade TRADE-003 submitted for reconciliation</p>
              <p className="text-sm text-dark-400">Awaiting risk management record entry</p>
            </div>
            <span className="text-sm text-dark-400">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  )
} 