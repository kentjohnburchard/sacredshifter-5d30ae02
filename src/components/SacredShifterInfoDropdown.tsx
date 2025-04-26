
import React from "react";
// Use custom router's useRoute and Link
import { useRoute, Link } from "@/lib/spa-router";
import { Info, HelpCircle, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "What", path: "/about/what", icon: Info },
  { label: "Why", path: "/about/why", icon: HelpCircle },
  { label: "How", path: "/about/how", icon: Code2 },
];

const SacredShifterInfoDropdown: React.FC = () => {
  const { path } = useRoute();
  const activeIndex = tabs.findIndex(tab => path === tab.path);

  // Simple show/hide for dropdown
  const [open, setOpen] = React.useState(false);

  const current = tabs[activeIndex] || tabs[0];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <button
          className="flex items-center gap-2 bg-[#1A1F2C] text-white font-medium px-5 py-2 rounded-xl border border-gray-700 shadow-md min-w-[110px]"
          onClick={() => setOpen(open => !open)}
        >
          <current.icon className="h-5 w-5 text-purple-400" />
          <span className="hidden sm:inline">{current.label}</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="absolute z-40 mt-2 w-full min-w-[170px] bg-[#181C24] border border-gray-700 rounded-xl shadow-xl">
            {tabs.map((tab, i) => (
              <Link
                to={tab.path}
                key={tab.path}
                className={cn(
                  "flex items-center w-full px-4 py-2 gap-2 text-left hover:bg-[#23283A] focus:bg-[#23283A] transition",
                  path === tab.path ? "bg-[#23283A] text-purple-300" : "text-gray-100"
                )}
                onClick={() => setOpen(false)}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SacredShifterInfoDropdown;
