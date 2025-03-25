
import React, { useState, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Add tag..." 
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      
      // Only add the tag if it's not already in the list
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(tag => (
          <Badge 
            key={tag} 
            className="bg-purple-100 text-purple-800 hover:bg-purple-200 group flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-purple-600 hover:text-purple-800 focus:outline-none rounded-full ml-1"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag} tag</span>
            </button>
          </Badge>
        ))}
      </div>
      
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1"
      />
      <p className="text-xs text-gray-500 mt-1">Press Enter to add a tag</p>
    </div>
  );
};

export default TagsInput;
