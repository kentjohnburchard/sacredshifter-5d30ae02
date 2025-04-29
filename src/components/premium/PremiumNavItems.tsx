
import React from 'react';
import { Link } from 'react-router-dom';
import { useUserSubscription } from '@/hooks/useUserSubscription';
import { Button } from "@/components/ui/button";
import { Sparkles, Star, BookOpen, FileText, LayoutDashboard, Zap } from 'lucide-react';

const PremiumNavItems: React.FC = () => {
  const { isPremiumUser } = useUserSubscription();
  
  if (!isPremiumUser()) {
    return (
      <div className="py-2">
        <Link to="/subscription">
          <Button variant="outline" size="sm" className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-500/20">
            <Star className="h-4 w-4 mr-2 text-purple-300" />
            <span>Upgrade</span>
          </Button>
        </Link>
      </div>
    );
  }
  
  const premiumLinks = [
    { to: "/premium", label: "Premium Dashboard", icon: LayoutDashboard },
    { to: "/premium/vale", label: "Vale AI Guide", icon: Sparkles, isNew: true },
    { to: "/premium/library", label: "Sacred Library", icon: BookOpen },
    { to: "/premium/journeys", label: "Premium Journeys", icon: Zap },
    { to: "/premium/wisdom", label: "Hermetic Wisdom", icon: FileText },
  ];
  
  return (
    <div className="space-y-1 py-2">
      {premiumLinks.map((link, index) => (
        <Link 
          key={index} 
          to={link.to} 
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-gray-800/50 hover:text-gray-100 group relative"
        >
          <link.icon className="h-4 w-4 text-gray-500 group-hover:text-purple-400" />
          <span>{link.label}</span>
          {link.isNew && (
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};

export default PremiumNavItems;
