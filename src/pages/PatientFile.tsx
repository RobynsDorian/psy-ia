
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Edit, Calendar, ClipboardList, FileText, Wand2, Heart, Home, GraduationCap } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AudioRecorder from "@/components/audio/AudioRecorder";
import TranscriptionEditor from "@/components/transcription/TranscriptionEditor";
import { Patient, BackgroundSection, GeneratedBackground } from "@/types/patient";

// Données d'exemple pour les patients (à remplacer par une vraie source de données)
const initialPatients: Patient[] = [
  {
    id: "1",
    code: "426247",
    firstName: "Jean",
    lastName: "Dupont",
    age: 45,
    gender: "M",
    notes: "Anxiété chronique, suivi depuis 3 ans",
    createdAt: new Date("2021-03-15"),
    updatedAt: new Date("2023-06-20"),
  },
  {
    id: "2",
    code: "782523",
    firstName: "Marie",
    lastName: "Laurent",
    age: 32,
    gender: "F",
    notes: "Dépression post-partum",
    createdAt: new Date("2022-11-05"),
    updatedAt: new Date("2023-05-18"),
  },
  {
    id: "3",
    code: "934721",
    firstName: "Thomas",
    lastName: "Martin",
    age: 28,
    gender: "M",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
  },
];

const PatientFile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingBackground, setIsGeneratingBackground] = useState(false);
  const [generatedBackground, setGeneratedBackground] = useState<GeneratedBackground | null>(null);
  
  useEffect(() => {
    // Récupérer les données du patient
    if (id) {
      const foundPatient = initialPatients.find(p => p.id === id);
      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        toast.error("Patient non trouvé");
        navigate("/");
      }
    }
  }, [id, navigate]);
  
  const handleAudioCaptured = (blob: Blob) => {
    setAudioBlob(blob);
    // Simulez une transcription vide au début
    setTranscription("");
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
  
  const handleSaveTranscription = (text: string) => {
    setTranscription(text);
    toast.success("Transcription sauvegardée");
  };
  
  const handleAnalyze = () => {
    // Sauvegardez d'abord la transcription dans le local storage
    localStorage.setItem("transcription", transcription);
    localStorage.setItem("patientId", id || "");
    localStorage.setItem("patientCode", patient?.code || "");
    // Redirigez vers la page d'analyse avec l'ID du patient
    navigate(`/patient/${id}/analysis`);
  };

  const generatePatientBackground = () => {
    if (!patient) return;
    
    setIsGeneratingBackground(true);
    
    // Simulate AI generation with timeout
    setTimeout(() => {
      const sampleBackground: GeneratedBackground = {
        summary: `${patient.firstName} ${patient.lastName} a grandi dans un foyer où les attentes parentales étaient élevées, particulièrement de la part de sa mère. Cette dynamique familiale a créé un sentiment constant de pression et d'insuffisance. La relation avec son père, bien que moins conflictuelle, est marquée par une certaine passivité. ${patient.firstName} a également une sœur nommée Julie qui semble bénéficier d'un traitement préférentiel de la part de la mère, ce qui a généré des sentiments de jalousie et d'injustice. Le grand-père paternel a joué un rôle de soutien émotionnel important, mais son décès récent a laissé un vide significatif.`,
        sections: [
          {
            title: "Enfance",
            content: `${patient.firstName} a grandi dans un environnement familial exigeant où les attentes parentales, surtout maternelles, étaient très élevées. Cette période a façonné sa perception de soi et son estime personnelle.`,
            icon: "home"
          },
          {
            title: "Relations familiales",
            content: `Relations tendues avec sa mère, plus distantes mais moins conflictuelles avec son père. Rivalité avec sa sœur Julie qui semble être la "préférée". Le grand-père paternel était une figure de soutien importante.`,
            icon: "heart"
          },
          {
            title: "Événements marquants",
            content: `Le décès du grand-père paternel l'année dernière a été particulièrement difficile, privant ${patient.firstName} d'une source importante de validation et de soutien émotionnel.`,
            icon: "calendar"
          },
          {
            title: "Parcours personnel",
            content: `${patient.firstName} semble lutter pour trouver sa place et obtenir une reconnaissance, particulièrement au sein de sa famille. Ces difficultés relationnelles pourraient avoir un impact sur d'autres aspects de sa vie comme ses relations sociales ou professionnelles.`,
            icon: "graduation"
          }
        ]
      };
      
      setGeneratedBackground(sampleBackground);
      setIsGeneratingBackground(false);
      toast.success("Historique généré avec succès");
    }, 3000);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-6 py-8 flex items-center justify-center">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main 
        className="flex-1 container mx-auto px-6 py-8 max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft size={18} />
          </Button>
          
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Dossier Patient {patient.code}</h1>
              <Button variant="outline" size="sm" className="rounded-full">
                <Edit size={14} className="mr-2" />
                Modifier
              </Button>
            </div>
            <p className="text-muted-foreground">
              {patient.firstName} {patient.lastName} • {patient.age} ans • {patient.gender === "M" ? "Homme" : patient.gender === "F" ? "Femme" : "Autre"}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Code patient</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{patient.code}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Suivi depuis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatDate(patient.createdAt).split(" ")[0]}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dernière mise à jour</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatDate(patient.updatedAt).split(" ")[0]}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Âge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{patient.age} ans</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3 rounded-xl bg-muted/50">
            <TabsTrigger value="info">
              <ClipboardList className="h-4 w-4 mr-2" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="transcription">
              <FileText className="h-4 w-4 mr-2" />
              Transcription
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Calendar className="h-4 w-4 mr-2" />
              Séances
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Informations confidentielles du patient
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Nom</h3>
                    <p className="text-lg">{patient.lastName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Prénom</h3>
                    <p className="text-lg">{patient.firstName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Âge</h3>
                    <p className="text-lg">{patient.age} ans</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Genre</h3>
                    <p className="text-lg">{patient.gender === "M" ? "Masculin" : patient.gender === "F" ? "Féminin" : "Autre"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>
                  Notes concernant le suivi du patient
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{patient.notes || "Aucune note pour ce patient."}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Historique du patient</CardTitle>
                    <CardDescription>
                      Génération IA d'une histoire personnalisée basée sur les données du patient
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={generatePatientBackground}
                    disabled={isGeneratingBackground}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingBackground ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Wand2 size={16} />
                        Générer un historique
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {generatedBackground ? (
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h3 className="font-medium mb-2">Résumé</h3>
                      <p className="text-sm">{generatedBackground.summary}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {generatedBackground.sections.map((section, index) => {
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
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Aucun historique n'a encore été généré.</p>
                    <p className="text-sm mt-2">Cliquez sur "Générer un historique" pour créer un résumé IA du parcours du patient.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transcription" className="space-y-4">
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
          
          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique des séances</CardTitle>
                <CardDescription>
                  Séances précédentes et leurs analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aucune séance enregistrée pour ce patient.</p>
                  <Button className="mt-4" variant="outline" onClick={() => setActiveTab("transcription")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Commencer une nouvelle transcription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  );
};

export default PatientFile;
