
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, AudioLines, Tag } from "lucide-react";
import { PatientSession } from "@/types/patient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SessionDialogProps {
  session: PatientSession | null;
  open: boolean;
  onClose: () => void;
}

const SessionDialog = ({ session, open, onClose }: SessionDialogProps) => {
  const [activeTab, setActiveTab] = useState("summary");

  // Exemple de thèmes extraits (à remplacer par de vraies données)
  const sessionThemes = [
    "anxiété",
    "relations familiales",
    "conflit avec la mère",
    "sentiment d'infériorité"
  ];

  // Exemple de résumé (à remplacer par de vraies données)
  const sessionSummary = 
    "Le patient a exprimé des inquiétudes concernant sa relation avec sa mère, qu'il décrit comme exigeante et critique. Il se sent constamment comparé à sa sœur Julie, qui semble recevoir un traitement préférentiel. Cette dynamique familiale a créé un sentiment profond d'insuffisance chez le patient. Le décès récent de son grand-père paternel, qui représentait une figure de soutien importante, a exacerbé ses difficultés.";

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Séance du {format(session.date, 'PPP', { locale: fr })}</DialogTitle>
          <DialogDescription>
            {format(session.date, 'HH:mm')}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">
              <FileText className="h-4 w-4 mr-2" />
              Résumé et thèmes
            </TabsTrigger>
            <TabsTrigger value="transcription">
              <AudioLines className="h-4 w-4 mr-2" />
              Transcription complète
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Thèmes abordés</h3>
                <div className="flex flex-wrap gap-2">
                  {sessionThemes.map((theme, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Résumé de la séance</h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm">{sessionSummary}</p>
                </div>
              </div>

              {session.analysis && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Notes additionnelles</h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm">{session.analysis}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transcription" className="pt-4">
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Enregistrement audio</h3>
                <div className="bg-muted/30 rounded-lg p-4 flex justify-center">
                  <audio controls className="w-full max-w-md">
                    <source src="/placeholder-audio.mp3" type="audio/mpeg" />
                    Votre navigateur ne supporte pas l'élément audio.
                  </audio>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Transcription textuelle</h3>
                <ScrollArea className="h-[400px]">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">
                      {session.transcription || 
                      `Aucune transcription disponible pour cette séance.
                      
La transcription de la conversation entre le thérapeute et le patient serait affichée ici dans un format dialogué, permettant de suivre l'évolution de l'échange et les points clés abordés durant la séance.

Exemple:
Patient: Je ne sais pas, c'est compliqué avec ma mère en ce moment. Nous nous disputons beaucoup.
        
Thérapeute: Pouvez-vous me parler davantage de votre relation avec votre mère?

Patient: Eh bien, elle a toujours été très exigeante. Mon père est plus détendu, mais il n'intervient jamais quand elle et moi nous disputons...`}
                    </p>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDialog;
