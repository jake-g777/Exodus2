import { FolderOpen, Plus, Search, Filter, Calendar, Users, Activity } from 'lucide-react'

export default function Projects() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="text-sm text-dark-400 mt-1">Project Management • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-dark-400">
          <Activity size={16} />
          <span>Last updated: 2 min ago</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 bg-dark-900/40 border border-dark-800/40 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors duration-200">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
          <Plus size={16} className="mr-2" />
          New Project
        </button>
      </div>
      
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Total Projects</p>
              <p className="text-2xl font-bold text-white mt-1">24</p>
              <p className="text-xs text-success-400 mt-1">+3 this month</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <FolderOpen className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Active</p>
              <p className="text-2xl font-bold text-white mt-1">18</p>
              <p className="text-xs text-primary-400 mt-1">75% completion</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Activity className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-white mt-1">6</p>
              <p className="text-xs text-success-400 mt-1">This quarter</p>
            </div>
            <div className="w-10 h-10 bg-success-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="text-success-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Team Members</p>
              <p className="text-2xl font-bold text-white mt-1">12</p>
              <p className="text-xs text-warning-400 mt-1">2 available</p>
            </div>
            <div className="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
              <Users className="text-warning-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Project Card 1 */}
        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Risk Management System</h3>
              <p className="text-sm text-dark-400 mt-1">Trading risk assessment platform</p>
            </div>
            <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Progress</span>
              <span className="text-primary-400 font-medium">85%</span>
            </div>
            <div className="w-full bg-dark-800/40 rounded-full h-1.5">
              <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Deadline</span>
              <span className="text-white">Dec 15, 2024</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Team</span>
              <span className="text-white">5 members</span>
            </div>
          </div>
        </div>

        {/* Project Card 2 */}
        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Data Pipeline</h3>
              <p className="text-sm text-dark-400 mt-1">Real-time data processing</p>
            </div>
            <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Progress</span>
              <span className="text-primary-400 font-medium">62%</span>
            </div>
            <div className="w-full bg-dark-800/40 rounded-full h-1.5">
              <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '62%' }}></div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Deadline</span>
              <span className="text-white">Jan 20, 2025</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Team</span>
              <span className="text-white">3 members</span>
            </div>
          </div>
        </div>

        {/* Project Card 3 */}
        <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Compliance Dashboard</h3>
              <p className="text-sm text-dark-400 mt-1">Regulatory reporting system</p>
            </div>
            <div className="w-2 h-2 bg-warning-400 rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Progress</span>
              <span className="text-warning-400 font-medium">45%</span>
            </div>
            <div className="w-full bg-dark-800/40 rounded-full h-1.5">
              <div className="bg-warning-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Deadline</span>
              <span className="text-white">Feb 10, 2025</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Team</span>
              <span className="text-white">4 members</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 