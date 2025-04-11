
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AudioMapping {
  id: string;
  journey_template_id: string;
  audio_file_name: string;
  audio_url: string | null;
  is_primary: boolean;
  created_at: string;
}

interface JourneyTemplate {
  id: string;
  title: string;
}

const JourneyAudioMappingsViewer: React.FC = () => {
  const [mappings, setMappings] = useState<AudioMapping[]>([]);
  const [templates, setTemplates] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        setLoading(true);
        
        // Fetch all journey templates for reference
        const { data: templatesData, error: templatesError } = await supabase
          .from('journey_templates')
          .select('id, title');
          
        if (templatesError) throw templatesError;
        
        // Create a lookup object for templates
        const templatesLookup: Record<string, string> = {};
        if (templatesData) {
          templatesData.forEach((template: JourneyTemplate) => {
            templatesLookup[template.id] = template.title;
          });
        }
        setTemplates(templatesLookup);
        
        // Fetch all audio mappings
        const { data: mappingsData, error: mappingsError } = await supabase
          .from('journey_template_audio_mappings')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (mappingsError) throw mappingsError;
        
        if (mappingsData) {
          setMappings(mappingsData);
          console.log('Found', mappingsData.length, 'audio mappings');
        }
      } catch (error) {
        console.error('Error fetching audio mappings:', error);
        toast.error('Failed to load audio mappings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMappings();
  }, []);

  return (
    <Layout pageTitle="Journey Audio Mappings">
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Journey Audio Mappings Explorer</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : mappings.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">Found {mappings.length} audio mappings</p>
                
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="text-left p-2">Journey Template</th>
                      <th className="text-left p-2">Audio File</th>
                      <th className="text-left p-2">Is Primary</th>
                      <th className="text-left p-2">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappings.map((mapping) => (
                      <tr key={mapping.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="p-2">
                          <span className="font-medium">{templates[mapping.journey_template_id] || 'Unknown Journey'}</span>
                          <br />
                          <span className="text-xs text-gray-500">{mapping.journey_template_id}</span>
                        </td>
                        <td className="p-2 font-mono text-sm">
                          {mapping.audio_file_name}
                          {mapping.audio_url && (
                            <div className="mt-1">
                              <a 
                                href={mapping.audio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 truncate block"
                              >
                                {mapping.audio_url}
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="p-2">
                          {mapping.is_primary ? (
                            <span className="text-green-600 dark:text-green-400 font-medium">Yes</span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </td>
                        <td className="p-2 text-sm">
                          {new Date(mapping.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No audio mappings found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JourneyAudioMappingsViewer;
