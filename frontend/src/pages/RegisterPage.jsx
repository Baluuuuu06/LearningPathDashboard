import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { FiSun, FiMoon, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      // 1. Register User & get tokens directly!
      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // 2. Login Automatically
      login(res.data.user, res.data.access_token, res.data.refresh_token);
      toast.success("Account created successfully!");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
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
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">Create Account</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Start mastering new skills today.</p>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="relative">
            <FiUser className="absolute left-4 top-4 text-slate-400" />
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Full Name" />
          </div>
          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-slate-400" />
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Email Address" />
          </div>
          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-slate-400" />
            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Password" />
          </div>
          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-slate-400" />
            <input type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Confirm Password" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 mt-4">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="my-6 flex items-center justify-center space-x-4">
            <div className="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
            <span className="text-slate-400 text-sm">OR</span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
          </div>

          <button type="button" onClick={() => googleLogin()} className="w-full py-3.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-semibold flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-3" />
            Continue with Google
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
          Already have an account? <Link to="/login" className="text-blue-600 dark:text-cyan-400 hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
