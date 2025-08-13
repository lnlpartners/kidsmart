import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PracticeFilters({ children, onStartSession, isLoading, availableQuestions }) {
  const [childId, setChildId] = useState("");
  const [subject, setSubject] = useState("all");

  const subjects = ["math", "english", "science", "history", "reading", "writing", "spelling"];

  const handleStart = () => {
    onStartSession({ childId, subject });
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Start a New Practice Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Child Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Child</label>
                <Select value={childId} onValueChange={setChildId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a child (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map(child => (
                      <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(s => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t">
              <p className="text-gray-600 mb-4 sm:mb-0">
                {availableQuestions} practice questions available.
              </p>
              <Button 
                onClick={handleStart} 
                disabled={availableQuestions === 0}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Practice
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}