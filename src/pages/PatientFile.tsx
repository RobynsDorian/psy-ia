import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ClipboardList, Calendar, FileText, Users, BookOpen, Sparkles, NetworkChart } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Patient, BackgroundSection, GeneratedBackground, PatientSession, PatientRelationship, GeneratedStory } from "@/types/patient";
import InformationTab from "@/components/patient/InformationTab";
import SessionsTab from "@/components/patient/SessionsTab";
import RelationsTab from "@/components/patient/RelationsTab";
import StoryTab from "@/components/patient/StoryTab";
import LeadsTab from "@/components/patient/LeadsTab";
import GenogramTab from "@/components/patient/GenogramTab";

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

const initialSessions: PatientSession[] = [
  {
    id: "1",
    patientId: "1",
    date: new Date("2023-03-15T14:30:00"),
    transcription: "Première séance avec le patient. Exploration des problèmes d'anxiété.",
    analysis: "Le patient présente des signes d'anxiété chronique liée au travail."
  },
  {
    id: "2",
    patientId: "1",
    date: new Date("2023-04-02T10:15:00"),
    transcription: "Suite du traitement. Le patient évoque des difficultés familiales.",
  }
];

const initialRelationships: PatientRelationship[] = [
  {
    id: "1",
    name: "Marie Dupont",
    relation: "Mère",
    description: "Relation tendue et exigeante. Source d'anxiété pour le patient.",
    connections: ["Paul Dupont", "Julie Dupont"]
  },
  {
    id: "2",
    name: "Paul Dupont",
    relation: "Père",
    description: "Relation distante mais non conflictuelle. Tendance à ne pas s'impliquer dans les disputes familiales.",
    connections: ["Marie Dupont", "Julie Dupont"]
  },
  {
    id: "3",
    name: "Julie Dupont",
    relation: "Sœur",
    description: "Perçue comme la 'préférée'. Relation teintée de jalousie.",
    connections: ["Marie Dupont", "Paul Dupont"]
  }
];

const initialHistories: GeneratedBackground[] = [
  {
    id: "1",
    title: "Première analyse",
    createdAt: new Date("2023-02-10"),
    summary: "Le patient a grandi dans un foyer où les attentes parentales étaient élevées, particulièrement de la part de sa mère. Cette dynamique familiale a créé un sentiment constant de pression et d'insuffisance.",
    sections: [
      {
        title: "Enfance",
        content: "A grandi dans un environnement familial exigeant où les attentes parentales, surtout maternelles, étaient très élevées.",
        icon: "home"
      },
      {
        title: "Relations familiales",
        content: "Relations tendues avec sa mère, plus distantes mais moins conflictuelles avec son père. Rivalité avec sa sœur Julie qui semble être la 'préférée'.",
        icon: "heart"
      }
    ]
  }
];

