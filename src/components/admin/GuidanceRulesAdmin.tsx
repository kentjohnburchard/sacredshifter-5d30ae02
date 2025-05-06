import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Plus, Save, Trash } from 'lucide-react';

interface GuidanceRule {
  id?: string;
  title: string;
  reason: string;
  trigger_type: string;
  trigger_value: string;
  action_type: string;
  action_id: string;
  action_label: string;
  priority: number;
  chakra?: string;
}

const GuidanceRulesAdmin: React.FC = () => {
  const [rules, setRules] = useState<GuidanceRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRule, setNewRule] = useState<GuidanceRule>({
    title: '',
    reason: '',
    trigger_type: 'chakra_imbalance',
    trigger_value: '',
    action_type: 'journey',
    action_id: '',
    action_label: 'Start Journey',
    priority: 5
  });

  useEffect(() => {
    loadRules();
  }, []);

  // This is a placeholder function as we haven't created the database table yet
  // In a real implementation, this would load rules from the database
  const loadRules = async () => {
    setLoading(true);
    try {
      // Placeholder for database call - would be implemented when we create the table
      setRules([
        {
          id: '1',
          title: 'Balance Your Root Chakra',
          reason: 'You\'ve been focusing on higher energy centers. Ground yourself with root work.',
          trigger_type: 'chakra_imbalance',
          trigger_value: 'root',
          action_type: 'journey',
          action_id: 'root-stabilization',
          action_label: 'Start Journey',
          priority: 8,
          chakra: 'root'
        },
        {
          id: '2',
          title: 'Reactivate Your Sacred Journey',
          reason: 'It\'s been a while since your last activity. Reconnect with your practice.',
          trigger_type: 'inactivity',
          trigger_value: '7_days',
          action_type: 'meditation',
          action_id: 'reconnect',
          action_label: 'Quick Reconnection',
          priority: 9
        }
      ]);
    } catch (error) {
      console.error('Error loading guidance rules:', error);
      toast.error('Failed to load guidance rules');
    } finally {
      setLoading(false);
    }
  };

  // This is a placeholder function that would save to database once implemented
  const saveRule = async (rule: GuidanceRule) => {
    // Placeholder for database save
    toast.success('Rule saved successfully');
    
    // Update rules display
    if (rule.id) {
      // Update existing rule
      setRules(current => current.map(r => r.id === rule.id ? rule : r));
    } else {
      // Add new rule
      const newRuleWithId = { ...rule, id: Date.now().toString() };
      setRules(current => [...current, newRuleWithId]);
      
      // Reset new rule form
      setNewRule({
        title: '',
        reason: '',
        trigger_type: 'chakra_imbalance',
        trigger_value: '',
        action_type: 'journey',
        action_id: '',
        action_label: 'Start Journey',
        priority: 5
      });
    }
  };

  // Delete a rule (placeholder)
  const deleteRule = async (id: string) => {
    // Placeholder for database delete
    toast.success('Rule deleted successfully');
    
    // Update rules display
    setRules(current => current.filter(r => r.id !== id));
  };

  return (
    <Card className="border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Guidance Rules Management
        </CardTitle>
        <CardDescription>
          Create rules that provide guidance recommendations based on user activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* New Rule Form */}
        <div className="bg-black/20 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-3">Add New Rule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <Input 
                value={newRule.title}
                onChange={e => setNewRule({...newRule, title: e.target.value})}
                placeholder="Rule Title"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Priority (1-10)</label>
              <Input 
                type="number"
                min="1"
                max="10"
                value={newRule.priority}
                onChange={e => setNewRule({...newRule, priority: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-1">Reason for Recommendation</label>
            <Textarea 
              value={newRule.reason}
              onChange={e => setNewRule({...newRule, reason: e.target.value})}
              placeholder="Explain why this recommendation is shown to the user"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Trigger Type</label>
              <Select 
                value={newRule.trigger_type}
                onValueChange={value => setNewRule({...newRule, trigger_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chakra_imbalance">Chakra Imbalance</SelectItem>
                  <SelectItem value="inactivity">User Inactivity</SelectItem>
                  <SelectItem value="lightbearer_level">Lightbearer Level</SelectItem>
                  <SelectItem value="journey_pattern">Journey Pattern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Trigger Value</label>
              <Input 
                value={newRule.trigger_value}
                onChange={e => setNewRule({...newRule, trigger_value: e.target.value})}
                placeholder="e.g., root, 7_days, level_3"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Action Type</label>
              <Select 
                value={newRule.action_type}
                onValueChange={value => setNewRule({...newRule, action_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="journey">Journey</SelectItem>
                  <SelectItem value="meditation">Meditation</SelectItem>
                  <SelectItem value="reflection">Reflection</SelectItem>
                  <SelectItem value="frequency">Frequency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Action ID</label>
              <Input 
                value={newRule.action_id}
                onChange={e => setNewRule({...newRule, action_id: e.target.value})}
                placeholder="e.g., journey-slug, meditation-id"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Action Button Label</label>
              <Input 
                value={newRule.action_label}
                onChange={e => setNewRule({...newRule, action_label: e.target.value})}
                placeholder="e.g., Start Journey"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={() => saveRule(newRule)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Rule
            </Button>
          </div>
        </div>
        
        {/* Existing Rules */}
        <h3 className="text-lg font-medium mb-3">Existing Rules</h3>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-5 w-5 border-b-2 border-purple-500 rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.length === 0 ? (
              <p className="text-center text-gray-500">No rules created yet</p>
            ) : (
              rules.map(rule => (
                <div key={rule.id} className="border border-gray-700 rounded-lg p-4 bg-black/20">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{rule.title}</h4>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-300"
                        onClick={() => rule.id && deleteRule(rule.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-400">{rule.reason}</div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                      Trigger: {rule.trigger_type} ({rule.trigger_value})
                    </span>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                      Action: {rule.action_type} ({rule.action_id})
                    </span>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                      Priority: {rule.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GuidanceRulesAdmin;
