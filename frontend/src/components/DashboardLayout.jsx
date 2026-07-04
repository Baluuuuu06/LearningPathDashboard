import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiBook, FiMap, FiBriefcase, FiCheckSquare, FiMessageSquare, FiAward, FiSettings, FiLogOut, FiSearch, FiBell, FiSun, FiMoon } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';
import ChatBot from './ChatBot';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to SkillAura!", time: "Just now" },
    { id: 2, text: "Your profile is 80% complete.", time: "2h ago" },
    { id: 3, text: "New React course available.", time: "1d ago" }
  ]);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/skills?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Skills', path: '/skills', icon: <FiBook /> },
    { name: 'Projects', path: '/projects', icon: <FiBriefcase /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-sans overflow-hidden transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all">
        <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-3 group/logo cursor-pointer hover:opacity-80 transition-opacity">
            {/* Stylish SA Logo */}
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/30 overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 group-hover:scale-150 transition-transform duration-500 rounded-full blur-xl"></div>
              <span className="relative font-black text-white text-lg tracking-tighter" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="drop-shadow-md">S</span>
                <span className="text-cyan-200 -ml-0.5 drop-shadow-md">A</span>
              </span>
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 tracking-tight leading-tight">
                SkillAura
              </h1>
              <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
                1% better than yesterday
              </span>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4 mb-2">Menu</span>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-500/20 shadow-inner' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <span className="text-lg"><FiLogOut /></span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800/50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 z-10">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 w-96 focus-within:border-blue-500 transition-colors">
            <FiSearch className="text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search skills, projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent border-none outline-none text-sm w-full text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition"
            >
              {theme === 'dark' ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition"
              >
                <FiBell className="text-xl" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                      <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                      <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-bold">
                        {notifications.length} New
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                          <FiCheckSquare className="mx-auto text-3xl mb-2 opacity-50" />
                          <p>You're all caught up!</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className="p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">{notif.text}</p>
                            <span className="text-xs text-slate-400 dark:text-slate-500">{notif.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div 
                        onClick={() => setNotifications([])}
                        className="p-3 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-400"
                      >
                        Mark all as read
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              {user && user.profile_picture ? (
                <img 
                  src={user.profile_picture} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover shadow-lg border-2 border-blue-500/50 hover:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-cyan-400 dark:to-blue-500 flex items-center justify-center font-bold text-white shadow-lg hover:shadow-cyan-500/30 transition-shadow">
                  {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
          {children}
        </main>
        
        <ChatBot />
      </div>
    </div>
  );
};

export default DashboardLayout;
