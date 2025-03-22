
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Users, FileDown, FileText, History, RotateCcw, Pen, Save, Network, Wand2 } from "lucide-react";
import { PatientRelationship, GenogramVersion } from "@/types/patient";

// Sample genogram versions
const sampleGenogramVersions: GenogramVersion[] = [
  {
    id: "1",
    patientId: "1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
    pdfUrl: "/genogram-v1.pdf",
    notes: "Version initiale du génogramme"
  },
  {
    id: "2",
    patientId: "1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
    pdfUrl: "/genogram-v2.pdf",
    notes: "Ajout de la tante maternelle"
  },
  {
    id: "3",
    patientId: "1",
    createdAt: new Date(),
    pdfUrl: "/genogram-v3.pdf",
    notes: "Mise à jour des relations avec les grands-parents"
  }
];

interface GenogramTabProps {
  patientId: string;
  onSwitchToRelationsTab: () => void;
}

const GenogramTab = ({ patientId, onSwitchToRelationsTab }: GenogramTabProps) => {
  const navigate = useNavigate();
  const [genogramVersions, setGenogramVersions] = useState(sampleGenogramVersions);
  const [currentVersion, setCurrentVersion] = useState(genogramVersions[genogramVersions.length - 1]);
  const [isEditing, setIsEditing] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Simulate exporting and creating a new version
  const handleExportPDF = () => {
    toast.success("Génogramme exporté au format PDF");
  };
  
  // Start editing the genogram
  const handleStartEditing = () => {
    setIsEditing(true);
  };

  // Save changes and create a new version
  const handleSaveChanges = () => {
    const newVersion: GenogramVersion = {
      id: Date.now().toString(),
      patientId,
      createdAt: new Date(),
      pdfUrl: `/genogram-v${genogramVersions.length + 1}.pdf`,
      notes: `Version ${genogramVersions.length + 1} du génogramme`
    };
    
    setGenogramVersions([...genogramVersions, newVersion]);
    setCurrentVersion(newVersion);
    setIsEditing(false);
    toast.success("Génogramme enregistré avec succès");
  };
  
  // Restore a previous version
  const handleRestoreVersion = (version: GenogramVersion) => {
    setCurrentVersion(version);
    setShowVersionHistory(false);
    toast.info(`Version du ${version.createdAt.toLocaleDateString()} restaurée`);
  };

  // Handle edit request by navigating to relations tab
  const handleEditGenogram = () => {
    setIsEditing(true);
    onSwitchToRelationsTab();
  };
  
  // Generate a new genogram using AI
  const handleGenerateGenogram = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const newVersion: GenogramVersion = {
        id: Date.now().toString(),
        patientId,
        createdAt: new Date(),
        pdfUrl: `/genogram-v${genogramVersions.length + 1}.pdf`,
        notes: `Génogramme généré automatiquement par IA`
      };
      
      setGenogramVersions([...genogramVersions, newVersion]);
      setCurrentVersion(newVersion);
      setIsGenerating(false);
      toast.success("Génogramme généré avec succès");
    }, 2000);
  };
  
  return (
    <Card className="w-full overflow-hidden border rounded-xl">
      <CardHeader className="bg-secondary/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Génogramme du patient</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Historique des versions</DialogTitle>
                  <DialogDescription>
                    Consultez et restaurez des versions précédentes du génogramme
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto">
                  {genogramVersions.length > 0 ? (
                    <div className="space-y-2">
                      {genogramVersions.map((version) => (
                        <div 
                          key={version.id} 
                          className={`p-3 rounded-lg border ${currentVersion.id === version.id ? 'bg-muted border-primary' : ''}`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">
                                {version.createdAt.toLocaleDateString()} à {version.createdAt.toLocaleTimeString()}
                              </div>
                              {version.notes && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {version.notes}
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(version.pdfUrl, '_blank')}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                              {currentVersion.id !== version.id && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleRestoreVersion(version)}
                                >
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Restaurer
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Aucune version disponible
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setShowVersionHistory(true)}
            >
              <History className="h-4 w-4 mr-2" />
              Historique
            </Button>
            
            <Button
              variant={currentVersion ? "outline" : "default"}
              size="sm"
              className="rounded-xl"
              onClick={handleGenerateGenogram}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Génération...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  {currentVersion ? "Regénérer" : "Générer"}
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={handleEditGenogram}
            >
              <Pen className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={handleExportPDF}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
        <CardDescription>
          Visualisez et modifiez le génogramme familial du patient
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="glass-panel p-6 h-[500px] flex flex-col items-center justify-center">
          {currentVersion ? (
            <div className="text-center space-y-4 w-full h-full flex flex-col items-center justify-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Génogramme (PDF)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Version du {currentVersion.createdAt.toLocaleDateString()}
                </p>
                <Button 
                  onClick={() => window.open(currentVersion.pdfUrl, '_blank')}
                  className="rounded-xl"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Visualiser le PDF
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Génogramme</h3>
                <p className="text-sm text-muted-foreground">
                  Aucun génogramme disponible pour ce patient
                </p>
                <Button 
                  onClick={handleGenerateGenogram}
                  className="mt-4 rounded-xl"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Générer un génogramme
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenogramTab;
