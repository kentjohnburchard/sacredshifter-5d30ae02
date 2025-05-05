
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Table, Shield } from 'lucide-react';

const DatabaseBrowser: React.FC = () => {
  return (
    <PageLayout title="Database Browser">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Database Browser
            </span>
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            Browse and manage database tables and records
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Database Tables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse and query database tables with an easy-to-use interface.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Table className="h-5 w-5 text-purple-600" />
                Record Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View and edit database records with validation and backup capabilities.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage database security policies and access controls.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The Database Browser module is currently under development. This powerful tool will allow you to:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground">
              <li>Browse all database tables</li>
              <li>Create and edit records</li>
              <li>Run custom queries</li>
              <li>Import and export data</li>
              <li>Manage database permissions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DatabaseBrowser;
