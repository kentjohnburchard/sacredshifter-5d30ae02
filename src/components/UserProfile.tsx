import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Settings, Bell, Shield, CreditCard, LogOut, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fetchProfile, updateProfile, ProfileType } from "@/utils/profiles";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().optional(),
  displayName: z.string().min(2, "Display name must be at least 2 characters").optional(),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
});

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      displayName: "",
      bio: "",
    },
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user?.email) {
      emailForm.setValue("email", user.email);
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      const data = await fetchProfile(user.id);
      
      if (data) {
        profileForm.setValue("fullName", data.full_name || "");
        profileForm.setValue("displayName", data.display_name || "");
        profileForm.setValue("bio", data.bio || "");
        setAvatarUrl(data.avatar_url);
        setProfile(data);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: ProfileFormValues) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await updateProfile(user.id, {
        full_name: data.fullName || null,
        display_name: data.displayName || null,
        bio: data.bio || null,
        updated_at: new Date().toISOString(),
      });
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      setError(error.message);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (data: EmailFormValues) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        email: data.email,
      });
      
      if (error) throw error;
      
      toast.success("Verification email sent. Please check your inbox.");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (data: PasswordFormValues) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: data.currentPassword,
      });
      
      if (signInError) throw new Error("Current password is incorrect");
      
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id) return;
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingAvatar(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const avatarUrl = urlData.publicUrl;
      
      await updateProfile(user.id, {
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });
      
      setAvatarUrl(avatarUrl);
      toast.success("Avatar updated successfully");
    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You've been signed out");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Signed In</CardTitle>
            <CardDescription>
              Please sign in to view your profile
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => window.location.href = "/auth"}
              className="w-full"
            >
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Card className="w-full md:w-80 h-fit">
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={avatarUrl || ""} alt={user.email || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white text-xl">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 shadow-sm"
                  >
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 5.5C13 4.94772 12.5523 4.5 12 4.5C11.4477 4.5 11 4.94772 11 5.5V11H5.5C4.94772 11 4.5 11.4477 4.5 12C4.5 12.5523 4.94772 13 5.5 13H11V18.5C11 19.0523 11.4477 19.5 12 19.5C12.5523 19.5 13 19.0523 13 18.5V13H18.5C19.0523 13 19.5 12.5523 19.5 12C19.5 11.4477 19.0523 11 18.5 11H13V5.5Z" fill="currentColor" />
                      </svg>
                    )}
                  </label>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </div>
                
                <h3 className="text-lg font-medium mt-2">
                  {profileForm.getValues("displayName") || user.email?.split('@')[0]}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                
                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 mt-2" 
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Account</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </TabsTrigger>
                </TabsList>
                
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <TabsContent value="profile">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your full name" 
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your full name. It is only visible to you.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="How you want to be known" 
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is the name that will be displayed publicly.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="A short bio about yourself" 
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Tell us a little about yourself. This will be displayed on your profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Profile"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="account">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email</h3>
                      <Form {...emailForm}>
                        <form onSubmit={emailForm.handleSubmit(handleUpdateEmail)} className="space-y-4">
                          <FormField
                            control={emailForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  You'll need to verify your email if you change it.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Email"}
                          </Button>
                        </form>
                      </Form>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Password</h3>
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(handleUpdatePassword)} className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                          </Button>
                        </form>
                      </Form>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.539 9.103 1.519 12.09 1 1.468 2.2 3.105 3.773 3.043 1.52-.065 2.09-.987 3.922-.987 1.831 0 2.35.987 3.958.948 1.636-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.577 1.09z" fill="currentColor"/>
                                <path d="M14.128 3.973c.834-1.014 1.392-2.427 1.234-3.834-1.193.052-2.636.793-3.494 1.807-.767.884-1.438 2.3-1.26 3.66 1.336.105 2.674-.688 3.52-1.633z" fill="currentColor"/>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Google</p>
                              <p className="text-sm text-muted-foreground">Connect your Google account</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.539 9.103 1.519 12.09 1 1.468 2.2 3.105 3.773 3.043 1.52-.065 2.09-.987 3.922-.987 1.831 0 2.35.987 3.958.948 1.636-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.577 1.09z" fill="currentColor"/>
                                <path d="M14.128 3.973c.834-1.014 1.392-2.427 1.234-3.834-1.193.052-2.636.793-3.494 1.807-.767.884-1.438 2.3-1.26 3.66 1.336.105 2.674-.688 3.52-1.633z" fill="currentColor"/>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Apple</p>
                              <p className="text-sm text-muted-foreground">Connect your Apple account</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="email-notifications">Enable</Label>
                            <input
                              type="checkbox"
                              id="email-notifications"
                              className="toggle toggle-primary"
                              defaultChecked
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">New Features</p>
                            <p className="text-sm text-muted-foreground">Get notified about new features and updates</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="feature-notifications">Enable</Label>
                            <input
                              type="checkbox"
                              id="feature-notifications"
                              className="toggle toggle-primary"
                              defaultChecked
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Communications</p>
                            <p className="text-sm text-muted-foreground">Receive marketing emails and promotions</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="marketing-notifications">Enable</Label>
                            <input
                              type="checkbox"
                              id="marketing-notifications"
                              className="toggle toggle-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button>Save Preferences</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
