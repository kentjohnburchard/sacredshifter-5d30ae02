
import React from "react";
import { Link } from "react-router-dom";
import { navItems, activePages } from "@/config/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff, Plus, Link as LinkIcon } from "lucide-react";

const AdminPagesCanvas: React.FC = () => {
  // Generate a list of all navigation-configured pages
  const allPages = navItems.map(item => ({
    ...item,
    isActive: activePages[item.key],
  }));

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
                {/* Only use lucide icons from the allowed set */}
                {page.icon ? (
                  // @ts-ignore
                  React.createElement(require("lucide-react")[page.icon] ?? require("lucide-react").Sidebar, { className: "h-6 w-6 text-purple-500" })
                ) : (
                  <span className="text-gray-400">—</span>
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
                <Button size="icon" variant="ghost" disabled>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" disabled>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" disabled>
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="pt-6">
        <div className="text-gray-500 text-xs">
          More controls & direct-edit capabilities coming soon. For now, editing navigation and routes must still be done in <code>src/config/navigation.ts</code> and AppRoutes. 
        </div>
      </div>
    </div>
  );
};

export default AdminPagesCanvas;

