
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, CreditCard, ShieldCheck } from "lucide-react";

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
          <p className="text-white text-sm">Align your journey - Upgrade now</p>
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
          <ShieldCheck className="h-5 w-5 text-amber-300" />
          <h3 className="text-lg font-semibold text-white">Sacred Shifter Premium</h3>
          <Badge className="bg-white/20 text-white text-xs px-2">Align</Badge>
        </div>
        <p className="text-white/90 mb-4">
          Upgrade to unlock Sacred Blueprint™, Mirror Portal™, and Emotion Engine™. Begin your journey from human to spirit consciousness.
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <p className="text-white/90 text-sm">Sacred Blueprint™ personal analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <p className="text-white/90 text-sm">Mirror Portal™ interactive tools</p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <p className="text-white/90 text-sm">Emotion Engine™ advanced tracking</p>
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
