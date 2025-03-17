
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneratedBackground } from "@/types/patient";
import { Calendar, Heart, Home, GraduationCap, Plus, Wand2, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HistoryTabProps {
  patientId: string;
  histories: GeneratedBackground[];
  isGeneratingBackground: boolean;
  generatePatientBackground: () => void;
}

const HistoryTab = ({ patientId, histories, isGeneratingBackground, generatePatientBackground }: HistoryTabProps) => {
  const [selectedHistory, setSelectedHistory] = useState<GeneratedBackground | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const handleViewHistory = (history: GeneratedBackground) => {
    setSelectedHistory(history);
    setIsViewDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Historiques générés</CardTitle>
              <CardDescription>Résumés du parcours du patient générés par l'IA</CardDescription>
            </div>
            <Button 
              onClick={generatePatientBackground}
              disabled={isGeneratingBackground}
            >
              {isGeneratingBackground ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Génération...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel historique
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {histories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {histories.map((history) => (
                  <TableRow key={history.id} className="cursor-pointer hover:bg-muted/60">
                    <TableCell>
                      {history.createdAt ? (
                        format(history.createdAt, 'PPP', { locale: fr })
                      ) : (
                        "Date inconnue"
                      )}
                    </TableCell>
                    <TableCell>{history.title || "Historique patient"}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewHistory(history)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aucun historique n'a encore été généré pour ce patient.</p>
              <Button 
                className="mt-4" 
                onClick={generatePatientBackground}
                disabled={isGeneratingBackground}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Générer un historique
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedHistory?.title || "Historique patient"}</DialogTitle>
            <DialogDescription>
              {selectedHistory?.createdAt ? (
                `Généré le ${format(selectedHistory.createdAt, 'PPP', { locale: fr })}`
              ) : (
                "Généré par intelligence artificielle"
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedHistory && (
            <div className="space-y-6 py-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <h3 className="font-medium mb-2">Résumé</h3>
                <p className="text-sm">{selectedHistory.summary}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {selectedHistory.sections.map((section, index) => {
                  let Icon;
                  switch (section.icon) {
                    case "calendar": Icon = Calendar; break;
                    case "heart": Icon = Heart; break;
                    case "home": Icon = Home; break;
                    case "graduation": Icon = GraduationCap; break;
                    default: Icon = Calendar;
                  }
                  
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <Icon size={16} />
                        </div>
                        <h3 className="font-medium">{section.title}</h3>
                      </div>
                      <p className="text-sm">{section.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryTab;
