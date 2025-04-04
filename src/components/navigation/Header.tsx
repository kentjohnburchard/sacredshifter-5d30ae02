
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLink from "./NavLink";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#bf99ff]/5 backdrop-blur-sm border-b border-[#9966FF]/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/9a25249c-f163-4bea-bbbf-c23cea6614c3.png" 
              alt="Sacred Shifter Logo" 
              className="h-32 w-auto"
            />
          </Link>
          
          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/journeys">Journeys</NavLink>
            <NavLink to="/energy-check">Energy Check</NavLink>
            <NavLink to="/alignment">Alignment</NavLink>
            <NavLink to="/intentions">Intentions</NavLink>
            <NavLink to="/meditation">Meditation</NavLink>
            <NavLink to="/music-generation">Sound Creation</NavLink>
            <NavLink to="/hermetic-wisdom">Hermetic Wisdom</NavLink>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-[#7510c9]/70 hover:text-[#7510c9] focus:outline-none">
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavLink to="/journeys" isMobile>Journeys</NavLink>
                  <NavLink to="/energy-check" isMobile>Energy Check</NavLink>
                  <NavLink to="/alignment" isMobile>Alignment</NavLink>
                  <NavLink to="/intentions" isMobile>Intentions</NavLink>
                  <NavLink to="/meditation" isMobile>Meditation</NavLink>
                  <NavLink to="/music-generation" isMobile>Sound Creation</NavLink>
                  <NavLink to="/hermetic-wisdom" isMobile>Hermetic Wisdom</NavLink>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
