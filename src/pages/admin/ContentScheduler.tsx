
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, FileText, Calendar as CalendarIcon } from 'lucide-react';

const ContentScheduler: React.FC = () => {
  return (
    <PageLayout title="Content Scheduler">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Content Scheduler
            </span>
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            Schedule content publication and manage release timelines
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            New Schedule
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                  Content Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-md p-6">
                  <div className="text-center">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Calendar View Coming Soon</h3>
                    <p className="text-muted-foreground mt-2">
                      This feature is currently under development. You'll soon be able to view and manage all scheduled content in a calendar view.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Upcoming Releases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Heart Chakra Journey</h4>
                      <Badge variant="outline">Journey</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Scheduled for: May 15, 2025
                    </p>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Celestial Frequencies</h4>
                      <Badge variant="outline">Audio</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Scheduled for: May 22, 2025
                    </p>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Summer Solstice Special</h4>
                      <Badge variant="outline">Bundle</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Scheduled for: June 21, 2025
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" /> Scheduler Guide
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Use the calendar to view all scheduled content releases</li>
            <li>Click on a date to see details or add new scheduled items</li>
            <li>The "Upcoming Releases" panel shows the next scheduled items</li>
            <li>Use "New Schedule" to create a new scheduled release</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContentScheduler;

// Import missing Badge component to fix error
import { Badge } from '@/components/ui/badge';
