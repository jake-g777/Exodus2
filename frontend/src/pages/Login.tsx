import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Zap } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await login(email, password)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Zap size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Energy Trading</h1>
          <p className="text-dark-400">Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dark-400">
              Demo credentials: admin@energy-trading.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 