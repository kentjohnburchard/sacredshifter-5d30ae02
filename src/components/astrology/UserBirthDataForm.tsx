
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const birthDataSchema = z.object({
  birthDate: z.date({
    required_error: "Please select your birth date.",
  }),
  birthTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  birthPlace: z.string().min(2, {
    message: "Birth place must be at least 2 characters.",
  }),
});

type BirthDataFormValues = z.infer<typeof birthDataSchema>;

interface UserBirthDataFormProps {
  onSubmitSuccess?: () => void;
}

export const UserBirthDataForm: React.FC<UserBirthDataFormProps> = ({ 
  onSubmitSuccess 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BirthDataFormValues>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      birthTime: "",
      birthPlace: "",
    },
  });
  
  const onSubmit = async (data: BirthDataFormValues) => {
    if (!user) {
      toast.error("You must be logged in to save your birth data");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert date to ISO string for storage
      const formattedDate = format(data.birthDate, "yyyy-MM-dd");
      
      const { error } = await supabase
        .from('user_astrology_data')
        .upsert({
          user_id: user.id,
          birth_date: formattedDate,
          birth_time: data.birthTime,
          birth_place: data.birthPlace,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success("Your birth data has been saved");
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error("Error saving birth data:", error);
      toast.error("Failed to save your birth data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Your birth date helps create your natal chart.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                  More accurate time leads to more precise insights.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="birthPlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Place</FormLabel>
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
                The location of your birth influences your astrological chart.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Birth Data"}
        </Button>
      </form>
    </Form>
  );
};
