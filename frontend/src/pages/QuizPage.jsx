import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiXCircle, FiAward } from 'react-icons/fi';

const QuizPage = () => {
  const { skillName } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // Track selected options for the current question
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // Store all answers to submit at the end
  const [answers, setAnswers] = useState([]);
  
  // Post-quiz summary
  const [summary, setSummary] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quiz/${encodeURIComponent(skillName)}`);
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz", error);
        toast.error("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [skillName]);

  const handleOptionClick = (option) => {
    const q = quiz.questions[currentQuestion];
    
    if (q.format === 'multi_select') {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter(o => o !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    } else {
      // Single select (mcq, code_snippet)
      setSelectedOptions([option]);
    }
  };

  const handleNext = async () => {
    const q = quiz.questions[currentQuestion];
    const currentAnswer = {
      question_id: q.id,
      selected_options: selectedOptions
    };
    
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quiz.questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOptions([]);
    } else {
      // Finish Quiz and Submit
      setSubmitting(true);
      try {
        const res = await api.post('/quiz/submit', { skill: skillName, answers: newAnswers });
        const result = res.data.result;
        setSummary(result);
        
        if (result.gamification && result.gamification.leveled_up) {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          toast.success(`🎉 Level Up! You are now Level ${result.gamification.level}`);
        } else if (result.gamification && result.gamification.xp_earned > 0) {
          toast.success(`+${result.gamification.xp_earned} XP earned!`);
        }
      } catch (err) {
        console.error("Failed to submit score", err);
        toast.error("Failed to submit quiz.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading || submitting) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <p className="text-slate-400 animate-pulse text-xl">
          {submitting ? "Grading your quiz..." : "Loading Quiz..."}
        </p>
      </div>
    );
  }
  
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <p className="text-slate-400 text-center">No questions available for this topic.</p>
      </div>
    );
  }

  // Render Post-Quiz Summary
  if (summary) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-10 rounded-3xl mb-8 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">Quiz Results</h2>
            <div className="inline-block p-6 rounded-full bg-slate-800/50 border-4 border-cyan-500 mb-6">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {Math.round(summary.score_percentage)}%
              </span>
            </div>
            <p className="text-slate-400 text-lg mb-4">
              You answered {summary.correct_count} out of {summary.total_questions} questions correctly.
            </p>
            {summary.gamification && summary.gamification.xp_earned > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full font-bold">
                <FiAward size={20} /> +{summary.gamification.xp_earned} XP Earned
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-300 mb-3">Strong Topics</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {summary.strong_topics.length > 0 ? summary.strong_topics.map(t => (
                    <span key={t} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">{t}</span>
                  )) : <span className="text-slate-500 text-sm">Need more data</span>}
                </div>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-300 mb-3">Needs Review</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {summary.weak_topics.length > 0 ? summary.weak_topics.map(t => (
                    <span key={t} className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-sm">{t}</span>
                  )) : <span className="text-slate-500 text-sm">You did perfectly!</span>}
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-6">Detailed Review</h3>
          <div className="space-y-6">
            {summary.detailed_results.map((res, idx) => (
              <div key={idx} className={`glass-panel p-6 rounded-2xl border-l-4 ${res.is_correct ? 'border-emerald-500' : 'border-red-500'}`}>
                <div className="flex gap-4 mb-4">
                  <div className="shrink-0 mt-1">
                    {res.is_correct ? <FiCheckCircle className="text-emerald-500 text-2xl" /> : <FiXCircle className="text-red-500 text-2xl" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-200 mb-2">{res.questionText}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-slate-800 rounded-xl">
                        <span className="text-slate-400 block mb-1">Your Answer:</span>
                        <span className={res.is_correct ? "text-emerald-400" : "text-red-400"}>
                          {res.selected.length > 0 ? res.selected.join(', ') : 'No answer'}
                        </span>
                      </div>
                      {!res.is_correct && (
                        <div className="p-3 bg-slate-800 rounded-xl">
                          <span className="text-slate-400 block mb-1">Correct Answer:</span>
                          <span className="text-emerald-400">{res.correct_answers.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    {res.explanation && (
                      <div className="mt-4 p-4 bg-blue-500/10 text-blue-300 rounded-xl text-sm border border-blue-500/20">
                        <strong>Explanation:</strong> {res.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Render
  const q = quiz.questions[currentQuestion];
  const isMultiSelect = q.format === 'multi_select';

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <motion.div 
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-10 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>

        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold text-slate-100">{skillName} Quiz</h2>
          <span className="text-sm font-semibold text-cyan-400 bg-cyan-400/10 px-4 py-1.5 rounded-full">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        
        <h3 className="text-2xl font-medium mb-6 leading-relaxed text-slate-200">
          {q.questionText}
        </h3>
        
        {isMultiSelect && (
          <p className="text-sm text-cyan-400 mb-6 font-semibold bg-cyan-400/10 inline-block px-3 py-1 rounded-md">
            Select all that apply
          </p>
        )}

        {q.codeSnippet && (
          <div className="mb-8 p-4 bg-[#0d1117] rounded-xl border border-slate-700 overflow-x-auto">
            <pre className="font-mono text-sm text-green-400">
              <code>{q.codeSnippet}</code>
            </pre>
          </div>
        )}
        
        <div className="space-y-4 mb-10">
          {q.options.map((option, index) => {
            const isSelected = selectedOptions.includes(option);
            return (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 ${
                  isSelected 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-inner shadow-blue-500/20' 
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600'
                }`}
              >
                <span className={`inline-block w-8 h-8 rounded-md text-center leading-8 mr-4 text-sm font-mono transition-colors ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-900/50 text-slate-400'}`}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            );
          })}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedOptions.length === 0}
            className={`px-8 py-3.5 rounded-xl font-bold transition-all ${
              selectedOptions.length > 0 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizPage;
