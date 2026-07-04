import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FiAward, FiTrendingUp } from 'react-icons/fi';
import { FaCrown, FaMedal } from 'react-icons/fa';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard');
        setLeaderboard(response.data.leaderboard);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8 text-center mt-20">
        <p className="text-slate-400 animate-pulse text-xl">Loading Leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-10 text-center">
        <div className="inline-block p-4 bg-yellow-500/10 rounded-full text-yellow-500 mb-4">
          <FaCrown size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Global Leaderboard</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">See how you rank against other learners on SkillAura.</p>
      </div>

      <div className="glass-panel p-2 sm:p-6 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="p-4 text-slate-400 font-semibold w-24 text-center">Rank</th>
                <th className="p-4 text-slate-400 font-semibold">Learner</th>
                <th className="p-4 text-slate-400 font-semibold text-center">Level</th>
                <th className="p-4 text-slate-400 font-semibold text-center">Streak</th>
                <th className="p-4 text-slate-400 font-semibold text-right">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={user.id} 
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4 text-center font-bold">
                    {idx === 0 ? <FaCrown className="inline text-yellow-400 text-2xl drop-shadow-md" /> :
                     idx === 1 ? <FaMedal className="inline text-slate-300 text-2xl drop-shadow-md" /> :
                     idx === 2 ? <FaMedal className="inline text-orange-400 text-2xl drop-shadow-md" /> :
                     <span className="text-slate-500">#{user.rank}</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full font-bold text-sm border border-purple-500/20">
                      Lvl {user.level}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-400 font-bold">
                      <FiTrendingUp /> {user.streak}
                    </div>
                  </td>
                  <td className="p-4 text-right font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-lg">
                    {user.xp.toLocaleString()} XP
                  </td>
                </motion.tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No learners on the leaderboard yet. Be the first!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
