
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Check, X, ArrowRight } from 'lucide-react';

export default function QuestionCard({ question, questionNumber, totalQuestions, onSubmit, onNextQuestion }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [question]);

  const handleSubmit = () => {
    if (selectedAnswer === null || selectedAnswer === '') return;
    setIsAnswered(true);

    let isCorrect;
    if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        isCorrect = selectedAnswer === question.correct_answer;
    } else {
        const correctAnswerClean = question.correct_answer.toString().trim().toLowerCase();
        const childAnswerClean = selectedAnswer.toString().trim().toLowerCase();
        isCorrect = childAnswerClean === correctAnswerClean;
    }
    
    onSubmit(question, selectedAnswer, isCorrect);
  };

  const getButtonVariant = (option) => {
    if (!isAnswered) {
      return selectedAnswer === option ? 'default' : 'outline';
    }
    if (option === question.correct_answer) return 'success';
    if (option === selectedAnswer) return 'destructive';
    return 'outline';
  };
  
  const isCorrectAnswer = () => {
    if (!isAnswered || selectedAnswer === null) return false;
    
    if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        return selectedAnswer === question.correct_answer;
    } else {
        const correctAnswerClean = question.correct_answer.toString().trim().toLowerCase();
        const childAnswerClean = selectedAnswer.toString().trim().toLowerCase();
        return childAnswerClean === correctAnswerClean;
    }
  };

  const isFillType = ['fill_blank', 'short_answer', 'math_problem'].includes(question.question_type);
  
  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">{question.subject.charAt(0).toUpperCase() + question.subject.slice(1)} Practice</CardTitle>
            <Badge variant="secondary">{question.skill_area}</Badge>
          </div>
          <div className="text-right">
            <p className="font-semibold">{questionNumber} / {totalQuestions}</p>
            <p className="text-sm text-gray-500">Question</p>
          </div>
        </div>
        <Progress value={(questionNumber / totalQuestions) * 100} className="w-full mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-800">{question.question}</p>
        </div>

        <div className="space-y-3">
          {question.question_type === 'multiple_choice' && question.options.map((option, index) => (
            <Button
              key={index}
              variant={getButtonVariant(option)}
              onClick={() => !isAnswered && setSelectedAnswer(option)}
              className="w-full justify-start h-auto py-3 px-4 text-left"
            >
              <div className="flex items-center w-full">
                <div className="w-6 h-6 border rounded-full mr-3 flex-shrink-0 flex items-center justify-center">
                  {getButtonVariant(option) === 'success' && <Check className="w-4 h-4"/>}
                  {getButtonVariant(option) === 'destructive' && <X className="w-4 h-4"/>}
                </div>
                <span className="flex-1 whitespace-normal">{option}</span>
              </div>
            </Button>
          ))}
          
          {question.question_type === 'true_false' && ['True', 'False'].map((option, index) => (
            <Button
              key={index}
              variant={getButtonVariant(option)}
              onClick={() => !isAnswered && setSelectedAnswer(option)}
              className="w-full justify-start h-auto py-3 px-4 text-left"
            >
              <div className="flex items-center w-full">
                <div className="w-6 h-6 border rounded-full mr-3 flex-shrink-0 flex items-center justify-center">
                  {getButtonVariant(option) === 'success' && <Check className="w-4 h-4"/>}
                  {getButtonVariant(option) === 'destructive' && <X className="w-4 h-4"/>}
                </div>
                <span className="flex-1 whitespace-normal">{option}</span>
              </div>
            </Button>
          ))}
          
          {isFillType && (
            <Input 
              placeholder="Type your answer here..."
              value={selectedAnswer || ''}
              onChange={(e) => !isAnswered && setSelectedAnswer(e.target.value)}
              disabled={isAnswered}
            />
          )}
        </div>
        
        {!isAnswered && (
          <Button onClick={handleSubmit} disabled={selectedAnswer === null || selectedAnswer === ''} className="w-full">
            Submit Answer
          </Button>
        )}

        {isAnswered && (
          <>
            <div className={`p-4 rounded-lg mt-4 ${isCorrectAnswer() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <h4 className="font-bold text-lg mb-2">
                {isCorrectAnswer() ? 'Correct!' : 'Not quite...'}
              </h4>
              <p><span className="font-semibold">Correct Answer:</span> {question.correct_answer}</p>
              {question.explanation && <p className="mt-2"><span className="font-semibold">Explanation:</span> {question.explanation}</p>}
            </div>
            
            <Button onClick={onNextQuestion} className="w-full mt-4">
              {isLastQuestion ? 'Finish Practice' : 'Next Question'}
              {!isLastQuestion && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
