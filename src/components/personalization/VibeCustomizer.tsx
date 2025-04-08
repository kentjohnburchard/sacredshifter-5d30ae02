
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { ToggleLeft, ToggleRight } from "lucide-react";

const VibeCustomizer = () => {
  const [liftTheVeil, setLiftTheVeil] = useState(false);

  const handleLiftTheVeilChange = (checked: boolean) => {
    setLiftTheVeil(checked);
  };

  return (
    <>
      {/* Lift the Veil Toggle */}
      <div className="mt-6 p-4 border border-purple-100 rounded-lg bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-medium">Lift the Veil</h3>
            <p className="text-sm text-gray-500">
              {liftTheVeil ? "Lift the Veil: Show your true self" : "Standard Mode: Hide your true self"}
              <span className="ml-1 text-xs text-amber-500">(Session only)</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={liftTheVeil} 
              onCheckedChange={handleLiftTheVeilChange} 
              className={liftTheVeil ? "bg-brand-aurapink" : ""}
            />
            {liftTheVeil ? 
              <ToggleRight className="h-4 w-4 text-brand-aurapink" /> : 
              <ToggleLeft className="h-4 w-4 text-gray-400" />
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default VibeCustomizer;
