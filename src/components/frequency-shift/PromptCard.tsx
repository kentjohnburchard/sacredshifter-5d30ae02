
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface PromptCardProps {
  children: ReactNode;
}

const PromptCard = ({ children }: PromptCardProps) => {
  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden rounded-lg">
      <CardContent className="p-6 sm:p-8">
        {children}
      </CardContent>
    </Card>
  );
};

export default PromptCard;
