import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50"
    >
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🌐</span>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          PathWeaver
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/leaderboard" className="text-gray-400 hover:text-white transition text-sm">
          Leaderboard
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Hi, {user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-red-400 hover:text-red-300 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition">Login</Link>
            <Link to="/register" className="text-sm bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded-lg transition">
              Register
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
}