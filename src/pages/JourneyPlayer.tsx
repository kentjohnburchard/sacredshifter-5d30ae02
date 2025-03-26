
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import { healingFrequencies, HealingFrequency } from "@/data/frequencies";
import { getTemplateByFrequency, JourneyTemplate } from "@/data/journeyTemplates";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const JourneyPlayer = () => {
  const { frequencyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [frequency, setFrequency] = useState<HealingFrequency | null>(null);
  const [template, setTemplate] = useState<JourneyTemplate | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [journalDialogOpen, setJournalDialogOpen] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");

  useEffect(() => {
    if (!frequencyId) {
      navigate("/journey-templates");
      return;
    }

    const frequencyValue = parseFloat(frequencyId);
    const foundFrequency = healingFrequencies.find(f => f.frequency === frequencyValue);
    
    if (!foundFrequency) {
      toast.error("Frequency not found");
      navigate("/journey-templates");
      return;
    }

    setFrequency(foundFrequency);
    
    const matchingTemplate = getTemplateByFrequency(frequencyValue);
    if (matchingTemplate) {
      setTemplate(matchingTemplate);
    }
    
    setLoading(false);
    createSession(foundFrequency);
  }, [frequencyId, navigate]);

  const createSession = async (frequency: HealingFrequency) => {
    if (!user) return;
    
    try {
      // Create a new session record
      const { data, error } = await supabase
        .from('sessions')
        .insert([
          {
            user_id: user.id,
            frequency: frequency.frequency,
            chakra: frequency.chakra || null,
            intention: template?.affirmation || null,
          }
        ])
        .select();

      if (error) {
        console.error("Error creating session:", error);
        return;
      }

      if (data && data.length > 0) {
        setSessionId(data[0].id);
        console.log("Created session:", data[0].id);
      }
    } catch (err) {
      console.error("Unexpected error creating session:", err);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenJournal = () => {
    setJournalDialogOpen(true);
  };

  const handleSaveJournal = async () => {
    if (!sessionId || !journalEntry.trim()) {
      setJournalDialogOpen(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert([
          {
            user_id: user?.id,
            session_id: sessionId,
            content: journalEntry,
            timestamp: new Date().toISOString()
          }
        ]);

      if (error) {
        toast.error("Failed to save journal entry");
        console.error("Error saving journal entry:", error);
      } else {
        toast.success("Journal entry saved");
        setJournalDialogOpen(false);
      }
    } catch (err) {
      console.error("Unexpected error saving journal entry:", err);
      toast.error("An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading journey...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!frequency || !template) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-medium text-gray-800 mb-4">Journey Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find the journey you're looking for.
            </p>
            <Button onClick={() => navigate("/journey-templates")}>
              Browse Journeys
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBack}
            className="text-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-2">
              <span className="text-4xl mr-2">{template.emoji}</span>
              <h1 className="text-3xl font-light">
                <span className={`font-medium bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-purple-500`}>
                  {template.name}
                </span>
              </h1>
            </div>
            <p className="text-lg text-gray-600">{template.vibe}</p>
          </div>

          <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-center text-purple-800 italic">"{template.affirmation}"</p>
                </div>
                
                <div className="flex justify-center">
                  <div className="inline-flex items-center text-gray-600 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{frequency.duration ? Math.floor(frequency.duration / 60) : 5} minute journey</span>
                  </div>
                </div>
                
                {frequency && (
                  <FrequencyPlayer frequency={frequency} />
                )}
                
                <div className="pt-4">
                  <Button 
                    variant="outline"
                    className="w-full border-purple-200 text-purple-800 hover:bg-purple-50"
                    onClick={handleOpenJournal}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Journal My Experience
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-medium text-gray-800">About {frequency.frequency}Hz</h2>
            <p className="text-gray-600">{frequency.description}</p>
            
            {frequency.benefits && frequency.benefits.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Benefits</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {frequency.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={journalDialogOpen} onOpenChange={setJournalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Journal My Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              placeholder="Reflect on your experience with this frequency..."
              className="min-h-[200px]"
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                className="bg-brand-purple hover:bg-purple-700 text-white"
                onClick={handleSaveJournal}
              >
                Save Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default JourneyPlayer;
