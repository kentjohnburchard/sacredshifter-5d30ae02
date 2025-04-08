
import React, { useEffect, useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { ToggleLeft, ToggleRight, Sparkles, Palette, Droplet } from "lucide-react";
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { toast } from "sonner";
import { useTheme } from '@/context/ThemeContext';
import { themeOptions, elementOptions, zodiacSigns, watermarkOptions } from '@/utils/customizationOptions';
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const VibeCustomizer = () => {
  const { preferences, saveUserPreferences, loading } = useUserPreferences();
  const { liftTheVeil, setLiftTheVeil } = useTheme();
  const [saving, setSaving] = useState(false);
  
  const form = useForm({
    defaultValues: {
      theme_gradient: preferences?.theme_gradient || "linear-gradient(to right, #4facfe, #00f2fe)",
      element: preferences?.element || "water",
      zodiac_sign: preferences?.zodiac_sign || "cancer",
      watermark_style: preferences?.watermark_style || "zodiac",
      consciousness_mode: preferences?.consciousness_mode || "standard"
    }
  });

  useEffect(() => {
    if (preferences) {
      form.reset({
        theme_gradient: preferences.theme_gradient,
        element: preferences.element,
        zodiac_sign: preferences.zodiac_sign,
        watermark_style: preferences.watermark_style,
        consciousness_mode: preferences.consciousness_mode || "standard"
      });
    }
  }, [preferences, form]);

  const handleLiftTheVeilChange = async (checked: boolean) => {
    try {
      setLiftTheVeil(checked);
      
      await saveUserPreferences({
        ...preferences,
        consciousness_mode: checked ? "lift-the-veil" : "standard",
      });
      
      toast.success(
        checked 
          ? "Lift the Veil mode activated. Seeing beyond the ordinary." 
          : "Standard mode activated. Back to normal perception.",
        {
          icon: checked 
            ? <Sparkles className="h-4 w-4 text-brand-aurapink" /> 
            : <Sparkles className="h-4 w-4 text-gray-400" />,
        }
      );
    } catch (error) {
      console.error("Failed to update consciousness mode:", error);
      toast.error("Failed to update your vibe settings");
      
      setLiftTheVeil(!checked);
    }
  };

  useEffect(() => {
    if (preferences?.consciousness_mode) {
      const isLiftTheVeil = preferences.consciousness_mode === "lift-the-veil";
      if (liftTheVeil !== isLiftTheVeil) {
        setLiftTheVeil(isLiftTheVeil);
      }
    }
  }, [preferences, setLiftTheVeil, liftTheVeil]);

  const onSubmit = async (data: any) => {
    if (loading) return;
    
    setSaving(true);
    try {
      // Apply theme changes immediately for better user experience
      form.reset(data);
      
      await saveUserPreferences({
        ...preferences,
        ...data
      });
      
      toast.success("Your vibe preferences have been saved!", {
        icon: <Palette className="h-4 w-4 text-blue-500" />,
      });
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save your vibe settings");
    } finally {
      setSaving(false);
    }
  };

  // Handle real-time preview of theme changes
  const handleThemePreview = (themeValue: string) => {
    form.setValue("theme_gradient", themeValue);
  };

  // Handle real-time preview of element changes
  const handleElementPreview = (elementValue: string) => {
    form.setValue("element", elementValue);
  };

  // Handle real-time preview of watermark style changes
  const handleWatermarkPreview = (watermarkValue: string) => {
    form.setValue("watermark_style", watermarkValue);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border border-purple-100 rounded-lg bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-medium">Lift the Veil</h3>
            <p className="text-sm text-gray-500">
              {liftTheVeil ? "Lift the Veil: Show your true self" : "Standard Mode: Hide your true self"}
              <span className="ml-1 text-xs text-amber-500">(Saved to your profile)</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={liftTheVeil} 
              onCheckedChange={handleLiftTheVeilChange} 
              className={liftTheVeil ? "bg-brand-aurapink" : ""}
              disabled={loading || saving}
            />
            {liftTheVeil ? 
              <ToggleRight className="h-4 w-4 text-brand-aurapink" /> : 
              <ToggleLeft className="h-4 w-4 text-gray-400" />
            }
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-4 border border-purple-100 rounded-lg bg-white">
            <h3 className="text-md font-medium mb-4">Theme Gradient</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {themeOptions.map((theme) => (
                <FormField
                  key={theme.name}
                  control={form.control}
                  name="theme_gradient"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <input
                          type="radio"
                          className="sr-only"
                          checked={field.value === theme.gradient}
                          onChange={() => {
                            field.onChange(theme.gradient);
                            handleThemePreview(theme.gradient);
                          }}
                        />
                      </FormControl>
                      <div 
                        className={`h-10 w-full rounded-md cursor-pointer transition-all ${field.value === theme.gradient ? 'ring-2 ring-purple-500' : 'hover:ring-1 hover:ring-purple-200'}`}
                        style={{ background: theme.gradient }}
                        onClick={() => {
                          field.onChange(theme.gradient);
                          handleThemePreview(theme.gradient);
                        }}
                      />
                      <FormLabel className="cursor-pointer text-sm">{theme.name}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="p-4 border border-purple-100 rounded-lg bg-white">
            <h3 className="text-md font-medium mb-4">Elemental Resonance</h3>
            <FormField
              control={form.control}
              name="element"
              render={({ field }) => (
                <RadioGroup 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleElementPreview(value);
                  }} 
                  defaultValue={field.value}
                  value={field.value}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {elementOptions.map((element) => (
                    <FormItem key={element.id}>
                      <FormControl>
                        <RadioGroupItem
                          value={element.id}
                          id={`element-${element.id}`}
                          className="sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor={`element-${element.id}`}
                        className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all ${
                          field.value === element.id ? 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200' : 'bg-white border border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <element.icon className="h-8 w-8 mb-2" style={{ color: element.color }} />
                        <span className="font-medium text-sm">{element.name}</span>
                        <span className="text-xs text-gray-500">{element.description}</span>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <div className="p-4 border border-purple-100 rounded-lg bg-white">
            <h3 className="text-md font-medium mb-4">Zodiac Alignment</h3>
            <FormField
              control={form.control}
              name="zodiac_sign"
              render={({ field }) => (
                <select 
                  className="w-full p-2 border border-gray-200 rounded-md"
                  value={field.value} 
                  onChange={field.onChange}
                >
                  {zodiacSigns.map((sign) => (
                    <option key={sign.id} value={sign.id}>
                      {sign.name} ({sign.symbol}) - {sign.element} element
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className="p-4 border border-purple-100 rounded-lg bg-white">
            <h3 className="text-md font-medium mb-4">Watermark Style</h3>
            <FormField
              control={form.control}
              name="watermark_style"
              render={({ field }) => (
                <RadioGroup 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleWatermarkPreview(value);
                  }} 
                  defaultValue={field.value}
                  value={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  {watermarkOptions.map((option) => (
                    <FormItem key={option.id}>
                      <FormControl>
                        <RadioGroupItem
                          value={option.id}
                          id={`watermark-${option.id}`}
                          className="sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor={`watermark-${option.id}`}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                          field.value === option.id ? 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200' : 'bg-white border border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <option.icon className="h-5 w-5 mr-3 text-purple-500" />
                        <div>
                          <div className="font-medium text-sm">{option.name}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <button
            type="submit"
            disabled={loading || saving}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save All Preferences'}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default VibeCustomizer;
