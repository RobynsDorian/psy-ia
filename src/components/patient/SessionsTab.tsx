
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientSession, Appointment } from "@/types/patient";
import { FileText, Calendar, Plus, Wand2, Filter, Clock, FastForward } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioRecorder from "@/components/audio/AudioRecorder";
import TranscriptionEditor from "@/components/transcription/TranscriptionEditor";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AppointmentForm from "@/components/appointments/AppointmentForm";

interface SessionsTabProps {
  patientId: string;
  patientCode: string;
  sessions: PatientSession[];
}

// Données d'exemple pour les futurs rendez-vous
const sampleFutureAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    duration: 45,
    notes: "Suivi régulier",
    status: "scheduled"
  },
  {
    id: "2",
    patientId: "1",
    date: new Date(new Date().setDate(new Date().getDate() + 21)),
    duration: 60,
    notes: "Évaluation mensuelle",
    status: "scheduled"
  }
];

const SessionsTab = ({ patientId, patientCode, sessions }: SessionsTabProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"list" | "new">("list");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [showFuture, setShowFuture] = useState(true);
  const [futureAppointments, setFutureAppointments] = useState(sampleFutureAppointments);
  
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
  
  const handleAddAppointment = (data: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId,
      ...data
    };
    
    setFutureAppointments([...futureAppointments, newAppointment]);
    setIsAddAppointmentOpen(false);
    toast.success("Rendez-vous ajouté avec succès");
  };
  
  // Combinaison des séances passées et des rendez-vous futurs pour l'affichage
  const getAllSessions = () => {
    const pastSessions = sessions.map(session => ({
      id: session.id,
      date: session.date,
      type: 'past' as const,
      analyzed: !!session.analysis,
      session
    }));
    
    const futureSessionsData = showFuture ? futureAppointments.map(appointment => ({
      id: appointment.id,
      date: appointment.date,
      type: 'future' as const,
      duration: appointment.duration,
      notes: appointment.notes,
      appointment
    })) : [];
    
    return [...pastSessions, ...futureSessionsData].sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  const allSessions = getAllSessions();
  
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
                <CardDescription>Séances précédentes et planifiées</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={showFuture ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFuture(!showFuture)}
                >
                  <FastForward className="mr-2 h-4 w-4" />
                  Rendez-vous futurs
                </Button>
                <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Planifier
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Planifier un rendez-vous</DialogTitle>
                      <DialogDescription>
                        Ajoutez un nouveau rendez-vous pour ce patient
                      </DialogDescription>
                    </DialogHeader>
                    <AppointmentForm 
                      onSubmit={handleAddAppointment}
                      onCancel={() => setIsAddAppointmentOpen(false)}
                      initialData={{
                        patientId: patientId
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button onClick={() => setActiveTab("new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle séance
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {allSessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSessions.map((item) => (
                    <TableRow 
                      key={`${item.type}-${item.id}`} 
                      className={`cursor-pointer hover:bg-muted/60 ${item.type === 'future' ? 'bg-secondary/20' : ''}`}
                    >
                      <TableCell>
                        <div className="font-medium">
                          {format(item.date, 'PPP', { locale: fr })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(item.date, 'HH:mm')}
                          {item.type === 'future' && ` • ${item.duration} min`}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.type === 'past' ? (
                          <div className="text-sm">Séance passée</div>
                        ) : (
                          <div className="flex items-center text-sm text-blue-500">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Rendez-vous
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.type === 'past' ? (
                          item.analyzed ? (
                            <div className="text-emerald-500 text-sm">Analysée</div>
                          ) : (
                            <div className="text-amber-500 text-sm">Non analysée</div>
                          )
                        ) : (
                          <div className="text-blue-500 text-sm">Planifiée</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {item.type === 'past' ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewSession(item.id)}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                              {!item.analyzed && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    localStorage.setItem("transcription", item.session.transcription);
                                    localStorage.setItem("patientId", patientId);
                                    localStorage.setItem("patientCode", patientCode);
                                    navigate(`/patient/${patientId}/analysis`);
                                  }}
                                >
                                  <Wand2 className="h-4 w-4 mr-1" />
                                  Analyser
                                </Button>
                              )}
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  toast.info("Modification du rendez-vous");
                                  // Implement appointment editing logic
                                }}
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => setActiveTab("new")}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Débuter
                              </Button>
                            </>
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
                <div className="mt-4 flex items-center justify-center space-x-4">
                  <Button variant="outline" onClick={() => setIsAddAppointmentOpen(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Planifier un rendez-vous
                  </Button>
                  <Button onClick={() => setActiveTab("new")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Commencer une nouvelle séance
                  </Button>
                </div>
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
