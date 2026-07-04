import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';

const QuizPage = () => {
  const { skillName } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quiz/${encodeURIComponent(skillName)}`);
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [skillName]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const handleNext = async () => {
    let newScore = score;
    if (selectedOption === quiz.questions[currentQuestion].correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quiz.questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
    } else {
      setShowScore(true);
      // Submit score to backend
      try {
        const res = await api.post('/quiz/submit', { skill: skillName, score: newScore });
        if (res.data.gamification && res.data.gamification.leveled_up) {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          toast.success(`🎉 Level Up! You are now Level ${res.data.gamification.level}`);
        } else if (res.data.gamification && res.data.gamification.xp_earned > 0) {
          toast.success(`+${res.data.gamification.xp_earned} XP earned!`);
        }
      } catch (err) {
        console.error("Failed to submit score", err);
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 text-white p-8"><p className="text-slate-400 animate-pulse text-center mt-20 text-xl">Loading Quiz...</p></div>;
  if (!quiz) return <div className="min-h-screen bg-slate-900 text-white p-8"><p className="text-slate-400 text-center mt-20">No quiz available for this skill.</p></div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-10 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>

        {showScore ? (
          <div className="text-center py-10">
            <h2 className="text-4xl font-bold mb-6 text-white">Quiz Completed!</h2>
            <div className="inline-block p-6 rounded-full bg-slate-800/50 border-4 border-cyan-500 mb-8">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {score} <span className="text-3xl text-slate-400">/ {quiz.questions.length}</span>
              </span>
            </div>
            <p className="text-slate-400 mb-10 text-lg">Great job testing your knowledge in {skillName}.</p>
            <button 
              onClick={() => navigate('/skills')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all"
            >
              Back to Skills
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700/50">
              <h2 className="text-2xl font-bold text-slate-100">{skillName} Quiz</h2>
              <span className="text-sm font-semibold text-cyan-400 bg-cyan-400/10 px-4 py-1.5 rounded-full">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
            </div>
            
            <h3 className="text-2xl font-medium mb-8 leading-relaxed text-slate-200">
              {quiz.questions[currentQuestion].questionText}
            </h3>
            
            <div className="space-y-4 mb-10">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 ${
                    selectedOption === index 
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-inner shadow-blue-500/20' 
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <span className="inline-block w-8 h-8 rounded-md bg-slate-900/50 text-center leading-8 mr-4 text-sm font-mono text-slate-400">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`px-8 py-3.5 rounded-xl font-bold transition-all ${
                  selectedOption !== null 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizPage;
