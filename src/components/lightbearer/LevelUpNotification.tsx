
import React from 'react';
import { toast } from 'sonner';
import { LightbearerLevel } from '@/types/lightbearer';
import { Star } from 'lucide-react';

interface LevelUpNotificationProps {
  level: LightbearerLevel;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({ level }) => {
  return (
    <div className="flex items-center space-x-3 min-w-[300px] py-2">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
        <Star className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold">Level Up!</h4>
        <p className="text-xs opacity-80">You are now a {level.title}</p>
      </div>
    </div>
  );
};

export const showLevelUpNotification = (level: LightbearerLevel) => {
  toast.custom((id) => (
    <LevelUpNotification level={level} />
  ), {
    duration: 5000,
    position: 'top-center',
  });
};

export default LevelUpNotification;
