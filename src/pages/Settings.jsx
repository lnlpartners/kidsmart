import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, Smartphone, Save, CheckCircle, Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoSaveHomework, setAutoSaveHomework] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setEmailNotifications(currentUser.email_notifications ?? true);
      setPushNotifications(currentUser.push_notifications ?? true);
      setAutoSaveHomework(currentUser.auto_save_homework ?? true);
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await User.updateMyUserData({
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        auto_save_homework: autoSaveHomework
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error("Failed to update settings", error);
    }
    setIsSaving(false);
  };

  const getPlanBadge = (plan) => {
    const badges = {
      free: { text: "Free", color: "bg-gray-100 text-gray-800" },
      plus: { text: "Plus", color: "bg-blue-100 text-blue-800" },
      premium: { text: "Premium", color: "bg-purple-100 text-purple-800" }
    };
    return badges[plan] || badges.free;
  };

  const getPlanFeatures = (plan) => {
    const features = {
      free: ["5 Homework Scans per Month", "Basic AI Analysis", "Practice Questions for 1 Child"],
      plus: ["50 Homework Scans per Month", "Advanced AI Analysis", "Practice Questions for up to 3 Children"],
      premium: ["Unlimited Homework Scans", "In-depth Analytics", "Practice Questions for Unlimited Children"]
    };
    return features[plan] || features.free;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your app preferences and subscription</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                Notifications
              </CardTitle>
              <CardDescription>Control how you receive updates about your children's progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-sm font-medium text-gray-900">
                        Email Notifications
                      </Label>
                      <p className="text-xs text-gray-500">Receive updates about assignments and progress via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="text-sm font-medium text-gray-900">
                        Push Notifications
                      </Label>
                      <p className="text-xs text-gray-500">Get real-time alerts on your device</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize how the app handles your data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <Skeleton className="h-6 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save" className="text-sm font-medium text-gray-900">
                      Auto-save Homework
                    </Label>
                    <p className="text-xs text-gray-500">
                      Automatically save uploaded homework assignments
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Note: We automatically delete homework files older than 6 months
                    </p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={autoSaveHomework}
                    onCheckedChange={setAutoSaveHomework}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Current Subscription */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Current Subscription
            </CardTitle>
            <CardDescription>Manage your subscription plan and features.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-40" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 capitalize">
                        {user?.subscription_plan || 'free'} Plan
                      </h3>
                      <Badge className={getPlanBadge(user?.subscription_plan || 'free').color}>
                        {getPlanBadge(user?.subscription_plan || 'free').text}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {getPlanFeatures(user?.subscription_plan || 'free').map((feature, index) => (
                        <p key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {feature}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate(createPageUrl("SubscriptionTiers"))}
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          {saveSuccess && (
            <Alert className="bg-green-50 border-green-200 text-green-800 max-w-md">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Settings saved successfully!</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}