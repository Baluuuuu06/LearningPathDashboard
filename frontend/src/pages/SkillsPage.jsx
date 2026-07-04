import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills');
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-600 mb-2">Explore Skills</h1>
        <p className="text-slate-500 dark:text-slate-400">Discover new technologies and start learning.</p>
      </div>
      
      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 animate-pulse text-xl mt-10">Loading skills...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills
            .filter(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || skill.description.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((skill, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="glass-panel p-6 rounded-3xl flex flex-col items-start hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img src={skill.image} alt={skill.name} className="w-14 h-14 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl shadow-sm" />
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{skill.name}</h2>
                  <span className="text-xs font-semibold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-900/30 px-3 py-1 rounded-full uppercase tracking-wide">
                    {skill.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow leading-relaxed">{skill.description}</p>
              
              <div className="flex justify-between items-center w-full mt-auto">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-500 flex items-center">
                  ⏱ {skill.duration}
                </span>
                <Link 
                  to={`/roadmap/${skill.name}`}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  Start Learning
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
