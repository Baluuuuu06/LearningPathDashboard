import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiClock, FiStar, FiAward, FiCheckCircle, FiPlayCircle, FiActivity, FiArrowRight } from 'react-icons/fi';
import { FaFire, FaSnowflake, FaBrain, FaDumbbell } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon, color, delay = 0, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: "-10px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className="glass-panel p-6 rounded-3xl flex flex-col hover:-translate-y-1 transition-transform"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</h3>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-3xl font-black text-slate-800 dark:text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  </motion.div>
);

const LevelProgress = ({ level, xp_progress }) => {
  const percentage = Math.min(100, Math.max(0, (xp_progress.current / xp_progress.required) * 100));
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-6 rounded-3xl mb-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/30">
            L{level}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Current Level</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{xp_progress.total_xp} Total XP</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-800 dark:text-white">{xp_progress.current} / {xp_progress.required} XP</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">to Level {level + 1}</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 relative"
        >
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, analyticsRes, achRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/analytics').catch(err => { console.warn(err); return {data: null}; }),
          api.get('/achievements').catch(err => { console.warn(err); return {data: {achievements: []}}; })
        ]);
        setData(dashRes.data);
        setAnalytics(analyticsRes.data);
        setAchievements(achRes.data.achievements);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-slate-400 animate-pulse text-center mt-20">Loading Dashboard...</div>;
  if (!data) return <div className="text-slate-400">Failed to load data.</div>;

  const { stats, charts, recent_activity } = data;

  const lineChartData = {
    labels: charts.weekly_progress.labels,
    datasets: [
      {
        label: 'XP Earned',
        data: charts.weekly_progress.data,
        borderColor: '#8b5cf6', // purple-500
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8' } },
    },
    scales: {
      x: { grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#94a3b8' } },
    },
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back! 👋</h1>
        <p className="text-slate-600 dark:text-slate-400">Here's your learning and gamification overview.</p>
      </div>

      <LevelProgress level={stats.level} xp_progress={stats.xp_progress} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Current Streak" value={`${stats.current_streak} Days`} subtitle={`Longest: ${stats.longest_streak}`} delay={0.1} icon={<FaFire />} color="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 border border-orange-200 dark:border-orange-500/20" />
        <StatCard title="Streak Freezes" value={stats.streak_freezes} subtitle="Protects your streak" delay={0.2} icon={<FaSnowflake />} color="bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20" />
        <StatCard title="Quizzes Completed" value={stats.quizzes_taken} delay={0.3} icon={<FiCheckCircle />} color="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20" />
        <StatCard title="Modules Completed" value={stats.skills_completed} delay={0.4} icon={<FiPlayCircle />} color="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 glass-panel bg-white/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/50"
        >
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Weekly XP Progress</h2>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel bg-white/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/50 overflow-hidden"
        >
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recent_activity && recent_activity.length > 0 ? (
              recent_activity.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FiActivity size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white capitalize">
                        {act.action.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-slate-500">{new Date(act.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    +{act.xp} XP
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm text-center mt-10">No recent activity found.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Analytics Section */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Weak / Strong Topics */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass-panel bg-white/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl"><FaBrain size={20}/></div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Mastered Topics</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {analytics.strong_topics && analytics.strong_topics.length > 0 ? (
                  analytics.strong_topics.map(t => (
                    <span key={t} className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold border border-emerald-500/20">{t}</span>
                  ))
                ) : <p className="text-sm text-slate-500">Keep learning to discover your strengths!</p>}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} delay={0.1}
              className="glass-panel bg-white/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500/20 text-orange-500 rounded-xl"><FaDumbbell size={20}/></div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Needs Review</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {analytics.weak_topics && analytics.weak_topics.length > 0 ? (
                  analytics.weak_topics.map(t => (
                    <span key={t} className="px-4 py-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold border border-orange-500/20">{t}</span>
                  ))
                ) : <p className="text-sm text-slate-500">No weak topics right now! Great job.</p>}
              </div>
            </motion.div>
          </div>

          {/* Recommendations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} delay={0.2}
            className="glass-panel bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-blue-500/20 p-6 rounded-3xl"
          >
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recommended for You</h2>
            <div className="space-y-4">
              {analytics.recommendations && analytics.recommendations.map((rec, idx) => (
                <a 
                  key={idx} 
                  href={rec.action_url}
                  className="block p-4 bg-slate-900/40 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{rec.title}</h3>
                    <FiArrowRight className="text-slate-500 group-hover:text-blue-400 transition-colors mt-1" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{rec.description}</p>
                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-md">{rec.tag}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Achievements Gallery */}
      {achievements && achievements.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-panel bg-white/50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 mb-10"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-yellow-500/20 text-yellow-500 rounded-xl"><FiAward size={24}/></div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Achievements Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {achievements.map((ach) => (
              <div 
                key={ach.id} 
                className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all ${
                  ach.unlocked 
                    ? 'bg-gradient-to-b from-yellow-500/10 to-orange-500/5 border-yellow-500/30 shadow-lg shadow-yellow-500/10 hover:-translate-y-1' 
                    : 'bg-slate-800/30 border-slate-700/50 opacity-60 grayscale'
                }`}
              >
                <div className="text-4xl mb-3 filter drop-shadow-md">{ach.icon}</div>
                <h3 className={`text-sm font-bold text-center mb-1 ${ach.unlocked ? 'text-yellow-500' : 'text-slate-400'}`}>{ach.title}</h3>
                <p className="text-xs text-center text-slate-500 leading-tight">{ach.description}</p>
                {!ach.unlocked && <div className="absolute top-2 right-2 w-3 h-3 bg-slate-700 rounded-full border border-slate-900"></div>}
                {ach.unlocked && <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border border-green-900 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
