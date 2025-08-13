import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Award, Mail } from "lucide-react";

export default function TutorCard({ tutor }) {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start gap-4">
          <img 
            src={tutor.avatar_url || 'https://placehold.co/100x100'} 
            alt={tutor.name} 
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(tutor.rating || 0))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                {[...Array(5 - Math.floor(tutor.rating || 0))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gray-300" />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">({tutor.rating?.toFixed(1)})</span>
            </div>
            {tutor.is_verified && (
                <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200">
                    <Award className="w-3 h-3 mr-1" />
                    Verified
                </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">{tutor.bio}</p>
        <div>
            <h4 className="font-semibold text-sm text-gray-800 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
                {tutor.subjects.map(subject => (
                    <Badge key={subject} variant="outline" className="capitalize">{subject}</Badge>
                ))}
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-shrink-0 flex items-center justify-between bg-gray-50/50 p-4">
        <div className="text-lg font-bold text-gray-900">
          ${tutor.hourly_rate}
          <span className="text-sm font-normal text-gray-500">/hr</span>
        </div>
        <a href={`mailto:${tutor.contact_email}?subject=Tutoring Request for ${tutor.name}`}>
          <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
            <Mail className="w-4 h-4 mr-2" />
            Contact Tutor
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}