
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Shield, 
  Search, 
  User, 
  Mail, 
  Key, 
  X,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { fetchProfile } from '@/utils/profiles';

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  lastActive: string;
  status: 'active' | 'inactive';
  profile?: {
    bio?: string;
    avatar_url?: string;
    display_name?: string;
  };
}

// Mock user data - in a real implementation, this would be fetched from the database
const mockUsers = [
  { id: '1', name: 'Jane Cooper', email: 'jane@example.com', role: 'admin', lastActive: '2 hours ago', status: 'active' },
  { id: '2', name: 'Wade Warren', email: 'wade@example.com', role: 'moderator', lastActive: '1 day ago', status: 'active' },
  { id: '3', name: 'Esther Howard', email: 'esther@example.com', role: 'user', lastActive: '3 days ago', status: 'inactive' },
  { id: '4', name: 'Cameron Williamson', email: 'cameron@example.com', role: 'user', lastActive: '5 hours ago', status: 'active' },
  { id: '5', name: 'Brooklyn Simmons', email: 'brooklyn@example.com', role: 'user', lastActive: '1 week ago', status: 'inactive' },
];

const UserManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Setup form for editing users
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'user' as 'admin' | 'moderator' | 'user',
      status: 'active' as 'active' | 'inactive',
      bio: '',
    },
  });

  useEffect(() => {
    // In a real implementation, we would fetch users from Supabase
    // For now, we'll use the mock data
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Attempt to get real users from Supabase if possible
        const { data: authUsers, error } = await supabase.auth.admin.listUsers();
        
        if (error || !authUsers) {
          console.log('Using mock user data due to error or missing auth access:', error);
          setUsers(mockUsers);
        } else {
          // Transform auth users to our format
          const transformedUsers = await Promise.all(authUsers.users.map(async (authUser) => {
            // Try to fetch profile data for each user
            let profile = null;
            try {
              profile = await fetchProfile(authUser.id);
            } catch (e) {
              console.error('Error fetching profile:', e);
            }
            
            return {
              id: authUser.id,
              name: profile?.display_name || authUser.email?.split('@')[0] || 'Unknown',
              email: authUser.email || 'No email',
              role: 'user' as 'admin' | 'moderator' | 'user', // Default to user
              lastActive: authUser.last_sign_in_at 
                ? new Date(authUser.last_sign_in_at).toLocaleString() 
                : 'Never',
              status: authUser.banned ? 'inactive' : 'active',
              profile: profile || undefined
            };
          }));
          setUsers(transformedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
        setUsers(mockUsers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open edit dialog with user data
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      bio: user.profile?.bio || '',
    });
    setIsEditDialogOpen(true);
  };

  // Open add user dialog
  const handleAddUser = () => {
    setSelectedUser(null);
    form.reset({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      bio: '',
    });
    setIsAddDialogOpen(true);
  };

  // Handle form submission for both edit and add
  const onSubmit = async (data: any) => {
    try {
      if (selectedUser) {
        // Edit existing user
        // In a real implementation, we would update the user in Supabase
        console.log('Updating user:', selectedUser.id, data);
        
        // Mock update for demonstration
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...data } 
            : user
        ));
        
        toast.success('User updated successfully');
        setIsEditDialogOpen(false);
      } else {
        // Add new user
        // In a real implementation, we would create a new user in Supabase
        console.log('Creating new user:', data);
        
        // Mock add for demonstration
        const newUser: User = {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status,
          lastActive: 'Never',
        };
        
        setUsers([...users, newUser]);
        
        toast.success('User created successfully');
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

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
            <Button size="sm" className="flex-1 md:flex-none" onClick={handleAddUser}>
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
                {isLoading ? (
                  <div className="py-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No users found matching your search
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            {user.profile?.avatar_url && (
                              <AvatarImage src={user.profile.avatar_url} alt={user.name} />
                            )}
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
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                            {user.profile?.avatar_url && (
                              <AvatarImage src={user.profile.avatar_url} alt={user.name} />
                            )}
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
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
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
                            {user.profile?.avatar_url && (
                              <AvatarImage src={user.profile.avatar_url} alt={user.name} />
                            )}
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
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
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
                            {user.profile?.avatar_url && (
                              <AvatarImage src={user.profile.avatar_url} alt={user.name} />
                            )}
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
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
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
            <li>Edit users to update their profile information and status</li>
          </ul>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input {...field} disabled />
                      </div>
                    </FormControl>
                    <FormDescription>Email cannot be changed</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="flex space-x-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="flex space-x-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default UserManager;
