import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const ProjectsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-600">
          Real-World Projects
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Build these projects to solidify your skills and enhance your portfolio.</p>
      </div>

        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-slate-400">No projects available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
            .filter(project => project.title.toLowerCase().includes(searchQuery.toLowerCase()) || project.description.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="glass-panel p-6 rounded-3xl flex flex-col items-start hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10 blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
                
                <div className="flex justify-between items-center w-full mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-400/10 px-3 py-1 rounded-full">{project.skill}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">{project.difficulty}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">{project.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.technologies?.map((tech, i) => (
                    <span key={i} className="text-xs font-medium border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-800/30 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>

                <a 
                  href={project.github_reference}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-3.5 bg-slate-800 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 border border-slate-700 hover:border-blue-500 shadow-lg"
                >
                  View Requirements
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
  );
};

export default ProjectsPage;
