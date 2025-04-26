import React, { useState } from "react";
import { Link } from "react-router-dom";
import { navItems, activePages } from "@/config/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminEditPageModal from "./AdminEditPageModal";

// Import ALL possible Lucide icons used in navItems.config (add more if needed)
import {
  Edit, Trash2, Eye, EyeOff, Plus, Link as LinkIcon, Sidebar, Home, Music, Star, Users, User as UserIcon,
  Grid, BookOpen, Headphones, Map, Heart, Leaf
} from "lucide-react";

// Map icon string names to the Lucide React components.
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  "Sidebar": Sidebar,
  "Home": Home,
  "Music": Music,
  "Star": Star,
  "Users": Users,
  "User": UserIcon,
  "Grid": Grid,
  "BookOpen": BookOpen,
  "Headphones": Headphones,
  "Map": Map,
  "Heart": Heart,
  "Leaf": Leaf,
  "Edit": Edit,
  "Trash2": Trash2,
  "Plus": Plus,
  "Link": LinkIcon,
  // Add more as needed!
};

import {
  useNavigationItems,
  useUpdateNavigationItem,
  useAddNavigationItem,
  useDeleteNavigationItem,
  NavigationItem,
} from "./useNavigationItems";
import { Plus } from "lucide-react";

type PageConfig = (typeof navItems)[number] & { isActive: boolean };

