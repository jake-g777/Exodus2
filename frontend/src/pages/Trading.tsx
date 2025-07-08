import { Search, Filter, Download, Upload, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function Trading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Trade Reconciliation</h1>
          <p className="text-dark-400">Review and reconcile trades between traders and risk management</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <Upload size={16} className="mr-2" />
            Import Trades
          </button>
          <button className="btn-primary flex items-center">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="text"
                placeholder="Search trades by ID, counterparty, or commodity..."
                className="input-field w-full pl-10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className="input-field">
              <option>All Status</option>
              <option>Pending</option>
              <option>Matched</option>
              <option>Discrepancy</option>
              <option>Approved</option>
            </select>
            <select className="input-field">
              <option>All Commodities</option>
              <option>Crude Oil</option>
              <option>Natural Gas</option>
              <option>Electricity</option>
              <option>Coal</option>
              <option>Renewables</option>
            </select>
            <button className="btn-secondary flex items-center">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left p-3 text-white font-semibold">Trade ID</th>
                <th className="text-left p-3 text-white font-semibold">Commodity</th>
                <th className="text-left p-3 text-white font-semibold">Trader Record</th>
                <th className="text-left p-3 text-white font-semibold">Risk Record</th>
                <th className="text-left p-3 text-white font-semibold">Status</th>
                <th className="text-left p-3 text-white font-semibold">Discrepancies</th>
                <th className="text-left p-3 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              <tr className="hover:bg-dark-700/50">
                <td className="p-3 text-white font-mono">TRADE-001</td>
                <td className="p-3 text-white">Crude Oil</td>
                <td className="p-3">
                  <div className="text-sm">
                    <div className="text-white">1000 barrels @ $85.50</div>
                    <div className="text-dark-400">Shell Trading</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm">
                    <div className="text-white">1000 barrels @ $85.50</div>
                    <div className="text-dark-400">Shell Trading</div>
                  </div>
                </td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-500/20 text-success-400">
                    <CheckCircle size={12} className="mr-1" />
                    Matched
                  </span>
                </td>
                <td className="p-3 text-white">0</td>
                <td className="p-3">
                  <button className="text-primary-400 hover:text-primary-300 text-sm">View Details</button>
                </td>
              </tr>
              
              <tr className="hover:bg-dark-700/50">
                <td className="p-3 text-white font-mono">TRADE-002</td>
                <td className="p-3 text-white">Natural Gas</td>
                <td className="p-3">
                  <div className="text-sm">
                    <div className="text-white">500 MMBtu @ $3.20</div>
                    <div className="text-dark-400">BP Energy</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm">
                    <div className="text-white">500 MMBtu @ $3.25</div>
                    <div className="text-dark-400">BP Energy</div>
                  </div>
                </td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-danger-500/20 text-danger-400">
                    <AlertTriangle size={12} className="mr-1" />
                    Discrepancy
                  </span>
                </td>
                <td className="p-3 text-white">1</td>
                <td className="p-3">
                  <button className="text-primary-400 hover:text-primary-300 text-sm">Review</button>
                </td>
              </tr>
              
              <tr className="hover:bg-dark-700/50">
                <td className="p-3 text-white font-mono">TRADE-003</td>
                <td className="p-3 text-white">Electricity</td>
                <td className="p-3">
                  <div className="text-sm">
                    <div className="text-white">2000 MWh @ $65.80</div>
                    <div className="text-dark-400">ExxonMobil</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm text-dark-400">No record found</div>
                </td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-500/20 text-warning-400">
                    <Clock size={12} className="mr-1" />
                    Pending
                  </span>
                </td>
                <td className="p-3 text-white">-</td>
                <td className="p-3">
                  <button className="text-primary-400 hover:text-primary-300 text-sm">Add Record</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-400">1,145</div>
          <div className="text-sm text-dark-400">Matched Trades</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-400">89</div>
          <div className="text-sm text-dark-400">Pending Review</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-400">12</div>
          <div className="text-sm text-dark-400">Discrepancies</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-400">98.5%</div>
          <div className="text-sm text-dark-400">Match Rate</div>
        </div>
      </div>
    </div>
  )
} 