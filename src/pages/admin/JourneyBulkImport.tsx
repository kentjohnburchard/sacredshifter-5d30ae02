
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Upload, ArrowLeft, FileText, Check, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bulkImportJourneys, parseJourneyMarkdown } from '@/services/journeyService';
import { addJourneyParams } from '@/hooks/useSpiralParams';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const JourneyBulkImport: React.FC = () => {
  const navigate = useNavigate();
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState<{
    successCount: number;
    errors: string[];
    importedJourneys: string[];
  } | null>(null);
  const [batchContent, setBatchContent] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('single');

  const handleParseMd = () => {
    try {
      const parsed = parseJourneyMarkdown(markdownContent);
      toast.success('Markdown parsed successfully');
      console.log('Parsed data:', parsed);
    } catch (error) {
      toast.error('Failed to parse markdown');
      console.error(error);
    }
  };

  const handleSingleImport = async () => {
    if (!markdownContent.trim()) {
      toast.error('Please enter markdown content');
      return;
    }

    setIsImporting(true);
    try {
      const parsed = parseJourneyMarkdown(markdownContent);
      const importResults = await bulkImportJourneys([markdownContent]);
      
      // Register spiral params if they exist
      if (parsed.spiralParams && importResults.successCount > 0) {
        // Generate filename from title
        const filename = parsed.title.toLowerCase().replace(/\s+/g, '-');
        addJourneyParams(filename, parsed.spiralParams);
      }
      
      setResults({
        successCount: importResults.successCount,
        errors: importResults.errors,
        importedJourneys: importResults.successCount > 0 ? [parsed.title] : []
      });
      
      toast.success(`Imported ${importResults.successCount} journey`);
    } catch (error) {
      toast.error(`Import failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleAddToBatch = () => {
    if (!markdownContent.trim()) {
      toast.error('Please enter markdown content');
      return;
    }

    try {
      const parsed = parseJourneyMarkdown(markdownContent);
      if (parsed.title) {
        setBatchContent(prev => [...prev, markdownContent]);
        setMarkdownContent('');
        toast.success(`Added "${parsed.title}" to batch`);
      } else {
        toast.error('Invalid markdown format. Title is required.');
      }
    } catch (error) {
      toast.error(`Failed to add to batch: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleBatchImport = async () => {
    if (batchContent.length === 0) {
      toast.error('Batch is empty');
      return;
    }

    setIsImporting(true);
    try {
      const importResults = await bulkImportJourneys(batchContent);
      
      // Handle spiral params registration
      const importedJourneys = batchContent.map(content => {
        const parsed = parseJourneyMarkdown(content);
        if (parsed.spiralParams) {
          // Generate filename from title
          const filename = parsed.title.toLowerCase().replace(/\s+/g, '-');
          addJourneyParams(filename, parsed.spiralParams);
        }
        return parsed.title;
      });
      
      setResults({
        successCount: importResults.successCount,
        errors: importResults.errors,
        importedJourneys: importedJourneys
      });
      
      if (importResults.successCount > 0) {
        toast.success(`Successfully imported ${importResults.successCount} journeys`);
        setBatchContent([]);
      }
      
      if (importResults.errors.length > 0) {
        toast.error(`${importResults.errors.length} journeys failed to import`);
      }
    } catch (error) {
      toast.error(`Batch import failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <PageLayout title="Journey Bulk Import">
      <div className="container mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Journey Bulk Import</h1>
          <Button variant="outline" onClick={() => navigate('/admin/journey-content')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journey Content Admin
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="single" className="flex-1">Single Import</TabsTrigger>
            <TabsTrigger value="batch" className="flex-1">Batch Import ({batchContent.length})</TabsTrigger>
            {results && <TabsTrigger value="results" className="flex-1">Results</TabsTrigger>}
          </TabsList>

          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>Import Journey from Markdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Paste your journey markdown content below. The system will extract the title, tags,
                      veil lock status, and content. It will also extract and register the spiral parameters 
                      if they are provided in a script tag.
                    </p>

                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs mb-4 font-mono overflow-auto">
                      <pre>
{`---
title: Journey Title
tags: [tag1, tag2]
veil: false
---
<script>
  window.journeyParams = {
    coeffA: 4,
    coeffB: 4,
    coeffC: 1.3,
    freqA: 44,
    freqB: -17,
    freqC: -54
  };
</script>

# Journey Title

## Intent:
Your content here...`}
                      </pre>
                    </div>

                    <Textarea 
                      value={markdownContent}
                      onChange={(e) => setMarkdownContent(e.target.value)}
                      placeholder="Paste your markdown here..."
                      className="min-h-[300px] font-mono"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleParseMd}>
                    <FileText className="mr-2 h-4 w-4" />
                    Parse and Check
                  </Button>
                  <Button variant="outline" onClick={handleAddToBatch}>
                    <Upload className="mr-2 h-4 w-4" />
                    Add to Batch
                  </Button>
                </div>
                <Button 
                  onClick={handleSingleImport} 
                  disabled={isImporting || !markdownContent.trim()}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      Import Journey
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="batch">
            <Card>
              <CardHeader>
                <CardTitle>Batch Import ({batchContent.length} Journeys)</CardTitle>
              </CardHeader>
              <CardContent>
                {batchContent.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No journeys added to batch yet.</p>
                    <p className="text-sm mt-2">Switch to the "Single Import" tab to add journeys.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {batchContent.map((content, index) => {
                      const parsed = parseJourneyMarkdown(content);
                      return (
                        <div 
                          key={index} 
                          className="p-3 border rounded-md flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{parsed.title || `Journey ${index + 1}`}</p>
                            {parsed.tags && <p className="text-xs text-gray-500">Tags: {parsed.tags}</p>}
                            <p className="text-xs text-gray-500">
                              Veil: {parsed.veilLocked ? 'Locked' : 'Unlocked'} | 
                              Spiral Params: {parsed.spiralParams ? 'Yes' : 'No'}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setBatchContent(prev => prev.filter((_, i) => i !== index));
                              toast.success('Removed from batch');
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-end">
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setBatchContent([]);
                      toast.success('Batch cleared');
                    }}
                    disabled={batchContent.length === 0}
                  >
                    Clear Batch
                  </Button>
                  <Button 
                    onClick={handleBatchImport}
                    disabled={isImporting || batchContent.length === 0}
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing Batch...
                      </>
                    ) : (
                      <>Import {batchContent.length} Journeys</>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Import Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert variant={results.successCount > 0 ? "default" : "destructive"}>
                      <Check className="h-4 w-4" />
                      <AlertTitle>Import Completed</AlertTitle>
                      <AlertDescription>
                        Successfully imported {results.successCount} journey(s).
                        {results.errors.length > 0 && ` ${results.errors.length} failed.`}
                      </AlertDescription>
                    </Alert>

                    {results.importedJourneys.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Imported Journeys:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {results.importedJourneys.map((title, i) => (
                            <li key={i} className="text-sm">{title}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {results.errors.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2 text-red-500">Errors:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {results.errors.map((error, i) => (
                            <li key={i} className="text-sm text-red-500">{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => navigate('/journey-templates')}>
                      View Journeys
                    </Button>
                    <Button onClick={() => setActiveTab('single')}>
                      Import Another
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default JourneyBulkImport;
