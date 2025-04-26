
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type PageConfig = {
  path: string;
  label: string;
};

interface AdminEditPageModalProps {
  open: boolean;
  field: "label" | "path" | null;
  page: PageConfig | null;
  onClose: () => void;
  onSave: (updatedValue: string) => void;
}

const AdminEditPageModal: React.FC<AdminEditPageModalProps> = ({
  open,
  field,
  page,
  onClose,
  onSave,
}) => {
  const [val, setVal] = useState("");

  useEffect(() => {
    if (!open || !page || !field) {
      setVal("");
      return;
    }
    setVal(field === "label" ? page.label : page.path);
  }, [open, page, field]);

  if (!open || !page || !field) return null;

  const labelMap: Record<"label" | "path", string> = {
    label: "Page Name / Label",
    path: "Page Route / Path"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 min-w-[350px] max-w-[90vw]">
        <div className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
          Edit {labelMap[field]}
        </div>
        <div className="mb-3">
          <input
            value={val}
            onChange={e => setVal(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="text-sm text-gray-500 mb-4">
          This is just a UI preview; to persist navigation changes, update <code>src/config/navigation.ts</code>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(val)} disabled={!val.trim()}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditPageModal;
