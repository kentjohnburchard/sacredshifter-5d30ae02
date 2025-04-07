
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Music, Zap, CreditCard, PiggyBank, Shield, Award, Clock3, Key } from "lucide-react";
import { SubscriptionPlan, useUserSubscription } from "@/hooks/useUserSubscription";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Subscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    loading, 
    plans, 
    userSubscription, 
    userCredits, 
    billingCycle, 
    toggleBillingCycle, 
    subscribeToPlan 
  } = useUserSubscription();

  // If no plans from API, use default plans based on requirements
  const defaultPlans: SubscriptionPlan[] = [
    {
      id: "free-tier",
      name: "Free",
      tier_name: "Awaken",
      price: 0,
      credits_per_period: 2,
      period: "month",
      songs_equivalent: 1,
      features: [
        "Shift Your Perception content",
        "Heart Frequency Playlist access",
        "Soul Hug feature",
        "Community access"
      ],
      is_popular: false,
      is_best_value: false,
      is_lifetime: false,
      yearly_discount: 0
    },
    {
      id: "premium-monthly",
      name: "Premium",
      tier_name: "Align",
      price: 12.99,
      credits_per_period: 25,
      period: "month",
      songs_equivalent: 5,
      features: [
        "All Free Tier features",
        "Sacred Blueprint™ access",
        "Mirror Portal™ interactive tools",
        "Emotion Engine™ advanced tracking",
        "Priority customer support"
      ],
      is_popular: true,
      is_best_value: false,
      is_lifetime: false,
      yearly_discount: 17
    },
    {
      id: "premium-lifetime",
      name: "Lifetime Access",
      tier_name: "Ascend",
      price: 399.99,
      credits_per_period: 1000,
      period: "lifetime",
      songs_equivalent: 200,
      features: [
        "All Premium features",
        "Lifetime platform access",
        "Unlimited music downloads",
        "Early access to new features",
        "Premium customer support"
      ],
      is_popular: false,
      is_best_value: true,
      is_lifetime: true,
      yearly_discount: 0
    }
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (!user) {
      toast.error("Please log in to subscribe");
      navigate("/auth");
      return;
    }
    subscribeToPlan(plan.id, billingCycle);
  };

  // Calculate actual price with yearly discount
  const calculatePrice = (plan: SubscriptionPlan) => {
    // If it's a lifetime plan, simply return the price
    if (plan.is_lifetime) {
      return {
        original: plan.price,
        discounted: plan.price,
        monthly: null, // Not applicable for lifetime
        saveAmount: 0, 
        savePercentage: 0
      };
    }
    
    // If it's yearly with a discount
    if (billingCycle === 'yearly' && plan.yearly_discount > 0) {
      const monthlyPrice = plan.price;
      const discountMultiplier = (100 - plan.yearly_discount) / 100;
      const yearlyPrice = monthlyPrice * 12 * discountMultiplier;
      return {
        original: monthlyPrice * 12,
        discounted: yearlyPrice,
        monthly: yearlyPrice / 12,
        saveAmount: monthlyPrice * 12 - yearlyPrice,
        savePercentage: plan.yearly_discount
      };
    }
    
    // Regular monthly price
    return {
      original: plan.price,
      discounted: plan.price,
      monthly: plan.price,
      saveAmount: 0,
      savePercentage: 0
    };
  };

  // Filter plans based on the currently selected billing cycle
  const getFilteredPlans = () => {
    if (billingCycle === 'lifetime') {
      return displayPlans.filter(plan => plan.is_lifetime || plan.id === "free-tier");
    } else {
      return displayPlans.filter(plan => !plan.is_lifetime);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[url('/lovable-uploads/03d64fc7-3a06-4a05-bb16-d5f23d3983f5.png')] bg-cover bg-center bg-fixed">
      {/* Darker overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/95 via-purple-950/95 to-black/95 backdrop-blur-sm -z-10"></div>
      
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-shadow-lg">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-purple-200 to-blue-200">
              Subscribe to Sacred Shifter
            </span>
          </h2>
          <p className="text-slate-100 max-w-2xl mx-auto text-lg text-shadow-sm">
            Begin your journey from human consciousness to spirit consciousness
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-white text-lg">Loading subscription options...</p>
          </div>
        ) : (
          <>
            {/* User's current credits display */}
            {user && userCredits && (
              <Card className="border-none shadow-xl bg-black/70 backdrop-blur-md border border-white/10 overflow-hidden mb-10">
                <CardContent className="p-6 text-white text-center">
                  <h3 className="text-xl font-semibold mb-2">Your Credit Balance</h3>
                  <div className="flex items-center justify-center gap-2">
                    <PiggyBank className="h-6 w-6 text-accent" />
                    <span className="text-3xl font-bold text-white">
                      {userCredits.balance}
                    </span>
                    <span className="text-slate-300">credits</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Last updated: {new Date(userCredits.last_updated).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Billing cycle toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-full p-1 flex items-center gap-2 shadow-lg">
                <Button 
                  variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => toggleBillingCycle('monthly')}
                  className={cn(
                    "rounded-full font-medium", 
                    billingCycle === 'monthly' 
                      ? "bg-accent text-white" 
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  Monthly
                </Button>
                <Button 
                  variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => toggleBillingCycle('yearly')}
                  className={cn(
                    "rounded-full font-medium relative", 
                    billingCycle === 'yearly' 
                      ? "bg-accent text-white" 
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500 text-white text-[10px] px-1 rounded-full">
                      Save 17%
                    </Badge>
                  </span>
                </Button>
                <Button 
                  variant={billingCycle === 'lifetime' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => toggleBillingCycle('lifetime')}
                  className={cn(
                    "rounded-full font-medium", 
                    billingCycle === 'lifetime' 
                      ? "bg-accent text-white" 
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  Lifetime
                </Button>
              </div>
            </div>
            
            {/* Subscription plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getFilteredPlans().map((plan) => {
                const price = calculatePrice(plan);
                return (
                  <Card 
                    key={plan.id} 
                    className={cn(
                      "h-full flex flex-col justify-between border-none shadow-xl backdrop-blur-md overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-accent/20",
                      plan.is_popular 
                        ? "bg-gradient-to-b from-purple-900/90 to-black/80 border border-purple-500/50 shadow-lg shadow-purple-500/20" 
                        : plan.is_best_value
                        ? "bg-gradient-to-b from-blue-900/90 to-black/80 border border-blue-500/50 shadow-lg shadow-blue-500/20"
                        : "bg-black/70 border border-white/10"
                    )}
                  >
                    {(plan.is_popular || plan.is_best_value) && (
                      <div className={cn(
                        "absolute top-0 right-0 left-0 text-center py-1 text-xs font-semibold text-white",
                        plan.is_popular ? "bg-purple-600" : "bg-blue-600"
                      )}>
                        {plan.is_popular ? "Most Popular" : plan.is_best_value ? "Best Value" : ""}
                      </div>
                    )}
                    
                    <CardHeader className={cn(
                      "text-center pt-8",
                      (plan.is_popular || plan.is_best_value) ? "pt-12" : ""
                    )}>
                      <div className="flex items-center justify-center mb-2">
                        {plan.tier_name && (
                          <Badge className="bg-white/20 text-white px-2 py-1">
                            {plan.tier_name}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                      <CardDescription className="text-slate-300">
                        {plan.price === 0 ? (
                          "Basic access to essential features"
                        ) : (
                          plan.songs_equivalent 
                            ? `${plan.songs_equivalent} songs per ${plan.period}`
                            : ""
                        )}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="text-center">
                      <div className="mb-4">
                        <div className="relative">
                          {plan.price === 0 ? (
                            <span className="text-4xl font-bold text-white">Free</span>
                          ) : (
                            <>
                              <span className="text-4xl font-bold text-white">${plan.is_lifetime ? plan.price.toFixed(2) : price.discounted.toFixed(2)}</span>
                              {plan.is_lifetime ? (
                                <span className="text-sm text-slate-300 ml-1">one-time</span>
                              ) : (
                                billingCycle === 'yearly' ? (
                                  <span className="text-sm text-slate-300 ml-1">/ year</span>
                                ) : (
                                  <span className="text-sm text-slate-300 ml-1">/ month</span>
                                )
                              )}
                              
                              {billingCycle === 'yearly' && price.savePercentage > 0 && (
                                <div className="mt-1">
                                  <span className="text-sm text-green-400">Save ${price.saveAmount.toFixed(2)} ({price.savePercentage}%)</span>
                                </div>
                              )}
                              
                              {billingCycle === 'yearly' && price.monthly && (
                                <div className="mt-1 text-xs text-slate-300">
                                  ${price.monthly.toFixed(2)} / month
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        
                        {plan.credits_per_period > 0 && (
                          <div className="mt-4 flex items-center justify-center gap-2">
                            <PiggyBank className="h-4 w-4 text-accent" />
                            <span className="text-lg font-semibold text-white">
                              {plan.credits_per_period} credits
                            </span>
                            <span className="text-xs text-slate-300">
                              {plan.is_lifetime ? "total" : `per ${plan.period}`}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-4 bg-white/10" />
                      
                      <div className="space-y-2 mt-4 text-left">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-100">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="mt-auto">
                      {plan.price === 0 ? (
                        <Button 
                          className="w-full font-semibold gap-2 bg-white/20 hover:bg-white/30 text-white"
                          onClick={() => navigate("/home")}
                        >
                          <Key className="h-4 w-4" />
                          Get Started Free
                        </Button>
                      ) : (
                        <Button 
                          className={cn(
                            "w-full font-semibold gap-2",
                            plan.is_popular 
                              ? "bg-purple-600 hover:bg-purple-700" 
                              : plan.is_best_value
                              ? "bg-blue-600 hover:bg-blue-700"
                              : ""
                          )}
                          onClick={() => handleSubscribe(plan)}
                        >
                          <CreditCard className="h-4 w-4" />
                          {userSubscription?.plan_id === plan.id
                            ? "Current Plan"
                            : `Subscribe ${plan.is_lifetime ? "Once" : "Now"}`
                          }
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            
            {/* Features section */}
            <div className="mt-16 space-y-12">
              <h3 className="text-3xl font-bold text-center text-white text-shadow-lg mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                  What You Get
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-none bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 bg-purple-900/40 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                      <Music className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle className="text-xl text-white">Sacred Blueprint™</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-center">
                    Get your personalized vibrational identity charts and in-depth analyses tailored specifically to your energy signature.
                  </CardContent>
                </Card>
                
                <Card className="border-none bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 bg-purple-900/40 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle className="text-xl text-white">Mirror Portal™</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-center">
                    Access interactive affirmations and powerful tools aligned with your emotional and spiritual state for maximum transformation.
                  </CardContent>
                </Card>
                
                <Card className="border-none bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 bg-purple-900/40 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                      <Award className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle className="text-xl text-white">Emotion Engine™</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-center">
                    Utilize advanced tools for tracking and optimizing your emotional well-being and reality perception for spiritual growth.
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* FAQ section */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center text-white text-shadow-lg mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                  Frequently Asked Questions
                </span>
              </h3>
              
              <div className="space-y-6 max-w-3xl mx-auto">
                <Card className="border-none bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">What's included in the free tier?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300">
                    The free "Awaken" tier includes access to Shift Your Perception content, Heart Frequency Playlist, Soul Hug feature, and Community access, perfect for starting your spiritual journey.
                  </CardContent>
                </Card>
                
                <Card className="border-none bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">What's the difference between monthly and yearly billing?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300">
                    With yearly billing on our "Align" tier, you save approximately 17% compared to monthly billing. The yearly subscription is $129.99 instead of $155.88 when paying monthly.
                  </CardContent>
                </Card>
                
                <Card className="border-none bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">What is the Lifetime Access option?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300">
                    Our "Ascend" Lifetime Access tier provides permanent access to all premium features with a one-time payment of $399.99, offering significant savings for those committed to their spiritual journey long-term.
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-slate-300">
        <p>Sacred Shifter - Generate music and heal with sound.</p>
      </footer>
    </div>
  );
};

export default Subscription;
