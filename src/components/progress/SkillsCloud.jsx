import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SkillsCloud({ title, skills, icon: Icon, color }) {
  // Function to summarize and deduplicate skills
  const summarizeSkills = (skillsList) => {
    if (!skillsList || skillsList.length === 0) return [];
    
    // Create a frequency map and normalize similar terms
    const skillMap = new Map();
    const normalizedSkills = new Map();
    
    skillsList.forEach(skill => {
      if (!skill || typeof skill !== 'string') return;
      
      const cleaned = skill.toLowerCase().trim();
      
      // Group similar skills together
      const normalized = cleaned
        .replace(/\b(multiplication|multiplying|multiply)\b/gi, 'multiplication')
        .replace(/\b(addition|adding|add)\b/gi, 'addition')
        .replace(/\b(subtraction|subtracting|subtract)\b/gi, 'subtraction')
        .replace(/\b(division|dividing|divide)\b/gi, 'division')
        .replace(/\b(reading comprehension|comprehension|understanding text)\b/gi, 'reading comprehension')
        .replace(/\b(vocabulary|word meaning|word knowledge)\b/gi, 'vocabulary')
        .replace(/\b(grammar|sentence structure|punctuation)\b/gi, 'grammar')
        .replace(/\b(problem solving|word problems|solving problems)\b/gi, 'problem solving')
        .replace(/\b(fractions|fraction work|working with fractions)\b/gi, 'fractions')
        .replace(/\b(decimals|decimal operations)\b/gi, 'decimals')
        .replace(/\b(geometry|shapes|geometric concepts)\b/gi, 'geometry')
        .replace(/\b(measurement|measuring|units)\b/gi, 'measurement')
        .replace(/\b(patterns|pattern recognition)\b/gi, 'patterns');
      
      // Count occurrences
      const count = skillMap.get(normalized) || 0;
      skillMap.set(normalized, count + 1);
      
      // Keep the most readable version as the display name
      if (!normalizedSkills.has(normalized) || skill.length < normalizedSkills.get(normalized).length) {
        normalizedSkills.set(normalized, skill);
      }
    });
    
    // Convert to array and sort by frequency, then limit to top insights
    return Array.from(skillMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8) // Limit to top 8 most common skills
      .map(([normalizedSkill, count]) => ({
        skill: normalizedSkills.get(normalizedSkill),
        count
      }));
  };

  const summarizedSkills = summarizeSkills(skills);

  const colorClasses = {
    green: {
      text: "text-green-700",
      bg: "bg-gradient-to-r from-green-50 to-emerald-50",
      border: "border-green-200",
      headerBg: "bg-gradient-to-r from-green-50 to-emerald-50",
      badgeColors: [
        "bg-green-100 text-green-800 border-green-200",
        "bg-emerald-100 text-emerald-800 border-emerald-200",
        "bg-teal-100 text-teal-800 border-teal-200"
      ]
    },
    orange: {
      text: "text-orange-700",
      bg: "bg-gradient-to-r from-orange-50 to-red-50",
      border: "border-orange-200",
      headerBg: "bg-gradient-to-r from-orange-50 to-red-50",
      badgeColors: [
        "bg-orange-100 text-orange-800 border-orange-200",
        "bg-red-100 text-red-800 border-red-200",
        "bg-amber-100 text-amber-800 border-amber-200"
      ]
    }
  };

  const selectedColor = colorClasses[color] || colorClasses.green;

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      <CardHeader className={`${selectedColor.headerBg} border-b ${selectedColor.border}`}>
        <CardTitle className={`flex items-center gap-2 ${selectedColor.text}`}>
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-3">
          {summarizedSkills.length > 0 ? summarizedSkills.map(({ skill, count }, index) => {
            const badgeColor = selectedColor.badgeColors[index % selectedColor.badgeColors.length];
            return (
              <Badge 
                key={skill} 
                variant="secondary" 
                className={`py-2 px-4 text-sm font-medium ${badgeColor} border hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5`}
              >
                {skill}
                {count > 1 && (
                  <span className="ml-2 bg-white/60 rounded-full px-2 py-0.5 text-xs font-semibold">
                    {count}
                  </span>
                )}
              </Badge>
            );
          }) : (
            <div className="text-center w-full py-4">
              <Icon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No specific skills identified yet.</p>
            </div>
          )}
        </div>
        {skills.length > summarizedSkills.length && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            Showing top {summarizedSkills.length} insights from {skills.length} total feedback items
          </p>
        )}
      </CardContent>
    </Card>
  );
}