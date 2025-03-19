
import React from "react";
import { Music2 } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 flex justify-center items-center animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-accent/10">
          <Music2 className="h-6 w-6 text-accent" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight">
          <span className="font-light">Music</span>
          <span className="font-semibold">Magic</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