const AdminPagesCanvas: React.FC = () => {
  const { toast } = useToast();

  // Use Supabase-powered navigation
  const { data: allPages = [], isLoading, error } = useNavigationItems();
  const updateItem = useUpdateNavigationItem();
  const deleteItem = useDeleteNavigationItem();
  const addItem = useAddNavigationItem();

  const [editingPage, setEditingPage] = useState<NavigationItem | null>(null);
  const [editingField, setEditingField] = useState<"label" | "path" | null>(null);
  const [deletingPage, setDeletingPage] = useState<NavigationItem | null>(null);

  // Add page modal state
  const [adding, setAdding] = useState(false);

  // Handle field edit
  const handleEdit = (page: NavigationItem) => {
    setEditingField("label");
    setEditingPage(page);
  };

  const handleLink = (page: NavigationItem) => {
    setEditingField("path");
    setEditingPage(page);
  };

  const handleDelete = (page: NavigationItem) => {
    setDeletingPage(page);
  };

  // Save field change to Supabase
  const handleModalSave = async (updatedValue: string) => {
    if (!editingPage || !editingField) return;
    try {
      await updateItem.mutateAsync({
        id: editingPage.id,
        field: editingField,
        value: updatedValue,
      });
      toast({
        title: "Navigation Updated",
        description: `Updated ${editingField === "label" ? "name" : "route"} for "${editingPage.label}".`,
        variant: "default",
      });
    } catch (e: any) {
      toast({
        title: "Update failed",
        description: e.message,
        variant: "destructive",
      });
    }
    setEditingPage(null);
    setEditingField(null);
  };

  // Save deletion
  const handleConfirmDelete = async () => {
    if (!deletingPage) return;
    try {
      await deleteItem.mutateAsync(deletingPage.id);
      toast({
        title: "Navigation Deleted",
        description: `Deleted page "${deletingPage.label}".`,
        variant: "destructive",
      });
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: e.message,
        variant: "destructive",
      });
    }
    setDeletingPage(null);
  };

  // Add new page
  const handleAddPage = async (newPage: Partial<NavigationItem>) => {
    try {
      await addItem.mutateAsync({
        label: newPage.label || "New Page",
        path: newPage.path || "/new-page",
        icon: newPage.icon || "layout-dashboard",
        order: allPages.length,
        active: true,
      });
      toast({
        title: "Page added",
        description: `New navigation page "${newPage.label}" added.`,
        variant: "default",
      });
    } catch (e: any) {
      toast({
        title: "Add failed",
        description: e.message,
        variant: "destructive",
      });
    }
    setAdding(false);
  };

  // Handle toggling active/inactive
  const handleToggleActive = async (page: NavigationItem) => {
    try {
      await updateItem.mutateAsync({
        id: page.id,
        field: "active",
        value: !page.active,
      });
      toast({
        title: page.active ? "Page hidden" : "Page shown",
        description: `"${page.label}" is now ${page.active ? "hidden" : "shown"} in navigation.`,
        variant: "default",
      });
    } catch (e: any) {
      toast({
        title: "Toggle failed",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin: Pages Manager</h1>
        <Button asChild>
          <Link to="/admin">Back to Admin Dashboard</Link>
        </Button>
      </div>
      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          Manage your website pages, their navigation status, and linking.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 mb-3"
          onClick={() => setAdding(true)}
        >
          <Plus className="h-4 w-4" />
          Add New Page
        </Button>
      </div>
      {/* Loading / error state */}
      {isLoading && <div className="py-8 text-center text-gray-500">Loading pages…</div>}
      {error && <div className="py-8 text-center text-red-400">Failed to load: {String(error.message || error)}</div>}
      {!isLoading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Shown in Navigation?</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPages.map(page => (
              <TableRow key={page.id}>
                <TableCell>
                  <Link to={page.path} className="text-purple-600 hover:underline">
                    {page.path}
                  </Link>
                </TableCell>
                <TableCell>{page.label}</TableCell>
                <TableCell>{page.icon}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleToggleActive(page)}
                    size="sm"
                    variant={page.active ? "default" : "outline"}
                  >
                    {page.active ? "Shown" : "Hidden"}
                  </Button>
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button size="icon" variant="ghost" aria-label="Edit page"
                    onClick={() => handleEdit(page)}
                  >
                    <Edit className="h-4 w-4 text-purple-600" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Delete page"
                    onClick={() => handleDelete(page)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Edit link"
                    onClick={() => handleLink(page)}
                  >
                    <LinkIcon className="h-4 w-4 text-blue-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* Edit Modal */}
      <AdminEditPageModal
        open={!!editingPage}
        field={editingField}
        page={editingPage}
        onClose={() => {
          setEditingPage(null);
          setEditingField(null);
        }}
        onSave={handleModalSave}
      />
      {/* Add Modal */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[350px] max-w-[90vw]">
            <div className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
              Add Navigation Page
            </div>
            <AddPageForm
              onAdd={handleAddPage}
              onCancel={() => setAdding(false)}
            />
          </div>
        </div>
      )}
      {/* Delete confirm */}
      {deletingPage && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[320px]">
            <div className="text-lg font-bold mb-2 text-red-700">Delete page?</div>
            <div className="mb-4">
              Are you sure you want to delete <span className="font-semibold">{deletingPage.label}</span>?
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setDeletingPage(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
      <div className="pt-6">
        <div className="text-gray-500 text-xs">
          Navigation changes are <strong>LIVE</strong>. All edits persist to the Supabase database and affect navigation immediately!
        </div>
      </div>
    </div>
  );
};

// AddPageForm helper
const AddPageForm: React.FC<{
  onAdd: (vals: any) => void;
  onCancel: () => void;
}> = ({ onAdd, onCancel }) => {
  const [label, setLabel] = useState("");
  const [path, setPath] = useState("");
  const [icon, setIcon] = useState("");

  return (
    <form
      className="space-y-3"
      onSubmit={e => {
        e.preventDefault();
        onAdd({ label, path, icon });
      }}
    >
      <input
        placeholder="Page Name / Label"
        value={label}
        onChange={e => setLabel(e.target.value)}
        className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
        required
      />
      <input
        placeholder="Route e.g. /about"
        value={path}
        onChange={e => setPath(e.target.value)}
        className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
        required
      />
      <input
        placeholder="Icon (lucide icon, e.g. layout-dashboard)"
        value={icon}
        onChange={e => setIcon(e.target.value)}
        className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
      />
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!label.trim() || !path.trim()}>Add</Button>
      </div>
    </form>
  );
};

export default AdminPagesCanvas;
