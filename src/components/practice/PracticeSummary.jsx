import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Home, RefreshCw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function PracticeSummary({ answers, onRestart, onGoToDashboard }) {
  const correctCount = answers.filter(a => a.answer_correct).length;
  const totalCount = answers.length;
  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold text-white">{score}%</span>
        </div>
        <CardTitle className="text-3xl font-bold">Practice Complete!</CardTitle>
        <p className="text-gray-600 mt-2">You answered {correctCount} out of {totalCount} questions correctly.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {answers.map(answer => (
            <div key={answer.id} className="p-3 border rounded-lg bg-white">
              <p className="font-medium text-gray-800 mb-2">{answer.question}</p>
              <div className="flex items-center justify-between text-sm">
                <Badge variant={answer.answer_correct ? 'success' : 'destructive'}>
                  {answer.answer_correct ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                  Your Answer: {answer.child_answer}
                </Badge>
                {!answer.answer_correct && (
                  <p className="text-green-700">Correct: {answer.correct_answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 mt-6 border-t">
          <Button
            onClick={onGoToDashboard}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Button>
          <Button
            onClick={onRestart}
            variant="outline"
            className="border-2 hover:bg-gray-50"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Start New Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}