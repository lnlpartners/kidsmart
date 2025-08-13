import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

export default function ProcessingView({ step, onCancel }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Assignment
          </h2>
          
          <p className="text-gray-600 mb-6">
            {step || "Analyzing your child's homework..."}
          </p>
          
          <div className="space-y-2 text-sm text-gray-500 mb-8">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>AI is reading the homework</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
              <span>Analyzing answers and performance</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-400"></div>
              <span>Generating practice questions</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Processing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}