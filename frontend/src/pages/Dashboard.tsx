import { CheckCircle, AlertTriangle, Clock, XCircle, TrendingUp, Shield } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Trade Reconciliation Dashboard</h1>
        <p className="text-dark-400">Monitor trade reconciliation status and compliance</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Total Trades</h3>
              <p className="text-3xl font-bold text-primary-400">1,234</p>
            </div>
            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-primary-400" size={24} />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Pending Reconciliation</h3>
              <p className="text-3xl font-bold text-warning-400">89</p>
            </div>
            <div className="w-12 h-12 bg-warning-500/20 rounded-lg flex items-center justify-center">
              <Clock className="text-warning-400" size={24} />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Matched Trades</h3>
              <p className="text-3xl font-bold text-success-400">1,145</p>
            </div>
            <div className="w-12 h-12 bg-success-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-success-400" size={24} />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Discrepancies</h3>
              <p className="text-3xl font-bold text-danger-400">12</p>
            </div>
            <div className="w-12 h-12 bg-danger-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-danger-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Reconciliation Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Reconciliation Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="text-success-400 mr-3" size={20} />
                <span className="text-white">Matched Trades</span>
              </div>
              <span className="text-success-400 font-semibold">1,145</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center">
                <Clock className="text-warning-400 mr-3" size={20} />
                <span className="text-white">Pending Review</span>
              </div>
              <span className="text-warning-400 font-semibold">89</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="text-danger-400 mr-3" size={20} />
                <span className="text-white">Discrepancies</span>
              </div>
              <span className="text-danger-400 font-semibold">12</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center">
                <XCircle className="text-gray-400 mr-3" size={20} />
                <span className="text-white">Rejected</span>
              </div>
              <span className="text-gray-400 font-semibold">3</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Compliance Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Compliance Score</span>
              <span className="text-success-400 font-semibold">98.5%</span>
            </div>
            
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div className="bg-success-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-dark-700 rounded-lg">
                <div className="text-2xl font-bold text-success-400">2.3h</div>
                <div className="text-sm text-dark-400">Avg Resolution Time</div>
              </div>
              
              <div className="text-center p-3 bg-dark-700 rounded-lg">
                <div className="text-2xl font-bold text-primary-400">99.2%</div>
                <div className="text-sm text-dark-400">Match Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Reconciliation Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="text-success-400 mr-3" size={16} />
              <div>
                <p className="text-white font-medium">Trade TRADE-001 reconciled</p>
                <p className="text-sm text-dark-400">Crude Oil - 1000 barrels @ $85.50</p>
              </div>
            </div>
            <span className="text-sm text-dark-400">2 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="text-danger-400 mr-3" size={16} />
              <div>
                <p className="text-white font-medium">Discrepancy found in TRADE-002</p>
                <p className="text-sm text-dark-400">Price mismatch: $78.20 vs $78.50</p>
              </div>
            </div>
            <span className="text-sm text-dark-400">5 min ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <div className="flex items-center">
              <Clock className="text-warning-400 mr-3" size={16} />
              <div>
                <p className="text-white font-medium">New trade TRADE-003 pending review</p>
                <p className="text-sm text-dark-400">Natural Gas - 500 MMBtu @ $3.25</p>
              </div>
            </div>
            <span className="text-sm text-dark-400">12 min ago</span>
          </div>
        </div>
      </div>
    </div>
  )
} 