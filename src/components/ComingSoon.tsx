
import React from 'react';
import { Calendar, Hourglass } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  expectedDate: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description, expectedDate }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Hourglass className="h-16 w-16 text-indigo-400 animate-pulse mb-4" />
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300 max-w-md mb-6">{description}</p>
      <div className="flex items-center text-indigo-300">
        <Calendar className="h-5 w-5 mr-2" />
        <span>Expected: {expectedDate}</span>
      </div>
    </div>
  );
};

export default ComingSoon;
