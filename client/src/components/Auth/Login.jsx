import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex bg-slate-50">
      
      {/* Left Image Section - High Visibility, Uncropped */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-white">
        <img 
          src="/assets/images/hero_bg.jpg" 
          alt="Life Journey" 
          className="w-full h-auto max-h-full object-contain drop-shadow-xl"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10 z-10">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white shadow-2xl shadow-purple-500/10 border border-slate-200 rounded-3xl p-8 md:p-10">
          
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">👋</span>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Continue your life journey</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-500 text-sm mb-6 text-center font-medium">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-400" />
            </div>
            
            <button type="submit" disabled={loading}
              className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold transition-all disabled:opacity-50 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5">
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <p className="text-center text-slate-500 text-sm mt-8 font-medium">
            Don't have an account? <Link to="/register" className="text-purple-600 hover:text-purple-500 font-bold ml-1">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}