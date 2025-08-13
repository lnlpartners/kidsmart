import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Star, Gem, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceNote: '/ month',
    description: 'Get started with our basic features, perfect for trying out the app.',
    features: [
      '5 Homework Scans per Month',
      'Basic AI Analysis',
      'Practice Questions for 1 Child',
      'Email Support'
    ],
    icon: null,
    popular: false
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$9.99',
    priceNote: '/ month',
    description: 'Unlock more features for dedicated learners and multiple children.',
    features: [
      '50 Homework Scans per Month',
      'Advanced AI Analysis & Feedback',
      'Practice Questions for up to 3 Children',
      'Priority Email Support',
      'Progress Analytics'
    ],
    icon: <Star className="w-5 h-5 text-yellow-500" />,
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19.99',
    priceNote: '/ month',
    description: 'The ultimate toolkit for academic success and in-depth progress tracking.',
    features: [
      'Unlimited Homework Scans',
      'In-depth Performance Analytics',
      'Practice Questions for Unlimited Children',
      '24/7 Live Chat Support',
      'Custom Learning Plans',
      'Advanced Reporting'
    ],
    icon: <Gem className="w-5 h-5 text-blue-500" />,
    popular: false
  },
];

export default function SubscriptionTiersPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingPlan, setUpdatingPlan] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
    setIsLoading(false);
  };

  const handlePlanChange = async (newPlan) => {
    setUpdatingPlan(newPlan);
    try {
      await User.updateMyUserData({ subscription_plan: newPlan });
      setCurrentUser(prev => ({ ...prev, subscription_plan: newPlan }));
      
      // Show success message and redirect after a delay
      setTimeout(() => {
        navigate(createPageUrl("Settings"));
      }, 1500);
    } catch (error) {
      console.error("Failed to update subscription plan", error);
    }
    setUpdatingPlan(null);
  };

  const currentPlan = currentUser?.subscription_plan || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Settings"))}
            className="hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
            <p className="text-lg text-gray-600">Select the perfect plan for your family's learning journey</p>
          </div>
        </div>

        {updatingPlan && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-800 max-w-md mx-auto">
            <Crown className="h-4 w-4" />
            <AlertDescription>Updating your subscription plan...</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                tier.popular 
                  ? 'border-blue-500 bg-gradient-to-b from-blue-50 to-white transform scale-105' 
                  : currentPlan === tier.id
                    ? 'border-green-500 bg-gradient-to-b from-green-50 to-white'
                    : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <CardHeader className="text-center relative">
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                    Most Popular
                  </Badge>
                )}
                {currentPlan === tier.id && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                    Current Plan
                  </Badge>
                )}
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  {tier.icon}
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500 ml-1">{tier.priceNote}</span>
                  </div>
                </div>
                
                <CardDescription className="text-center">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handlePlanChange(tier.id)}
                  disabled={currentPlan === tier.id || updatingPlan === tier.id}
                  className={`w-full py-3 text-lg font-semibold ${
                    currentPlan === tier.id
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : tier.popular
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                  }`}
                >
                  {updatingPlan === tier.id 
                    ? 'Updating...' 
                    : currentPlan === tier.id 
                      ? 'Current Plan' 
                      : tier.id === 'free' 
                        ? 'Downgrade to Free'
                        : `Upgrade to ${tier.name}`
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-gray-600 text-sm">
          <p>All plans include a 7-day free trial. Cancel anytime.</p>
          <p className="mt-2">Need help choosing? <a href="#" className="text-blue-600 hover:underline">Contact our support team</a></p>
        </div>
      </div>
    </div>
  );
}