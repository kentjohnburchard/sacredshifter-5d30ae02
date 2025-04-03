
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, CreditCard } from "lucide-react";

interface SubscriptionPromotionProps {
  compact?: boolean;
}

const SubscriptionPromotion: React.FC<SubscriptionPromotionProps> = ({ compact = false }) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return compact ? (
    <Card className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-none shadow-lg mb-6">
      <CardContent className="pt-6 pb-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-300" />
          <p className="text-white text-sm">Unlock unlimited healing music</p>
        </div>
        <Link to="/subscription">
          <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
            Subscribe
          </Button>
        </Link>
      </CardContent>
    </Card>
  ) : (
    <Card className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-none shadow-lg mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-5 w-5 text-amber-300" />
          <h3 className="text-lg font-semibold text-white">Sacred Shifter Premium</h3>
        </div>
        <p className="text-white/90 mb-4">
          Subscribe to unlock unlimited sound journeys and premium features. Generate more healing music with dedicated credits.
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <p className="text-white/90 text-sm">Unlimited sacred frequencies</p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <p className="text-white/90 text-sm">Premium music generation</p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <p className="text-white/90 text-sm">Monthly credits refresh</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-6">
        <Link to="/subscription" className="w-full">
          <Button className="w-full bg-accent hover:bg-accent/90" size="lg">
            View Subscription Plans
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPromotion;
