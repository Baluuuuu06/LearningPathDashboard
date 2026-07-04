import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { FiSun, FiMoon, FiMail, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email: formData.email, password: formData.password });
      login(response.data.user, response.data.access_token, response.data.refresh_token);
      toast.success("Welcome back!");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post('/auth/google-login', { token: tokenResponse.credential || tokenResponse.access_token });
        login(res.data.user, res.data.access_token, res.data.refresh_token);
        toast.success("Successfully logged in with Google!");
        navigate('/dashboard');
      } catch (error) {
        toast.error("Google authentication failed.");
      }
    },
    onError: () => toast.error('Google login failed.')
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <button onClick={toggleTheme} className="absolute top-6 right-6 p-3 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md z-50">
        {theme === 'dark' ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 rounded-3xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">Welcome Back</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Sign in to continue your journey.</p>
        
        <form className="space-y-4" onSubmit={handlePasswordLogin}>
          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-slate-400" />
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Email Address" />
          </div>
          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-slate-400" />
            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Password" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center space-x-4">
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
          <span className="text-slate-400 text-sm">OR</span>
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
        </div>

        <button type="button" onClick={() => googleLogin()} className="w-full py-3.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-semibold flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-3" />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
          Don't have an account? <Link to="/register" className="text-blue-600 dark:text-cyan-400 hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
