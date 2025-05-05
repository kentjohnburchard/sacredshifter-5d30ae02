
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, UserCheck, Shield, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock user data
const mockUsers = [
  { id: 1, name: 'Jane Cooper', email: 'jane@example.com', role: 'admin', lastActive: '2 hours ago', status: 'active' },
  { id: 2, name: 'Wade Warren', email: 'wade@example.com', role: 'moderator', lastActive: '1 day ago', status: 'active' },
  { id: 3, name: 'Esther Howard', email: 'esther@example.com', role: 'user', lastActive: '3 days ago', status: 'inactive' },
  { id: 4, name: 'Cameron Williamson', email: 'cameron@example.com', role: 'user', lastActive: '5 hours ago', status: 'active' },
  { id: 5, name: 'Brooklyn Simmons', email: 'brooklyn@example.com', role: 'user', lastActive: '1 week ago', status: 'inactive' },
];

const UserManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout title="User Manager">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              User Manager
            </span>
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            Manage users, roles, and permissions
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-8 pr-4 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button size="sm" className="flex-1 md:flex-none">
              <UserPlus className="mr-1 h-4 w-4" />
              <span className="hidden md:inline">Add User</span>
            </Button>
            <Button size="sm" variant="outline" className="flex-1 md:flex-none">
              <Shield className="mr-1 h-4 w-4" />
              <span className="hidden md:inline">Manage Roles</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-4 gap-1">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
            <TabsTrigger value="moderator">Moderators</TabsTrigger>
            <TabsTrigger value="user">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between">
                  <span>Users ({filteredUsers.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        <Badge variant="outline">{user.role}</Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="divide-y">
                  {filteredUsers
                    .filter(user => user.role === 'admin')
                    .map((user) => (
                      <div key={user.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="moderator" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="divide-y">
                  {filteredUsers
                    .filter(user => user.role === 'moderator')
                    .map((user) => (
                      <div key={user.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="user" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="divide-y">
                  {filteredUsers
                    .filter(user => user.role === 'user')
                    .map((user) => (
                      <div key={user.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <UserCheck className="h-4 w-4" /> User Management Guide
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Use the search bar to quickly find specific users</li>
            <li>Tab navigation filters users by role</li>
            <li>Click "Add User" to create new user accounts</li>
            <li>Click "Manage Roles" to define custom roles and permissions</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default UserManager;
