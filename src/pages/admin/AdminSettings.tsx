
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Shield, 
  Bell, 
  Users, 
  Database, 
  Save,
  Plus,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  getAdminSettings, 
  getSettingCategories, 
  updateSetting,
  AdminSetting,
  AdminSettingCategory 
} from '@/services/adminSettingsService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [categories, setCategories] = useState<AdminSettingCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [editingSettings, setEditingSettings] = useState<Record<string, any>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSetting, setNewSetting] = useState({
    category: 'general',
    key: '',
    value: '',
    description: ''
  });
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const [settingsData, categoriesData] = await Promise.all([
          getAdminSettings(),
          getSettingCategories(),
        ]);
        
        setSettings(settingsData);
        setCategories(categoriesData);
        
        // Initialize editing settings
        const initialEdits: Record<string, any> = {};
        settingsData.forEach(setting => {
          initialEdits[setting.id] = setting.value;
        });
        setEditingSettings(initialEdits);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleSettingChange = (id: string, value: any) => {
    setEditingSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveSetting = async (id: string) => {
    try {
      const success = await updateSetting(id, editingSettings[id]);
      if (success) {
        toast.success('Setting updated successfully');
        
        // Update local settings
        setSettings(settings.map(setting => 
          setting.id === id 
            ? { ...setting, value: editingSettings[id], updatedAt: new Date().toISOString() } 
            : setting
        ));
      } else {
        toast.error('Failed to update setting');
      }
    } catch (error) {
      console.error(`Error saving setting ${id}:`, error);
      toast.error('Error saving setting');
    }
  };

  const handleAddSetting = () => {
    // Validate new setting
    if (!newSetting.key.trim() || !newSetting.category) {
      toast.error('Please provide a key and category');
      return;
    }
    
    // In a real implementation, this would save to the database
    const id = `new-${Date.now()}`;
    const now = new Date().toISOString();
    
    const added: AdminSetting = {
      id,
      category: newSetting.category,
      key: newSetting.key.trim(),
      value: newSetting.value,
      description: newSetting.description,
      updatedAt: now,
    };
    
    setSettings([...settings, added]);
    setEditingSettings(prev => ({
      ...prev,
      [id]: added.value
    }));
    
    toast.success('Setting added successfully');
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewSetting({
      category: 'general',
      key: '',
      value: '',
      description: ''
    });
  };

  const handleResetSettings = () => {
    // In a real implementation, this would reset to defaults in the database
    
    // For now, just reset to initial values
    const initialEdits: Record<string, any> = {};
    settings.forEach(setting => {
      initialEdits[setting.id] = setting.value;
    });
    setEditingSettings(initialEdits);
    
    toast.success('Settings reset to defaults');
    setIsResetDialogOpen(false);
  };

  // Filter settings by category
  const filteredSettings = settings.filter(setting => setting.category === activeCategory);

  // Get icon component by name
  const getIconByName = (name: string) => {
    switch (name) {
      case 'Settings': return <Settings className="h-5 w-5 text-purple-600" />;
      case 'Shield': return <Shield className="h-5 w-5 text-purple-600" />;
      case 'Bell': return <Bell className="h-5 w-5 text-purple-600" />;
      case 'Database': return <Database className="h-5 w-5 text-purple-600" />;
      default: return <Settings className="h-5 w-5 text-purple-600" />;
    }
  };

  return (
    <PageLayout title="Admin Settings">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Admin Settings
            </span>
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            Configure global admin settings and preferences
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(true)}>
              Reset to Defaults
            </Button>
          </div>
          <div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Setting
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="general" 
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="space-y-6"
        >
          <TabsList className="w-full md:w-auto grid grid-cols-4 gap-1">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                {getIconByName(category.icon || '')}
                <span className="hidden md:inline">{category.name}</span>
                <span className="inline md:hidden">{category.name.substring(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-1 flex items-center gap-2">
                  {getIconByName(category.icon || '')}
                  {category.name} Settings
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
              
              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
                </div>
              ) : filteredSettings.length === 0 ? (
                <div className="text-center py-12">
                  <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No settings found</h3>
                  <p className="text-muted-foreground">
                    No configuration options are available for this category yet.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setNewSetting(prev => ({ ...prev, category: category.id }));
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Setting
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredSettings.map(setting => (
                    <Card key={setting.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{setting.key.split('_').join(' ')}</CardTitle>
                            {setting.description && (
                              <CardDescription>{setting.description}</CardDescription>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Updated: {new Date(setting.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {typeof setting.value === 'boolean' ? (
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`switch-${setting.id}`} className="text-sm font-medium">
                                {editingSettings[setting.id] ? 'Enabled' : 'Disabled'}
                              </Label>
                              <Switch
                                id={`switch-${setting.id}`}
                                checked={editingSettings[setting.id]}
                                onCheckedChange={value => handleSettingChange(setting.id, value)}
                              />
                            </div>
                          ) : typeof setting.value === 'number' ? (
                            <div className="space-y-2">
                              <Label htmlFor={`input-${setting.id}`} className="text-sm font-medium">
                                Value
                              </Label>
                              <Input
                                id={`input-${setting.id}`}
                                type="number"
                                value={editingSettings[setting.id]}
                                onChange={e => handleSettingChange(setting.id, Number(e.target.value))}
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label htmlFor={`input-${setting.id}`} className="text-sm font-medium">
                                Value
                              </Label>
                              <Input
                                id={`input-${setting.id}`}
                                value={editingSettings[setting.id]}
                                onChange={e => handleSettingChange(setting.id, e.target.value)}
                              />
                            </div>
                          )}
                          
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSaveSetting(setting.id)}
                              disabled={editingSettings[setting.id] === setting.value}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Settings className="h-4 w-4" /> Admin Settings Guide
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Modify global system settings that affect the entire admin console</li>
            <li>Each category contains related settings for easier organization</li>
            <li>Changes are saved individually for each setting</li>
            <li>Use "Reset to Defaults" to restore factory settings</li>
            <li>Add custom settings as needed for your specific requirements</li>
          </ul>
        </div>
      </div>

      {/* Add Setting Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Setting</DialogTitle>
            <DialogDescription>
              Create a new configuration setting
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="setting-category">Category</Label>
              <Select
                value={newSetting.category}
                onValueChange={value => setNewSetting(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="setting-key">Setting Key</Label>
              <Input
                id="setting-key"
                placeholder="e.g. site_logo_url"
                value={newSetting.key}
                onChange={e => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Use snake_case format without spaces
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="setting-value">Value</Label>
              <Input
                id="setting-value"
                placeholder="Setting value"
                value={newSetting.value}
                onChange={e => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="setting-description">Description (Optional)</Label>
              <Input
                id="setting-description"
                placeholder="Explain what this setting does"
                value={newSetting.description}
                onChange={e => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSetting}>
              <Plus className="h-4 w-4 mr-1" />
              Add Setting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Settings Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Reset All Settings
            </DialogTitle>
            <DialogDescription>
              This will reset all settings to their default values. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              All your custom configurations will be lost. Are you sure you want to continue?
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetSettings}>
              Reset All Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default AdminSettings;
