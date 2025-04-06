
import React, { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useTheme } from '@/context/ThemeContext';
import { 
  themeOptions, 
  watermarkOptions, 
  elementOptions, 
  zodiacSigns,
  soundscapeOptions,
  ThemeOption
} from '@/utils/customizationOptions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Palette, 
  Star, 
  ZoomIn, 
  Check, 
  Sparkles, 
  Volume2, 
  Wand2, 
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getRandomQuote } from "@/utils/customizationOptions";

const VibeCustomizer: React.FC = () => {
  const { user } = useAuth();
  const { preferences, setPreferences, saveUserPreferences, loading } = useUserPreferences();
  const { kentMode, setKentMode, refreshQuote } = useTheme();
  const [customGradient, setCustomGradient] = useState("");
  const [activeTab, setActiveTab] = useState("theme");
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption | null>(null);

  useEffect(() => {
    if (preferences.theme_gradient) {
      // Try to find a matching theme
      const matchedTheme = themeOptions.find(t => t.gradient === preferences.theme_gradient);
      if (matchedTheme) {
        setSelectedTheme(matchedTheme);
      } else {
        // If no match, it's a custom theme
        setSelectedTheme(themeOptions[themeOptions.length - 1]); // Custom theme
        setCustomGradient(preferences.theme_gradient);
      }
    }
  }, [preferences]);

  const handleThemeChange = (themeName: string) => {
    const theme = themeOptions.find(t => t.name === themeName) || themeOptions[0];
    setSelectedTheme(theme);

    // If selecting an element-based theme, update the element as well
    if (theme.element) {
      setPreferences({
        ...preferences,
        element: theme.element,
        theme_gradient: theme.gradient
      });
    } else {
      setPreferences({
        ...preferences,
        theme_gradient: theme.name === "Custom" ? customGradient : theme.gradient
      });
    }
  };

  const handleElementChange = (elementId: string) => {
    const element = elementOptions.find(e => e.id === elementId);
    if (element) {
      setPreferences({
        ...preferences,
        element: elementId,
        soundscapeMode: element.soundEffect || "bubbles"
      });
    }
  };

  const handleZodiacChange = (signId: string) => {
    const sign = zodiacSigns.find(s => s.id === signId);
    if (sign) {
      const elementId = sign.element;
      const element = elementOptions.find(e => e.id === elementId);
      
      setPreferences({
        ...preferences,
        zodiac_sign: signId,
        element: elementId,
        soundscapeMode: element?.soundEffect || "bubbles"
      });
    }
  };

  const handleCustomGradientChange = (value: string) => {
    setCustomGradient(value);
    if (selectedTheme?.name === "Custom") {
      setPreferences({
        ...preferences,
        theme_gradient: value
      });
    }
  };

  const handleWatermarkChange = (styleId: string) => {
    setPreferences({
      ...preferences,
      watermark_style: styleId
    });
  };

  const handleSoundscapeChange = (mode: string) => {
    setPreferences({
      ...preferences,
      soundscapeMode: mode
    });
  };

  const handleKentModeChange = (checked: boolean) => {
    setKentMode(checked);
    setPreferences({
      ...preferences,
      kent_mode: checked // Fixed property name to match database schema
    });
    refreshQuote();
  };

  const randomizeVibe = () => {
    // Generate random selections
    const randomTheme = themeOptions[Math.floor(Math.random() * (themeOptions.length - 1))]; // Exclude custom
    const randomWatermark = watermarkOptions[Math.floor(Math.random() * watermarkOptions.length)];
    const randomSign = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
    const elementForSign = elementOptions.find(e => e.id === randomSign.element);
    const randomSoundscape = soundscapeOptions[Math.floor(Math.random() * soundscapeOptions.length)];
    
    // Update preferences
    setSelectedTheme(randomTheme);
    
    setPreferences({
      ...preferences,
      theme_gradient: randomTheme.gradient,
      element: elementForSign?.id || "water",
      zodiac_sign: randomSign.id,
      watermark_style: randomWatermark.id,
      soundscapeMode: randomSoundscape.id
    });
    
    toast.success("Your vibe has been cosmically randomized!", {
      icon: <Wand2 className="text-purple-500" />
    });
  };

  const handleSave = async () => {
    // Make sure to save the correct gradient if using custom
    const updatedPreferences = {
      ...preferences,
      theme_gradient: selectedTheme?.name === "Custom" ? customGradient : preferences.theme_gradient
    };
    
    await saveUserPreferences(updatedPreferences);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-400" />
          <p className="text-gray-600 dark:text-gray-300">Loading your cosmic preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-light">
          <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            Personal Vibe Customizer
          </span>
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Align your Sacred Shifter experience with your personal energy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left side: Preview and Controls */}
        <div className="col-span-2">
          <div className="sticky top-10">
            <h3 className="text-lg font-medium mb-3">Your Vibe Preview</h3>
            
            {/* Preview card */}
            <Card className="overflow-hidden shadow-lg border border-purple-100">
              <div 
                className="h-56 relative flex items-center justify-center"
                style={{ background: preferences.theme_gradient || themeOptions[0].gradient }}
              >
                {/* Watermark preview */}
                {preferences.watermark_style !== "none" && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {preferences.watermark_style === "zodiac" && (
                      <div className="text-7xl text-white">
                        {zodiacSigns.find(z => z.id === preferences.zodiac_sign)?.symbol || "♋"}
                      </div>
                    )}
                    {preferences.watermark_style === "sacred_geometry" && (
                      <Sparkles className="h-32 w-32 text-white" />
                    )}
                    {preferences.watermark_style === "planets" && (
                      <div className="rounded-full h-32 w-32 border-4 border-white/50" />
                    )}
                    {preferences.watermark_style === "crystals" && (
                      <div className="h-32 w-32 rotate-45 border-4 border-white/50" />
                    )}
                    {preferences.watermark_style === "chakras" && (
                      <div className="h-32 w-32 rounded-full border-4 border-white/50 flex items-center justify-center">
                        <div className="h-24 w-24 rounded-full border-2 border-white/50" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Element icon */}
                <div className="z-10 bg-white/90 p-4 rounded-full shadow-lg">
                  {elementOptions.find(e => e.id === preferences.element)?.icon && 
                    React.createElement(
                      elementOptions.find(e => e.id === preferences.element)?.icon || Star, 
                      { className: "h-8 w-8", color: elementOptions.find(e => e.id === preferences.element)?.color }
                    )
                  }
                </div>
              </div>
              
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Your Cosmic Profile</h3>
                    <p className="text-sm text-gray-600">
                      {zodiacSigns.find(z => z.id === preferences.zodiac_sign)?.name || "Cancer"} · 
                      {elementOptions.find(e => e.id === preferences.element)?.name || "Water"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="p-1 rounded-full bg-gray-100">
                      <Volume2 className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="p-1 rounded-full bg-gray-100">
                      <ZoomIn className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quote Preview */}
            <Card className="mt-4 p-4 border border-purple-100">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Current Quote</p>
                <p className="italic text-gray-700">
                  "{getRandomQuote(kentMode)}"
                </p>
              </div>
            </Card>
            
            {/* Action buttons */}
            <div className="mt-4 space-y-2">
              <Button 
                onClick={randomizeVibe}
                className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white"
              >
                <Wand2 className="mr-2 h-4 w-4" /> Shift My Vibe
              </Button>
              
              <Button 
                onClick={handleSave} 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              >
                <Check className="mr-2 h-4 w-4" /> Save My Cosmic Settings
              </Button>
            </div>

            {/* Kent Mode Toggle */}
            <div className="mt-6 p-4 border border-purple-100 rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium">Consciousness Mode</h3>
                  <p className="text-sm text-gray-500">
                    {kentMode ? "Kent Mode: Cosmic sass activated" : "Standard Mode: Peaceful wisdom"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={kentMode} 
                    onCheckedChange={handleKentModeChange} 
                    className={kentMode ? "bg-brand-aurapink" : ""}
                  />
                  {kentMode ? 
                    <ToggleRight className="h-4 w-4 text-brand-aurapink" /> : 
                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side: Settings */}
        <div className="col-span-3">
          <Tabs
            defaultValue="theme"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="theme">
                <Palette className="mr-2 h-4 w-4" /> Theme
              </TabsTrigger>
              <TabsTrigger value="watermark">
                <Star className="mr-2 h-4 w-4" /> Watermark
              </TabsTrigger>
              <TabsTrigger value="cosmic">
                <Sparkles className="mr-2 h-4 w-4" /> Cosmic Profile
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="theme" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Theme Gradient</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {themeOptions.slice(0, -1).map((theme) => (
                    <div
                      key={theme.name}
                      className={`cursor-pointer rounded-lg h-24 flex items-center justify-center p-3 border-2 transition-all hover:scale-105 ${
                        selectedTheme?.name === theme.name 
                          ? "border-purple-500 shadow-md" 
                          : "border-transparent"
                      }`}
                      style={{ background: theme.gradient }}
                      onClick={() => handleThemeChange(theme.name)}
                    >
                      <span className="font-medium text-white text-sm text-center drop-shadow-md">
                        {theme.name}
                      </span>
                    </div>
                  ))}
                  
                  <div
                    className={`cursor-pointer rounded-lg h-24 bg-gray-50 flex items-center justify-center p-3 border-2 transition-all hover:scale-105 ${
                      selectedTheme?.name === "Custom" 
                        ? "border-purple-500 shadow-md" 
                        : "border-gray-200"
                    }`}
                    onClick={() => handleThemeChange("Custom")}
                  >
                    <span className="font-medium text-gray-600 text-sm text-center">
                      Custom
                    </span>
                  </div>
                </div>
                
                {selectedTheme?.name === "Custom" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Gradient CSS
                    </label>
                    <Input
                      placeholder="linear-gradient(to right, #123456, #654321)"
                      value={customGradient}
                      onChange={(e) => handleCustomGradientChange(e.target.value)}
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500">
                      Enter a valid CSS gradient (e.g., linear-gradient, radial-gradient)
                    </p>
                  </div>
                )}
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {selectedTheme?.description || "Select a theme to see its description"}
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-3">Element</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {elementOptions.map((element) => (
                    <div
                      key={element.id}
                      className={`cursor-pointer rounded-lg p-4 border transition-all hover:shadow-md ${
                        preferences.element === element.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleElementChange(element.id)}
                    >
                      <div className="flex flex-col items-center text-center">
                        {React.createElement(element.icon, {
                          className: "h-8 w-8 mb-2",
                          color: element.color,
                        })}
                        <span className="font-medium">{element.name}</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {element.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="watermark" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Watermark Style</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {watermarkOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`cursor-pointer rounded-lg p-4 border transition-all hover:shadow-md ${
                        preferences.watermark_style === option.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleWatermarkChange(option.id)}
                    >
                      <div className="flex flex-col items-center text-center">
                        {React.createElement(option.icon, {
                          className: "h-8 w-8 mb-2",
                          color: option.id === "none" ? "#9CA3AF" : "#8B5CF6",
                        })}
                        <span className="font-medium">{option.name}</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {option.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-3">Soundscape Mode</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {soundscapeOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`cursor-pointer rounded-lg p-4 border transition-all hover:shadow-md ${
                        preferences.soundscapeMode === option.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleSoundscapeChange(option.id)}
                    >
                      <div className="flex items-center">
                        <div className="bg-purple-100 rounded-full p-3 mr-3">
                          <Volume2 className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium block">{option.name}</span>
                          <span className="text-xs text-gray-500">
                            {option.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div
                    className={`cursor-pointer rounded-lg p-4 border transition-all hover:shadow-md ${
                      preferences.soundscapeMode === "none"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleSoundscapeChange("none")}
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-full p-3 mr-3">
                        <Volume2 className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <span className="font-medium block">No Soundscape</span>
                        <span className="text-xs text-gray-500">
                          Disable ambient sound effects
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cosmic" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Zodiac Sign</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {zodiacSigns.map((sign) => (
                    <div
                      key={sign.id}
                      className={`cursor-pointer rounded-lg p-3 border transition-all hover:shadow-md ${
                        preferences.zodiac_sign === sign.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleZodiacChange(sign.id)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <span className="text-2xl mb-1">{sign.symbol}</span>
                        <span className="font-medium text-sm">{sign.name}</span>
                        <span 
                          className="text-xs mt-1"
                          style={{
                            color: elementOptions.find(e => e.id === sign.element)?.color
                          }}
                        >
                          {sign.element.charAt(0).toUpperCase() + sign.element.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Your cosmic profile influences your recommended themes and elements.
                  Update your birth chart data in the Astrology section for more personalized recommendations.
                </p>
                
                {user ? (
                  <Button 
                    variant="outline"
                    onClick={() => toast.info("This feature will sync with your birth chart data")}
                    className="w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Sync with Birth Chart
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => toast.info("Please log in to use this feature")}
                    className="w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Log in to sync with Birth Chart
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VibeCustomizer;
