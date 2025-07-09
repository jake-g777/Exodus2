import { TrendingUp, TrendingDown, Activity, AlertTriangle, CheckCircle, Clock, BarChart3, PieChart } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-dark-400 mt-1">Trade Reconciliation Overview • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-dark-400">
          <Activity size={16} />
          <span>Last updated: 30 sec ago</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Total Trades</p>
              <p className="text-2xl font-bold text-white mt-1">1,247</p>
              <p className="text-xs text-success-400 mt-1">+12% from yesterday</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Reconciled</p>
              <p className="text-2xl font-bold text-white mt-1">1,189</p>
              <p className="text-xs text-success-400 mt-1">95.3% success rate</p>
            </div>
            <div className="w-10 h-10 bg-success-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-success-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-white mt-1">58</p>
              <p className="text-xs text-warning-400 mt-1">Requires attention</p>
            </div>
            <div className="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
              <Clock className="text-warning-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Discrepancies</p>
              <p className="text-2xl font-bold text-white mt-1">12</p>
              <p className="text-xs text-danger-400 mt-1">Critical issues</p>
            </div>
            <div className="w-10 h-10 bg-danger-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-danger-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <div>
                <p className="text-sm text-white font-medium">Trade TRADE-001 reconciled</p>
                <p className="text-xs text-dark-400">All fields matched successfully</p>
              </div>
            </div>
            <span className="text-xs text-dark-400">2 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success-400 rounded-full"></div>
              <div>
                <p className="text-sm text-white font-medium">Batch reconciliation completed</p>
                <p className="text-xs text-dark-400">47 trades processed</p>
              </div>
            </div>
            <span className="text-xs text-dark-400">5 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-dark-800/20 rounded-lg border border-dark-700/20">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning-400 rounded-full"></div>
              <div>
                <p className="text-sm text-white font-medium">Discrepancy detected</p>
                <p className="text-xs text-dark-400">TRADE-002 price mismatch</p>
              </div>
            </div>
            <span className="text-xs text-dark-400">8 min ago</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Reconciliation Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white text-sm">Success Rate</span>
                <span className="text-success-400 text-sm">95.3%</span>
              </div>
              <div className="w-full bg-dark-800/40 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full" style={{ width: '95.3%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white text-sm">Average Processing Time</span>
                <span className="text-primary-400 text-sm">2.3s</span>
              </div>
              <div className="w-full bg-dark-800/40 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full" style={{ width: '98.5%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white text-sm">Data Quality Score</span>
                <span className="text-success-400 text-sm">99.2%</span>
              </div>
              <div className="w-full bg-dark-800/40 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full" style={{ width: '99.2%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div className="text-lg font-bold text-primary-400">99.2%</div>
              <div className="text-xs text-dark-400">Accuracy Rate</div>
            </div>
            <div className="text-center p-4 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div className="text-lg font-bold text-success-400">1.2s</div>
              <div className="text-xs text-dark-400">Avg Response</div>
            </div>
            <div className="text-center p-4 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div className="text-lg font-bold text-warning-400">24/7</div>
              <div className="text-xs text-dark-400">Uptime</div>
            </div>
            <div className="text-center p-4 bg-dark-800/20 rounded-lg border border-dark-700/20">
              <div className="text-lg font-bold text-cyan-400">1.5M</div>
              <div className="text-xs text-dark-400">Trades Processed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Daily Volume</h2>
          <div className="h-64 bg-dark-800/20 rounded-lg flex items-center justify-center border border-dark-700/20">
            <div className="text-center">
              <BarChart3 className="text-dark-400 mx-auto mb-2" size={48} />
              <p className="text-dark-400">Chart component coming soon</p>
              <p className="text-sm text-dark-500">Daily trade volume trends</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Commodity Distribution</h2>
          <div className="h-64 bg-dark-800/20 rounded-lg flex items-center justify-center border border-dark-700/20">
            <div className="text-center">
              <PieChart className="text-dark-400 mx-auto mb-2" size={48} />
              <p className="text-dark-400">Chart component coming soon</p>
              <p className="text-sm text-dark-500">Trades by commodity type</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 