const PatientFile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isGeneratingBackground, setIsGeneratingBackground] = useState(false);
  const [generatedBackground, setGeneratedBackground] = useState<GeneratedBackground | null>(null);
  const [sessions, setSessions] = useState<PatientSession[]>([]);
  const [relationships, setRelationships] = useState<PatientRelationship[]>([]);
  const [histories, setHistories] = useState<GeneratedBackground[]>([]);
  const [stories, setStories] = useState<GeneratedStory[]>([]);
  
  const sampleStories: GeneratedStory[] = [
    {
      id: "1",
      patientId: "1",
      title: "Léo et la confiance",
      content: "Histoire sur la confiance en soi",
      type: "therapeutic",
      createdAt: new Date("2023-04-15"),
      pages: [
        "Il était une fois un petit animal nommé Léo. Léo était un jeune renard très intelligent, mais qui avait beaucoup de mal à faire confiance aux autres animaux de la forêt.",
        "Un jour, alors qu'une tempête menaçait, Léo dut accepter l'aide d'autres animaux pour mettre son terrier à l'abri.",
        "Grâce à cette expérience, Léo comprit que faire confiance aux autres pouvait parfois être nécessaire et bénéfique."
      ]
    }
  ];
  
  useEffect(() => {
    if (id) {
      const foundPatient = initialPatients.find(p => p.id === id);
      
      if (foundPatient) {
        setPatient(foundPatient);
        
        const patientSessions = initialSessions.filter(s => s.patientId === id);
        setSessions(patientSessions);
        
        if (id === "1") {
          setRelationships(initialRelationships);
          setHistories(initialHistories);
          setStories(sampleStories);
        } else {
          setRelationships([]);
          setHistories([]);
          setStories([]);
        }
        
        if (initialHistories.length > 0 && id === "1") {
          setGeneratedBackground(initialHistories[0]);
        } else {
          setGeneratedBackground(null);
        }
      } else {
        toast.error("Patient non trouvé");
        navigate("/");
      }
    }
  }, [id, navigate]);
  
  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatient(updatedPatient);
    toast.success("Patient mis à jour");
  };
  
  const handleAddRelationship = (relationship: PatientRelationship) => {
    setRelationships(prev => [relationship, ...prev]);
  };
  
  const handleUpdateRelationship = (id: string, updatedData: Partial<PatientRelationship>) => {
    setRelationships(prev => 
      prev.map(rel => 
        rel.id === id ? { ...rel, ...updatedData } : rel
      )
    );
  };
  
  const handleSwitchToRelationsTab = () => {
    setActiveTab("relations");
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
            onClick={() => navigate("/patients")}
            className="rounded-full"
          >
            <ArrowLeft size={18} />
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">Dossier Patient {patient.code}</h1>
            <p className="text-muted-foreground">
              {patient.firstName} {patient.lastName} • {patient.age} ans • {patient.gender === "M" ? "Homme" : patient.gender === "F" ? "Femme" : "Autre"}
            </p>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-6 rounded-xl bg-muted/50 custom-tabs-list">
            <TabsTrigger value="info" className="custom-tab-trigger">
              <ClipboardList className="h-4 w-4 mr-2" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="sessions" className="custom-tab-trigger">
              <Calendar className="h-4 w-4 mr-2" />
              Séances
            </TabsTrigger>
            <TabsTrigger value="relations" className="custom-tab-trigger">
              <Users className="h-4 w-4 mr-2" />
              Relations
            </TabsTrigger>
            <TabsTrigger value="genogram" className="custom-tab-trigger">
              <NetworkChart className="h-4 w-4 mr-2" />
              Génogramme
            </TabsTrigger>
            <TabsTrigger value="stories" className="custom-tab-trigger">
              <BookOpen className="h-4 w-4 mr-2" />
              Contes
            </TabsTrigger>
            <TabsTrigger value="leads" className="custom-tab-trigger">
              <Sparkles className="h-4 w-4 mr-2" />
              Pistes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 custom-tab-content">
            <InformationTab
              patient={patient}
              onUpdatePatient={handleUpdatePatient}
            />
          </TabsContent>
          
          <TabsContent value="sessions" className="custom-tab-content">
            <SessionsTab
              patientId={patient.id}
              patientCode={patient.code}
              sessions={sessions}
            />
          </TabsContent>
          
          <TabsContent value="relations" className="custom-tab-content">
            <RelationsTab
              relationships={relationships}
              onAddRelationship={handleAddRelationship}
              onUpdateRelationship={handleUpdateRelationship}
            />
          </TabsContent>
          
          <TabsContent value="genogram" className="custom-tab-content">
            <GenogramTab
              patientId={patient.id}
              onSwitchToRelationsTab={handleSwitchToRelationsTab}
            />
          </TabsContent>
          
          <TabsContent value="stories" className="custom-tab-content">
            <StoryTab
              patientId={patient.id}
              stories={stories}
            />
          </TabsContent>
          
          <TabsContent value="leads" className="custom-tab-content">
            <LeadsTab patientId={patient.id} />
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  );
};

export default PatientFile;
