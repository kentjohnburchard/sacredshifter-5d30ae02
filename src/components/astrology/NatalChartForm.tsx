
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, User, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BirthData } from "@/utils/astro.types";

const natalChartSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter your full name.",
  }),
  birthDate: z.date({
    required_error: "Please select your birth date.",
  }),
  birthTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  birthLocation: z.string().min(2, {
    message: "Birth place must be at least 2 characters.",
  }),
});

type NatalChartFormValues = z.infer<typeof natalChartSchema>;

interface NatalChartFormProps {
  onSubmit: (data: BirthData) => void;
  isSubmitting?: boolean;
}

export const NatalChartForm: React.FC<NatalChartFormProps> = ({ 
  onSubmit,
  isSubmitting = false
}) => {
  const { user } = useAuth();
  const [showDescription, setShowDescription] = useState(false);
  
  const form = useForm<NatalChartFormValues>({
    resolver: zodResolver(natalChartSchema),
    defaultValues: {
      name: "",
      birthTime: "",
      birthLocation: "",
    },
  });
  
  const handleSubmit = (data: NatalChartFormValues) => {
    const formattedData: BirthData = {
      name: data.name,
      birthDate: format(data.birthDate, "yyyy-MM-dd"),
      birthTime: data.birthTime,
      birthLocation: data.birthLocation,
      userId: user?.id
    };
    
    onSubmit(formattedData);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="relative z-10"
    >
      <motion.div 
        variants={item}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Generate Your Cosmic Blueprint
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Enter your birth details to discover your unique cosmic signature
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowDescription(!showDescription)}
          className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm"
        >
          {showDescription ? "Hide Details" : "Why We Need This Info"}
        </Button>
        
        {showDescription && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg mt-2 text-sm text-left"
          >
            <p className="mb-2">
              Your exact birth information allows us to calculate your precise astrological chart:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Birth date determines your sun sign and planetary positions</li>
              <li>Birth time is essential for calculating your rising sign and house placements</li>
              <li>Birth location affects the angles of your chart based on geographic coordinates</li>
            </ul>
            <p className="mt-2 text-indigo-600 dark:text-indigo-400 font-medium">
              This data is used solely for astrological calculations and is stored securely in your profile.
            </p>
          </motion.div>
        )}
      </motion.div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Enter your full name" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your name as it appears on your birth certificate.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={item}>
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birth Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your exact birth date for precise calculations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div variants={item}>
              <FormField
                control={form.control}
                name="birthTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Time (24h format)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="HH:MM" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Accurate time ensures correct rising sign calculation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>
          
          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="birthLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="City, Country" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Where you were born (city and country).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div variants={item}>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 group relative overflow-hidden"
              disabled={isSubmitting}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {isSubmitting ? "Consulting the Stars..." : "Ascend My Blueprint"}
              </span>
              <span className="absolute inset-0 bg-white/20 blur-md transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Button>
          </motion.div>
        </form>
      </Form>
      
      {/* Animated particles background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute rounded-full bg-purple-200 dark:bg-purple-600"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [Math.random() * 10, Math.random() * -10],
              x: [Math.random() * 10, Math.random() * -10],
              scale: [1, Math.random() * 0.5 + 0.8, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 5 + 3,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
