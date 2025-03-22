
import { PatientSession } from "@/types/patient";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SessionDialogProps {
  session: PatientSession | null;
  open: boolean;
  onClose: () => void;
}

const SessionDialog = ({ session, open, onClose }: SessionDialogProps) => {
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Séance du {format(session.date, 'PPP', { locale: fr })} à {format(session.date, 'HH:mm')}
          </DialogTitle>
          <DialogDescription>
            Détails de la séance
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="transcript" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transcript">Transcription</TabsTrigger>
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transcript" className="mt-2">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="whitespace-pre-line">
                {session.transcription}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-2">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {session.analysis ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Résumé</h3>
                    <p className="whitespace-pre-line">{session.analysis}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Thèmes abordés</h3>
                    <div className="flex flex-wrap gap-2">
                      {/* These would be dynamically generated from the analysis */}
                      <span className="bg-muted px-2 py-1 rounded-full text-sm">Relations familiales</span>
                      <span className="bg-muted px-2 py-1 rounded-full text-sm">Anxiété</span>
                      <span className="bg-muted px-2 py-1 rounded-full text-sm">Deuil</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-muted-foreground">
                    <p>Cette séance n'a pas encore été analysée.</p>
                    <p className="mt-2">Utilisez la fonction d'analyse pour générer un résumé et identifier les thèmes abordés.</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDialog;
