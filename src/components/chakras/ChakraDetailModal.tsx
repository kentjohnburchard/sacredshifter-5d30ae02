
import React, { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChakraData } from "@/data/chakraData";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-mobile";
import ChakraTonePlayer from "./ChakraTonePlayer";
import { Button } from "@/components/ui/button";

interface ChakraDetailModalProps {
  chakra: ChakraData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ChakraDetailModal: React.FC<ChakraDetailModalProps> = ({ chakra, isOpen, onClose }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [activeTab, setActiveTab] = useState("overview");

  if (!chakra) return null;

  const chakraContent = (
    <div className="flex flex-col space-y-5">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-white/80 shadow-sm">
              <h3 className="font-medium text-gray-700">Location</h3>
              <p className="text-gray-600">{chakra.location}</p>
            </Card>
            <Card className="p-4 bg-white/80 shadow-sm">
              <h3 className="font-medium text-gray-700">Element</h3>
              <p className="text-gray-600">{chakra.element}</p>
            </Card>
          </div>

          <Card className="p-4 bg-white/80 shadow-sm">
            <h3 className="font-medium text-gray-700">Emotional Themes</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {chakra.emotionalThemes.map((theme, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-full text-white text-sm ${chakra.color.replace('bg-', 'bg-')}`}
                >
                  {theme}
                </span>
              ))}
            </div>
          </Card>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <h3 className="font-medium text-gray-700 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${chakra.color}`}></span>
              Chakra Frequency
            </h3>
            <div className="mt-3">
              <ChakraTonePlayer 
                frequency={chakra.frequency} 
                chakra={chakra.name} 
                description={chakra.description}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4">
          <Card className="p-4 bg-white/80 shadow-sm">
            <h3 className="font-medium text-gray-700">Signs of Imbalance</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
              {chakra.imbalances.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 bg-white/80 shadow-sm">
            <h3 className="font-medium text-gray-700">Ways to Rebalance</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
              {chakra.rebalancing.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Card>

          <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
            <h3 className="font-medium text-gray-700">Affirmation</h3>
            <p className="italic text-gray-700 mt-2 text-center">"{chakra.affirmation}"</p>
          </div>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <Card className={`p-6 bg-${chakra.id}-50 shadow-sm border border-${chakra.id}-100`}>
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-700">Journal Prompt</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="italic text-gray-700 mt-3">{chakra.journalPrompt}</p>
            <textarea
              className="w-full mt-4 p-3 border rounded-md h-32 focus:ring-2 focus:ring-offset-1 focus:ring-opacity-50"
              placeholder="Write your reflections here..."
            ></textarea>
          </Card>

          <div className={`p-4 rounded-md bg-gradient-to-r ${chakra.gradient} bg-opacity-10 text-center`}>
            <h3 className="font-medium text-gray-700 mb-2">Vale's Wisdom</h3>
            <p className="italic text-gray-700">{chakra.valesWisdom}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={open => !open && onClose()}>
        <DrawerContent className="px-4 pb-16 pt-4 max-h-[90vh]">
          <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${chakra.gradient}`}></div>
          
          <DrawerHeader>
            <DrawerTitle className="text-xl flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${chakra.color}`}></div>
              {chakra.name}
              <span className="text-sm text-gray-500 font-normal">({chakra.sanskrit})</span>
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="overflow-y-auto py-4">
            {chakraContent}
          </div>
          
          <DrawerFooter className="pt-6">
            <DrawerClose asChild>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${chakra.gradient}`}></div>
        
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full ${chakra.color}`}></div>
            {chakra.name}
            <span className="text-base text-gray-500 font-normal">({chakra.sanskrit})</span>
          </DialogTitle>
          <DialogDescription>
            {chakra.location} • {chakra.frequency} Hz
          </DialogDescription>
        </DialogHeader>
        
        {chakraContent}
      </DialogContent>
    </Dialog>
  );
};

export default ChakraDetailModal;
