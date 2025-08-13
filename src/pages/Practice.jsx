import React, { useState, useEffect } from "react";
import { Child } from "@/api/entities";
import { PracticeQuestion } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import PracticeFilters from "../components/practice/PracticeFilters";
import QuestionCard from "../components/practice/QuestionCard";
import PracticeSummary from "../components/practice/PracticeSummary";
import PracticeHistoryView from "../components/practice/PracticeHistoryView";

export default function PracticePage() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionState, setSessionState] = useState("setup"); // 'setup', 'active', 'finished'
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('practice'); // 'practice', 'history'

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [childrenData, questionsData] = await Promise.all([
        Child.list(),
        PracticeQuestion.list('-created_date')
      ]);
      setChildren(childrenData);
      setAllQuestions(questionsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const startSession = (filters) => {
    let questions = allQuestions.filter(q => !q.completed);
    if (filters.childId) {
      questions = questions.filter(q => q.child_id === filters.childId);
    }
    if (filters.subject && filters.subject !== "all") {
      questions = questions.filter(q => q.subject === filters.subject);
    }
    setFilteredQuestions(questions);
    setCurrentQuestionIndex(0);
    setSessionAnswers([]);
    setSessionState("active");
  };

  const handleAnswerSubmit = async (question, childAnswer, isCorrect) => {
    const updatedQuestion = await PracticeQuestion.update(question.id, {
      completed: true,
      child_answer: childAnswer,
      answer_correct: isCorrect,
    });

    setSessionAnswers(prev => [...prev, { ...updatedQuestion, child_answer: childAnswer, is_correct: isCorrect }]);
    
    // Also update the main question list so history is fresh
    setAllQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setSessionState("finished");
    }
  };

  const resetSession = () => {
    setSessionState("setup");
    // No need to reload data, just reset filters/state
  };

  const incompleteQuestions = allQuestions.filter(q => !q.completed);
  const completedQuestions = allQuestions.filter(q => q.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Practice & Review</h1>
            <p className="text-gray-600 mt-1">Sharpen skills and review past performance</p>
          </div>
        </div>

        <div className="flex justify-center mb-6 bg-gray-200/50 p-1 rounded-lg">
          <Button 
            onClick={() => setViewMode('practice')} 
            className={`flex-1 ${viewMode === 'practice' ? 'bg-white shadow' : 'bg-transparent text-gray-600'}`}
            variant="ghost"
          >
            Practice Zone
          </Button>
          <Button 
            onClick={() => setViewMode('history')} 
            className={`flex-1 ${viewMode === 'history' ? 'bg-white shadow' : 'bg-transparent text-gray-600'}`}
            variant="ghost"
          >
            Practice History
          </Button>
        </div>

        {viewMode === 'practice' && (
          <div className="space-y-6">
            {sessionState === 'setup' && (
              <PracticeFilters 
                children={children}
                onStartSession={startSession}
                isLoading={isLoading}
                availableQuestions={incompleteQuestions.length}
              />
            )}
            
            {sessionState === 'active' && filteredQuestions.length > 0 && (
              <QuestionCard 
                question={filteredQuestions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={filteredQuestions.length}
                onSubmit={handleAnswerSubmit}
                onNextQuestion={handleNextQuestion}
              />
            )}
            
            {sessionState === 'active' && filteredQuestions.length === 0 && (
               <Card className="text-center p-8 shadow-lg">
                 <CardTitle>No Practice Questions Available</CardTitle>
                 <CardContent>
                    <p className="mt-4 text-gray-600">All practice questions for the selected filters have been completed. Check back after grading more assignments!</p>
                    <Button onClick={resetSession} className="mt-6">Back to Setup</Button>
                 </CardContent>
               </Card>
            )}

            {sessionState === 'finished' && (
              <PracticeSummary
                answers={sessionAnswers}
                onRestart={resetSession}
                onGoToDashboard={() => navigate(createPageUrl("Dashboard"))}
              />
            )}
          </div>
        )}

        {viewMode === 'history' && (
          <PracticeHistoryView 
            completedQuestions={completedQuestions}
            children={children}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}