
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientSession } from "@/types/patient";
import { FileText, Calendar, Plus, Wand2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioRecorder from "@/components/audio/AudioRecorder";
import TranscriptionEditor from "@/components/transcription/TranscriptionEditor";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SessionsTabProps {
  patientId: string;
  patientCode: string;
  sessions: PatientSession[];
}

const SessionsTab = ({ patientId, patientCode, sessions }: SessionsTabProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"list" | "new">("list");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAudioCaptured = (blob: Blob) => {
    setAudioBlob(blob);
    setTranscription("");
  };
  
  const handleSaveTranscription = (text: string) => {
    setTranscription(text);
    toast.success("Transcription sauvegardée");
  };
  
  const transcribeAudio = async () => {
    if (!audioBlob) {
      toast.error("Aucun audio à transcrire");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulez l'appel API de transcription
      setTimeout(() => {
        // Exemple de texte de transcription
        const sampleTranscription = `Patient: Je ne sais pas, c'est compliqué avec ma mère en ce moment. Nous nous disputons beaucoup.
        
Thérapeute: Pouvez-vous me parler davantage de votre relation avec votre mère?

Patient: Eh bien, elle a toujours été très exigeante. Mon père est plus détendu, mais il n'intervient jamais quand elle et moi nous disputons. Ma sœur Julie, elle, a toujours été la préférée. Elle ne subit jamais les mêmes critiques que moi.

Thérapeute: Et comment cela vous fait-il sentir?

Patient: Frustré, principalement. Et triste aussi. J'ai l'impression que rien de ce que je fais n'est jamais assez bien pour ma mère. Mon grand-père paternel était la seule personne qui me soutenait vraiment, mais il est décédé l'année dernière.`;
        
        setTranscription(sampleTranscription);
        setIsProcessing(false);
        toast.success("Transcription terminée");
      }, 3000);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast.error("Erreur lors de la transcription");
      setIsProcessing(false);
    }
  };
  
  const handleAnalyze = () => {
    // Sauvegardez d'abord la transcription dans le local storage
    localStorage.setItem("transcription", transcription);
    localStorage.setItem("patientId", patientId);
    localStorage.setItem("patientCode", patientCode);
    // Redirigez vers la page d'analyse avec l'ID du patient
    navigate(`/patient/${patientId}/analysis`);
  };
  
  const handleViewSession = (sessionId: string) => {
    toast.info("Ouverture de la séance...");
    // Here you would typically load the session data and show it
  };
  
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value: string) => setActiveTab(value as "list" | "new")} className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="list">Séances enregistrées</TabsTrigger>
          <TabsTrigger value="new">Nouvelle séance</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="list" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Historique des séances</CardTitle>
                <CardDescription>Séances précédentes et leurs analyses</CardDescription>
              </div>
              <Button onClick={() => setActiveTab("new")}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle séance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Analysée</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id} className="cursor-pointer hover:bg-muted/60" onClick={() => handleViewSession(session.id)}>
                      <TableCell>
                        <div className="font-medium">
                          {format(session.date, 'PPP', { locale: fr })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(session.date, 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {session.analysis ? (
                          <div className="text-emerald-500 text-sm">Oui</div>
                        ) : (
                          <div className="text-amber-500 text-sm">Non</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          {!session.analysis && (
                            <Button variant="outline" size="sm">
                              <Wand2 className="h-4 w-4 mr-1" />
                              Analyser
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune séance enregistrée pour ce patient.</p>
                <Button className="mt-4" variant="outline" onClick={() => setActiveTab("new")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Commencer une nouvelle transcription
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="new" className="space-y-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Enregistrement audio</CardTitle>
              <CardDescription>
                Enregistrez ou importez un audio de séance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col items-center">
                <AudioRecorder onAudioCaptured={handleAudioCaptured} />
                
                <div className="mt-8 w-full">
                  <Button
                    className="w-full"
                    disabled={!audioBlob || isProcessing}
                    onClick={transcribeAudio}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        <span>Transcription en cours...</span>
                      </div>
                    ) : (
                      "Transcrire l'audio"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Transcription</CardTitle>
              <CardDescription>
                Éditez et validez la transcription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TranscriptionEditor 
                transcription={transcription}
                onSave={handleSaveTranscription}
                onAnalyze={handleAnalyze}
                isProcessing={isProcessing}
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SessionsTab;
