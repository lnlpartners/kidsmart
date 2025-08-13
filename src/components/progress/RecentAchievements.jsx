import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Target, 
  Flame,
  Award,
  Zap,
  CheckCircle2
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function RecentAchievements({ child, assignments, allAssignments }) {
  const generateAchievements = () => {
    const achievements = [];
    
    // Perfect Score Achievement
    const perfectScores = assignments.filter(a => a.score_percentage === 100);
    if (perfectScores.length > 0) {
      const latest = perfectScores[0];
      achievements.push({
        id: 'perfect-score',
        title: 'Perfect Score! 🎯',
        description: `Scored 100% on ${latest.title}`,
        icon: Trophy,
        color: 'from-yellow-400 to-yellow-600',
        bgColor: 'from-yellow-50 to-yellow-100',
        textColor: 'text-yellow-700',
        date: latest.created_date
      });
    }

    // Improvement Streak
    const sortedAssignments = [...assignments].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    let streak = 0;
    for (let i = 1; i < sortedAssignments.length; i++) {
      if (sortedAssignments[i].score_percentage >= sortedAssignments[i-1].score_percentage) {
        streak++;
      } else {
        break;
      }
    }
    
    if (streak >= 2) {
      achievements.push({
        id: 'improvement-streak',
        title: `${streak + 1}-Assignment Streak! 🔥`,
        description: 'Consistent improvement across assignments',
        icon: Flame,
        color: 'from-orange-400 to-red-500',
        bgColor: 'from-orange-50 to-red-50',
        textColor: 'text-orange-700',
        date: sortedAssignments[sortedAssignments.length - 1]?.created_date
      });
    }

    // Subject Mastery
    const subjectScores = assignments.reduce((acc, a) => {
      if (!acc[a.subject]) acc[a.subject] = [];
      acc[a.subject].push(a.score_percentage);
      return acc;
    }, {});

    Object.entries(subjectScores).forEach(([subject, scores]) => {
      const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      if (avgScore >= 90 && scores.length >= 2) {
        achievements.push({
          id: `${subject}-mastery`,
          title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Master! 📚`,
          description: `Maintaining ${Math.round(avgScore)}% average in ${subject}`,
          icon: Award,
          color: 'from-purple-400 to-purple-600',
          bgColor: 'from-purple-50 to-purple-100',
          textColor: 'text-purple-700',
          date: assignments.find(a => a.subject === subject)?.created_date
        });
      }
    });

    // Quick Learner (rapid improvement)
    if (assignments.length >= 3) {
      const recent = assignments.slice(0, 3);
      const oldest = recent[recent.length - 1];
      const newest = recent[0];
      const improvement = newest.score_percentage - oldest.score_percentage;
      
      if (improvement >= 15) {
        achievements.push({
          id: 'quick-learner',
          title: 'Quick Learner! ⚡',
          description: `Improved score by ${improvement}% in recent assignments`,
          icon: Zap,
          color: 'from-blue-400 to-blue-600',
          bgColor: 'from-blue-50 to-blue-100',
          textColor: 'text-blue-700',
          date: newest.created_date
        });
      }
    }

    // Consistent Performer
    const recentScores = assignments.slice(0, 5).map(a => a.score_percentage);
    const consistency = recentScores.every(score => score >= 80);
    if (consistency && recentScores.length >= 3) {
      achievements.push({
        id: 'consistent-performer',
        title: 'Consistent Star! ⭐',
        description: 'Scoring 80%+ on all recent assignments',
        icon: Star,
        color: 'from-green-400 to-green-600',
        bgColor: 'from-green-50 to-green-100',
        textColor: 'text-green-700',
        date: assignments[0]?.created_date
      });
    }

    // Study Champion (completed many assignments)
    if (allAssignments.length >= 10) {
      achievements.push({
        id: 'study-champion',
        title: 'Study Champion! 🏆',
        description: `Completed ${allAssignments.length} assignments total`,
        icon: CheckCircle2,
        color: 'from-indigo-400 to-indigo-600',
        bgColor: 'from-indigo-50 to-indigo-100',
        textColor: 'text-indigo-700',
        date: assignments[0]?.created_date
      });
    }

    return achievements
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4); // Show top 4 achievements
  };

  const achievements = generateAchievements();

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Keep working hard! Achievements will appear here as you progress.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl bg-gradient-to-r ${achievement.bgColor} border border-gray-200 hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-gradient-to-r ${achievement.color} rounded-full shadow-sm`}>
                    <achievement.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-lg ${achievement.textColor} mb-1`}>
                      {achievement.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-2">
                      {achievement.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {formatDistanceToNow(new Date(achievement.date), { addSuffix: true })}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}