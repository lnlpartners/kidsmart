
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Star, Gem } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    price_note: '/ month',
    description: 'Get started with our basic features, perfect for trying out the app.',
    features: [
      '5 Homework Scans per Month',
      'Basic AI Analysis',
      'Practice Questions for 1 Child',
      'Email Support'
    ],
    button_text: 'Current Plan',
    icon: null
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$9.99',
    price_note: '/ month',
    description: 'Unlock more features for dedicated learners and multiple children.',
    features: [
      '50 Homework Scans per Month',
      'Advanced AI Analysis & Feedback',
      'Practice Questions for up to 3 Children',
      'Priority Email Support'
    ],
    button_text: 'Upgrade to Plus',
    icon: <Star className="w-5 h-5 text-yellow-500" />
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19.99',
    price_note: '/ month',
    description: 'The ultimate toolkit for academic success and in-depth progress tracking.',
    features: [
      'Unlimited Homework Scans',
      'In-depth Performance Analytics',
      'Practice Questions for Unlimited Children',
      '24/7 Live Chat Support'
    ],
    button_text: 'Upgrade to Premium',
    icon: <Gem className="w-5 h-5 text-blue-500" />
  },
];

export default function SubscriptionTiers({ currentPlan, onPlanChange, isLoading }) {
  if(isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array(3).fill(0).map((_, i) => (
             <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-24 w-full" />
             </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>Choose the plan that best fits your family's needs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {tiers.map((tier) => (
          <div 
            key={tier.id} 
            className={`p-6 rounded-xl transition-all duration-300 ${
              currentPlan === tier.id 
                ? 'border-2 border-blue-500 bg-blue-50' 
                : 'border border-gray-200 bg-white'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {tier.icon}
                  <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                  {currentPlan === tier.id && (
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Current Plan
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-extrabold text-gray-900">{tier.price}</span>
                  <span className="text-gray-500 ml-1">{tier.price_note}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                <Button
                  onClick={() => onPlanChange(tier.id)}
                  disabled={currentPlan === tier.id}
                  className={`w-full sm:w-auto ${
                    tier.id !== 'free' ? 'bg-gradient-to-r from-blue-500 to-green-500' : 'bg-gray-300'
                  }`}
                >
                  {tier.button_text}
                </Button>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <p className="font-semibold text-gray-800 mb-2">Features include:</p>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
