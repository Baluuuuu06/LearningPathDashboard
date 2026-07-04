import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FiCheck } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';

const RoadmapPage = () => {
  const { skillName } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedModules, setCompletedModules] = useState({});

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await api.get(`/roadmap/${encodeURIComponent(skillName)}`);
        setRoadmap(response.data);
        
        // Fetch completed modules
        const progressResponse = await api.get(`/progress/roadmap/${encodeURIComponent(skillName)}`);
        const completed = progressResponse.data.completed_modules;
        
        // Convert array to object map for easy state management
        const completedMap = {};
        completed.forEach(index => {
          completedMap[index] = true;
        });
        setCompletedModules(completedMap);
        
      } catch (error) {
        console.error("Error fetching roadmap or progress", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [skillName]);

  const handleMarkCompleted = async (index) => {
    try {
      // Optimistic update
      setCompletedModules(prev => ({...prev, [index]: true}));
      
      // Save to backend
      const res = await api.post('/progress/roadmap', {
        skill: skillName,
        module_index: index
      });
      
      if (res.data.gamification && res.data.gamification.leveled_up) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        toast.success(`🎉 Level Up! You are now Level ${res.data.gamification.level}`);
      } else if (res.data.gamification && res.data.gamification.xp_earned > 0) {
        toast.success(`+${res.data.gamification.xp_earned} XP earned!`);
      }
    } catch (error) {
      console.error("Failed to mark as completed", error);
      // Revert if failed
      setCompletedModules(prev => ({...prev, [index]: false}));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          {skillName} Roadmap
        </h1>
        <p className="text-slate-400 mb-10">Follow this step-by-step path to master the skill.</p>

        {loading ? (
          <p className="text-slate-400">Loading roadmap...</p>
        ) : !roadmap ? (
          <p className="text-slate-400">No roadmap found for this skill.</p>
        ) : (
          <div className="space-y-8 relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-800 -z-10 rounded"></div>
            
            {roadmap.modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-6"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 mt-1 shrink-0 transition-colors ${
                  completedModules[index] ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-800 text-blue-400 border-slate-700'
                }`}>
                  {completedModules[index] ? <FiCheck size={20} /> : index + 1}
                </div>
                <div className={`glass-panel p-6 rounded-2xl flex-grow transition-all border ${
                  completedModules[index] ? 'border-emerald-500/30 shadow-emerald-500/10 shadow-lg' : 'border-transparent'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-xl font-bold ${completedModules[index] ? 'text-emerald-400' : 'text-white'}`}>{module.title}</h3>
                    <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-cyan-400">
                      {module.estimated_time}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-4">{module.description}</p>
                  
                  {module.project && (
                    <div className="mb-4">
                      <span className="text-sm font-semibold text-slate-300">Project: </span>
                      <span className="text-sm text-blue-400">{module.project}</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-4 mt-4">
                    <button 
                      onClick={() => handleMarkCompleted(index)}
                      disabled={completedModules[index]}
                      className={`px-4 py-2 flex items-center space-x-2 rounded-lg text-sm font-semibold transition ${
                        completedModules[index] 
                          ? 'bg-emerald-500/10 text-emerald-500 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {completedModules[index] ? <><FiCheck /> <span>Completed</span></> : <span>Mark as Completed</span>}
                    </button>
                    {module.resources && module.resources.length > 0 && (
                      <a 
                        href={module.resources[0]} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-sm font-semibold transition text-slate-300"
                      >
                        View Resource
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
