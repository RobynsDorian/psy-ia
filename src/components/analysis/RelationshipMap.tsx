
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserRound, Heart, Users, FileDown, FileText, History, RotateCcw, Pen, Save } from "lucide-react";
import { PatientRelationship, GenogramVersion } from "@/types/patient";

// Exemple de versions du génogramme
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

interface RelationshipMapProps {
  relationships: PatientRelationship[];
  patientId: string;
}

const RelationshipMap = ({ relationships, patientId }: RelationshipMapProps) => {
  const [activeTab, setActiveTab] = useState("list");
  const [genogramVersions, setGenogramVersions] = useState(sampleGenogramVersions);
  const [currentVersion, setCurrentVersion] = useState(genogramVersions[genogramVersions.length - 1]);
  const [isEditing, setIsEditing] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  // Simuler l'exportation et la création d'une nouvelle version
  const handleExportPDF = () => {
    if (isEditing) {
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
    } else {
      toast.success("Génogramme exporté au format PDF");
    }
  };
  
  // Restaurer une version précédente
  const handleRestoreVersion = (version: GenogramVersion) => {
    setCurrentVersion(version);
    setShowVersionHistory(false);
    toast.info(`Version du ${version.createdAt.toLocaleDateString()} restaurée`);
  };
  
  return (
    <Card className="w-full overflow-hidden border rounded-xl">
      <CardHeader className="bg-secondary/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Relations du patient</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {activeTab === "map" && (
              <>
                <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      <History className="h-4 w-4 mr-2" />
                      Historique
                    </Button>
                  </DialogTrigger>
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
                
                {isEditing ? (
                  <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={handleExportPDF}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setIsEditing(true)}
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
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <CardDescription>
          Informations sur les relations personnelles identifiées
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 rounded-none">
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="map">Genogramme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="p-6 space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {relationships.length > 0 ? (
                relationships.map((relation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="glass-panel p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <UserRound className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{relation.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {relation.relation}
                        </div>
                        <p className="text-sm mt-2">{relation.description}</p>
                        
                        {relation.connections.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-muted-foreground mb-1">Liens avec:</div>
                            <div className="flex flex-wrap gap-1">
                              {relation.connections.map((connection, i) => (
                                <span 
                                  key={i} 
                                  className="text-xs bg-accent/50 text-accent-foreground px-2 py-0.5 rounded-full"
                                >
                                  {connection}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center p-12 text-muted-foreground">
                  Aucune relation n'a encore été identifiée. Veuillez analyser une transcription.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="p-6">
            <div className={`relative ${isEditing ? 'border-2 border-dashed border-primary' : ''}`}>
              {isEditing && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Mode édition
                </div>
              )}
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
                      {isEditing ? (
                        <div className="space-y-2 max-w-md mx-auto">
                          <p className="text-sm">
                            Vous êtes en mode édition. Cette zone représente un éditeur de génogramme.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Dans une version réelle, vous pourriez modifier le génogramme directement ici.
                          </p>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => window.open(currentVersion.pdfUrl, '_blank')}
                          className="rounded-xl"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Visualiser le PDF
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Génogramme</h3>
                      <p className="text-sm text-muted-foreground">
                        Aucun génogramme disponible pour ce patient
                      </p>
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="mt-4 rounded-xl"
                      >
                        <Pen className="h-4 w-4 mr-2" />
                        Créer un génogramme
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RelationshipMap;
