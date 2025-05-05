
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Database, Table, Shield, Search, Layers, Clock, Filter, Download, Upload, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define table structure type
interface TableStructure {
  name: string;
  schema: string;
  rowCount: number;
  columnCount: number;
  hasRLS: boolean;
  lastModified?: string;
}

// Define table data type
interface TableData {
  [key: string]: any;
}

const DatabaseBrowser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tables, setTables] = useState<TableStructure[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [isLoadingTableData, setIsLoadingTableData] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [queryColumns, setQueryColumns] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'tables' | 'query' | 'security'>('tables');

  // Mock data for tables - would be replaced with real Supabase data
  const mockTables: TableStructure[] = [
    { name: 'profiles', schema: 'public', rowCount: 257, columnCount: 15, hasRLS: true, lastModified: '2025-05-04' },
    { name: 'journey_templates', schema: 'public', rowCount: 42, columnCount: 18, hasRLS: true, lastModified: '2025-05-03' },
    { name: 'frequency_library', schema: 'public', rowCount: 128, columnCount: 20, hasRLS: false, lastModified: '2025-05-02' },
    { name: 'user_preferences', schema: 'public', rowCount: 215, columnCount: 11, hasRLS: true, lastModified: '2025-05-01' },
    { name: 'sessions', schema: 'public', rowCount: 876, columnCount: 7, hasRLS: true, lastModified: '2025-05-01' },
    { name: 'user_intentions', schema: 'public', rowCount: 412, columnCount: 6, hasRLS: true, lastModified: '2025-04-30' },
    { name: 'timeline_snapshots', schema: 'public', rowCount: 342, columnCount: 11, hasRLS: true, lastModified: '2025-04-29' },
    { name: 'sacred_blueprints', schema: 'public', rowCount: 78, columnCount: 15, hasRLS: true, lastModified: '2025-04-28' },
    { name: 'journey_soundscapes', schema: 'public', rowCount: 65, columnCount: 9, hasRLS: false, lastModified: '2025-04-27' },
    { name: 'audio_function_mappings', schema: 'public', rowCount: 93, columnCount: 7, hasRLS: false, lastModified: '2025-04-26' },
  ];

  // Mock data for table columns - would be replaced with real Supabase data
  const mockColumns: { [key: string]: string[] } = {
    'profiles': ['id', 'display_name', 'full_name', 'bio', 'avatar_url', 'onboarding_completed', 'initial_mood', 'primary_intention', 'energy_level', 'interests', 'updated_at', 'lightbearer_level', 'ascension_title', 'soul_alignment', 'badges'],
    'journey_templates': ['id', 'title', 'description', 'purpose', 'visual_theme', 'vibe', 'chakras', 'session_type', 'duration', 'affirmation', 'guided_prompt', 'created_at', 'name', 'color', 'subtitle', 'vale_quote', 'emoji'],
    'frequency_library': ['id', 'title', 'frequency', 'audio_url', 'description', 'chakra', 'tags', 'category', 'created_at', 'updated_at', 'duration', 'principle', 'group_id', 'feature', 'type', 'length', 'session_type', 'affirmation', 'vibe_profile', 'url', 'visual_theme'],
    'user_preferences': ['id', 'user_id', 'theme_gradient', 'element', 'zodiac_sign', 'watermark_style', 'soundscape_mode', 'consciousness_mode', 'created_at', 'updated_at', 'kent_mode'],
    'sessions': ['id', 'user_id', 'created_at', 'updated_at', 'initial_mood', 'intention', 'frequency_id'],
  };

  // Mock data for table rows - would be replaced with real Supabase data
  const generateMockTableData = (tableName: string, count: number = 10): TableData[] => {
    const columns = mockColumns[tableName] || [];
    const results: TableData[] = [];
    
    for (let i = 0; i < count; i++) {
      const row: TableData = {};
      
      columns.forEach(column => {
        if (column === 'id') {
          row[column] = `${i + 1}`;
        } else if (column === 'created_at' || column === 'updated_at') {
          row[column] = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
        } else if (column === 'user_id') {
          row[column] = `user-${i + 1}`;
        } else if (column.includes('name')) {
          row[column] = `Example ${column.split('_').join(' ')} ${i + 1}`;
        } else if (column === 'email') {
          row[column] = `user${i + 1}@example.com`;
        } else if (column === 'frequency') {
          row[column] = (432 + i * 4.32).toFixed(2);
        } else if (column === 'duration') {
          row[column] = Math.floor(Math.random() * 600) + 120;
        } else {
          row[column] = `Value for ${column} ${i + 1}`;
        }
      });
      
      results.push(row);
    }
    
    return results;
  };

  useEffect(() => {
    // Simulate loading tables from Supabase
    const fetchTables = async () => {
      setIsLoadingTables(true);
      try {
        // Attempt to fetch real tables from Supabase
        // In a real implementation, you would use Supabase to fetch table information
        
        // For now, mock the data
        setTimeout(() => {
          setTables(mockTables);
          setIsLoadingTables(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching tables:', error);
        toast.error('Failed to load database tables');
        setIsLoadingTables(false);
      }
    };

    fetchTables();
  }, []);

  const handleSelectTable = async (tableName: string) => {
    setSelectedTable(tableName);
    setIsLoadingTableData(true);
    
    try {
      // In a real implementation, you would fetch table data from Supabase
      // const { data, error } = await supabase.from(tableName).select('*').limit(100);
      
      // For now, mock the data
      setTimeout(() => {
        const data = generateMockTableData(tableName, 20);
        const columns = mockColumns[tableName] || [];
        
        setTableData(data);
        setColumns(columns);
        setIsLoadingTableData(false);
      }, 500);
    } catch (error) {
      console.error(`Error fetching data for table ${tableName}:`, error);
      toast.error(`Failed to load data for table ${tableName}`);
      setIsLoadingTableData(false);
    }
  };

  const handleRunQuery = () => {
    setIsLoadingTableData(true);
    
    // In a real implementation, you would execute the query using Supabase
    // For now, simulate query execution
    setTimeout(() => {
      try {
        // Mock query results based on the query text
        const lowerQuery = currentQuery.toLowerCase();
        
        if (lowerQuery.includes('select') && lowerQuery.includes('from')) {
          // Extract table name from query (very simple parsing)
          const fromParts = lowerQuery.split('from');
          if (fromParts.length > 1) {
            const tablePart = fromParts[1].trim().split(' ')[0];
            const tableName = tablePart.replace(/[^a-zA-Z0-9_]/g, '');
            
            if (mockColumns[tableName]) {
              const results = generateMockTableData(tableName, 5);
              setQueryResults(results);
              setQueryColumns(mockColumns[tableName] || []);
              toast.success('Query executed successfully');
            } else {
              throw new Error(`Table ${tableName} not found`);
            }
          } else {
            throw new Error('Invalid query format');
          }
        } else {
          throw new Error('Only SELECT queries are supported in this interface');
        }
      } catch (error: any) {
        console.error('Error executing query:', error);
        toast.error(`Query error: ${error.message}`);
        setQueryResults([]);
        setQueryColumns([]);
      } finally {
        setIsLoadingTableData(false);
      }
    }, 800);
  };

  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    table.schema.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'tables' | 'query' | 'security')} className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <TabsList className="mb-0">
              <TabsTrigger value="tables" className="flex items-center gap-1">
                <Table className="h-4 w-4" />
                <span>Tables</span>
              </TabsTrigger>
              <TabsTrigger value="query" className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                <span>Query</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder={activeTab === 'tables' ? "Search tables..." : "Search policies..."}
                className="pl-8 pr-4 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="tables" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5 text-purple-600" />
                      Database Tables
                    </CardTitle>
                    <CardDescription>
                      {filteredTables.length} tables found
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoadingTables ? (
                      <div className="py-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                      </div>
                    ) : (
                      <div className="max-h-[500px] overflow-y-auto">
                        <ul className="divide-y">
                          {filteredTables.map((table) => (
                            <li key={table.name} className="px-4">
                              <button
                                className={`py-2 w-full text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 rounded ${selectedTable === table.name ? 'font-medium text-purple-600' : ''}`}
                                onClick={() => handleSelectTable(table.name)}
                              >
                                <div className="flex items-center">
                                  <Table className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{table.name}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {table.rowCount} rows
                                </div>
                              </button>
                            </li>
                          ))}
                          {filteredTables.length === 0 && (
                            <li className="px-4 py-6 text-center text-muted-foreground">
                              No tables found matching your search
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {selectedTable && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="h-5 w-5 text-purple-600" />
                        Table Structure
                      </CardTitle>
                      <CardDescription>
                        {selectedTable}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Columns ({columns.length})</h4>
                          <div className="max-h-[200px] overflow-y-auto bg-muted/50 rounded-md p-2">
                            {columns.map((column) => (
                              <div key={column} className="text-sm py-1 flex items-center">
                                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                                  {column}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Filter className="h-4 w-4 mr-1" />
                            Filter
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {selectedTable ? (
                        <>
                          <Table className="h-5 w-5 text-purple-600" />
                          {selectedTable}
                        </>
                      ) : (
                        <>
                          <Database className="h-5 w-5 text-purple-600" />
                          Table Data
                        </>
                      )}
                    </CardTitle>
                    {selectedTable && (
                      <CardDescription className="flex items-center justify-between">
                        <span>Showing {tableData.length} of {tables.find(t => t.name === selectedTable)?.rowCount || 0} rows</span>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>Last modified: {tables.find(t => t.name === selectedTable)?.lastModified}</span>
                        </div>
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoadingTableData ? (
                      <div className="py-16 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
                      </div>
                    ) : !selectedTable ? (
                      <div className="py-16 flex flex-col items-center justify-center text-center">
                        <Database className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Select a table to view data</h3>
                        <p className="text-muted-foreground max-w-md mt-2">
                          Choose a table from the list on the left to view its records.
                          You can search, filter, and export table data.
                        </p>
                      </div>
                    ) : tableData.length === 0 ? (
                      <div className="py-16 flex flex-col items-center justify-center text-center">
                        <Table className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No data available</h3>
                        <p className="text-muted-foreground max-w-md mt-2">
                          This table doesn't contain any records yet.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              {columns.map((column) => (
                                <th
                                  key={column}
                                  className="px-4 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap"
                                >
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {tableData.map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-muted/50">
                                {columns.map((column) => (
                                  <td
                                    key={`${rowIndex}-${column}`}
                                    className="px-4 py-2 text-sm whitespace-nowrap"
                                  >
                                    {typeof row[column] === 'object' 
                                      ? JSON.stringify(row[column]) 
                                      : String(row[column] !== undefined ? row[column] : '')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="query" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="h-5 w-5 text-purple-600" />
                  SQL Query Editor
                </CardTitle>
                <CardDescription>
                  Run SQL queries directly against the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      className="w-full min-h-[120px] p-4 border rounded-md font-mono text-sm resize-y"
                      placeholder="SELECT * FROM profiles LIMIT 10;"
                      value={currentQuery}
                      onChange={(e) => setCurrentQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <span className="text-orange-600 font-medium">Note:</span> For security, only SELECT queries are allowed in this interface.
                    </div>
                    <Button 
                      onClick={handleRunQuery}
                      disabled={!currentQuery.trim()}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run Query
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Table className="h-5 w-5 text-purple-600" />
                  Query Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingTableData ? (
                  <div className="py-16 flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
                  </div>
                ) : !queryResults ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <Play className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No query results yet</h3>
                    <p className="text-muted-foreground max-w-md mt-2">
                      Write a SQL query and click "Run Query" to see results.
                    </p>
                  </div>
                ) : queryResults.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <Table className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No results found</h3>
                    <p className="text-muted-foreground max-w-md mt-2">
                      Your query did not return any results.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          {queryColumns.map((column) => (
                            <th
                              key={column}
                              className="px-4 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {queryResults.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-muted/50">
                            {queryColumns.map((column) => (
                              <td
                                key={`${rowIndex}-${column}`}
                                className="px-4 py-2 text-sm whitespace-nowrap"
                              >
                                {typeof row[column] === 'object' 
                                  ? JSON.stringify(row[column]) 
                                  : String(row[column] !== undefined ? row[column] : '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Row Level Security Policies
                </CardTitle>
                <CardDescription>
                  Manage database security policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-md p-4">
                    <p className="text-sm text-muted-foreground">
                      Row Level Security (RLS) policies control access to data at the row level. 
                      These policies determine which rows can be viewed, created, updated, or deleted
                      based on the authenticated user.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredTables
                      .filter(table => table.hasRLS)
                      .map((table) => (
                        <Card key={table.name} className="border border-gray-200">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-base flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Table className="h-4 w-4 text-purple-600" />
                                {table.name}
                              </div>
                              <Badge variant="outline" className="ml-2">
                                RLS Enabled
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-3 px-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Row count:</span>
                                <span>{table.rowCount}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Last modified:</span>
                                <span>{table.lastModified}</span>
                              </div>
                              <div className="pt-2">
                                <Button size="sm" variant="outline" className="w-full">
                                  View Policies
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                    
                    {filteredTables.filter(table => table.hasRLS).length === 0 && (
                      <div className="py-8 text-center">
                        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No RLS policies found</h3>
                        <p className="text-muted-foreground">
                          No tables with Row Level Security match your search criteria
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Database className="h-4 w-4" /> Database Browser Guide
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Browse and query database tables with an easy-to-use interface</li>
            <li>View and navigate through table records with filtering options</li>
            <li>Run SQL SELECT queries to retrieve custom data sets</li>
            <li>Review and manage Row Level Security policies for secure data access</li>
            <li>Export table data for offline analysis and reporting</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default DatabaseBrowser;
