
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

type PageConfig = (typeof navItems)[number] & { isActive: boolean };

const AdminPagesCanvas: React.FC = () => {
  const { toast } = useToast();
  // Generate a list of all navigation-configured pages
  const allPages: PageConfig[] = navItems.map(item => ({
    ...item,
    isActive: activePages[item.key],
  }));

  // Modal/confirm management states
  const [editingPage, setEditingPage] = useState<PageConfig | null>(null);
  const [editingField, setEditingField] = useState<"label" | "path" | null>(null);
  const [deletingPage, setDeletingPage] = useState<PageConfig | null>(null);

  const handleEdit = (page: PageConfig) => {
    setEditingField("label");
    setEditingPage(page);
  };

  const handleLink = (page: PageConfig) => {
    setEditingField("path");
    setEditingPage(page);
  };

  const handleDelete = (page: PageConfig) => {
    setDeletingPage(page);
  };

  const handleModalClose = () => {
    setEditingPage(null);
    setEditingField(null);
  };
  const handleModalSave = (updatedValue: string) => {
    if (!editingPage || !editingField) return;
    toast({
      title: "Config changes aren't live yet",
      description: `Pretend-updating page "${editingPage.label}" (${editingField}): ${updatedValue}.\nThis UI is a preview—persist these changes in src/config/navigation.ts.`,
      variant: "default",
    });
    console.log(`Would update page [${editingPage.label}] (${editingField}) to "${updatedValue}"`);
    setEditingPage(null);
    setEditingField(null);
  };

  const handleConfirmDelete = () => {
    if (deletingPage) {
      toast({
        title: "Delete simulation",
        description: `Pretend-deleting page "${deletingPage.label}".\nThis will really be effective after supporting backend/config CRUD.`,
        variant: "destructive",
      });
      console.log(`Would delete page [${deletingPage.label}]`);
    }
    setDeletingPage(null);
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
        <Button variant="outline" size="sm" className="flex items-center gap-2 mb-3" disabled>
          <Plus className="h-4 w-4" />
          Add New Page (Coming Soon)
        </Button>
      </div>
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
            <TableRow key={page.path}>
              <TableCell>
                <Link to={page.path} className="text-purple-600 hover:underline">
                  {page.path}
                </Link>
              </TableCell>
              <TableCell>{page.label}</TableCell>
              <TableCell>
                {page.icon && iconMap[page.icon] ? (
                  React.createElement(iconMap[page.icon], { className: "h-6 w-6 text-purple-500" })
                ) : (
                  <Sidebar className="h-6 w-6 text-gray-400" />
                )}
              </TableCell>
              <TableCell>
                {page.isActive ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold"><Eye className="h-4 w-4" /> Yes</span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400"><EyeOff className="h-4 w-4" /> Hidden</span>
                )}
              </TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" aria-label="Edit page"
                  onClick={() => handleEdit(page)}
                  className="hover:bg-purple-100 focus:outline-none active:bg-purple-200"
                >
                  <Edit className="h-4 w-4 text-purple-600" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Delete page"
                  onClick={() => handleDelete(page)}
                  className="hover:bg-red-100 focus:outline-none active:bg-red-200"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Edit link"
                  onClick={() => handleLink(page)}
                  className="hover:bg-blue-100 focus:outline-none active:bg-blue-200"
                >
                  <LinkIcon className="h-4 w-4 text-blue-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Edit Modal */}
      <AdminEditPageModal
        open={!!editingPage}
        field={editingField}
        page={editingPage}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
      {/* Delete confirm */}
      {deletingPage && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[320px]">
            <div className="text-lg font-bold mb-2 text-red-700">Delete page?</div>
            <div className="mb-4">
              Are you sure you want to delete <span className="font-semibold">{deletingPage.label}</span>?
              <br />
              <span className="text-xs text-gray-500">
                (Simulation: Pages can only be changed in code for now.)
              </span>
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
          More controls & direct-edit capabilities coming soon. For now, editing navigation and routes must still be done in <code>src/config/navigation.ts</code> and AppRoutes.
        </div>
      </div>
    </div>
  );
};

export default AdminPagesCanvas;
