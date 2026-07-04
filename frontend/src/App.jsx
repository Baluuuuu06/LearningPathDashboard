import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SkillsPage from './pages/SkillsPage';
import RoadmapPage from './pages/RoadmapPage';
import ProjectsPage from './pages/ProjectsPage';
import QuizPage from './pages/QuizPage';
import SettingsPage from './pages/SettingsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DashboardLayout from './components/DashboardLayout';
import PageTransition from './components/PageTransition';
import { ThemeProvider } from './context/ThemeContext';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        
        <Route path="/dashboard" element={<DashboardLayout><PageTransition><Dashboard /></PageTransition></DashboardLayout>} />
        <Route path="/skills" element={<DashboardLayout><PageTransition><SkillsPage /></PageTransition></DashboardLayout>} />
        <Route path="/roadmap/:skillName" element={<DashboardLayout><PageTransition><RoadmapPage /></PageTransition></DashboardLayout>} />
        <Route path="/projects" element={<DashboardLayout><PageTransition><ProjectsPage /></PageTransition></DashboardLayout>} />
        <Route path="/quiz/:skillName" element={<DashboardLayout><PageTransition><QuizPage /></PageTransition></DashboardLayout>} />
        <Route path="/leaderboard" element={<DashboardLayout><PageTransition><LeaderboardPage /></PageTransition></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><PageTransition><SettingsPage /></PageTransition></DashboardLayout>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
