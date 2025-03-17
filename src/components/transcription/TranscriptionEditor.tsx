
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Save, Play, FileText, Wand2 } from "lucide-react";

interface TranscriptionEditorProps {
  transcription: string;
  onSave: (text: string) => void;
  onAnalyze: () => void;
  isProcessing: boolean;
}

const TranscriptionEditor = ({ 
  transcription, 
  onSave, 
  onAnalyze,
  isProcessing 
}: TranscriptionEditorProps) => {
  const [editedText, setEditedText] = useState(transcription);
  const [activeTab, setActiveTab] = useState("edit");
  
  useEffect(() => {
    setEditedText(transcription);
  }, [transcription]);
  
  const handleSave = () => {
    onSave(editedText);
    toast.success("Transcription sauvegardée");
  };
  
  const handleAnalyze = () => {
    onAnalyze();
  };
  
  return (
    <motion.div 
      className="w-full h-full flex flex-col space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-medium">Transcription</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={handleSave}
            disabled={isProcessing}
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          
          <Button
            size="sm"
            className="rounded-xl"
            onClick={handleAnalyze}
            disabled={isProcessing || !editedText.trim()}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                <span>Analyse en cours...</span>
              </div>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Analyser
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="self-start mb-4 rounded-xl">
          <TabsTrigger value="edit" className="rounded-l-xl">Éditer</TabsTrigger>
          <TabsTrigger value="preview" className="rounded-r-xl">Aperçu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="flex-1 mt-0">
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="h-full min-h-[400px] p-4 rounded-xl resize-none subtle-scroll text-base leading-relaxed"
            placeholder="La transcription apparaîtra ici..."
            disabled={isProcessing}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="flex-1 mt-0">
          <div className="h-full min-h-[400px] p-4 bg-muted/30 rounded-xl subtle-scroll text-base leading-relaxed whitespace-pre-wrap">
            {editedText || "Aucune transcription à afficher."}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TranscriptionEditor;
