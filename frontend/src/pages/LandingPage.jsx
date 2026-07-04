import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
      {/* Animated Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      <nav className="flex justify-between items-center p-6 lg:px-24">
        <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/30 overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 group-hover:scale-150 transition-transform duration-500 rounded-full blur-xl"></div>
            <span className="relative font-black text-white text-lg tracking-tighter" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="drop-shadow-md">S</span>
              <span className="text-cyan-200 -ml-0.5 drop-shadow-md">A</span>
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 tracking-tight leading-tight">
              SkillAura
            </h1>
            <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
              1% better than yesterday
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>
          {isLoggedIn ? (
            <Link to="/dashboard" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold transition shadow-lg shadow-blue-500/30 text-white">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-white font-medium transition">Login</Link>
              <Link to="/register" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold transition shadow-lg shadow-blue-500/30 text-white">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center text-center mt-32 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
        >
          Master Skills with <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-600">
            Personalized Roadmaps
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10"
        >
          Join thousands of learners building their careers through interactive projects, quizzes, and AI-guided mentorship.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {isLoggedIn ? (
            <Link to="/dashboard" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/40 transition transform hover:-translate-y-1 inline-block text-white">
              Continue to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/40 transition transform hover:-translate-y-1 inline-block text-white">
              Start Your Journey Now
            </Link>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
