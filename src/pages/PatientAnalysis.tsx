import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import RelationshipMap from "@/components/analysis/RelationshipMap";
import BackgroundSummary from "@/components/analysis/BackgroundSummary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Save } from "lucide-react";
import { PatientRelationship, BackgroundSection } from "@/types/patient";

const PatientAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patientCode, setPatientCode] = useState<string>("");
  const [relationships, setRelationships] = useState<PatientRelationship[]>([]);
  const [summary, setSummary] = useState("");
  const [sections, setSections] = useState<BackgroundSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("relationships");
  
  useEffect(() => {
    // Vérifiez s'il y a une transcription dans le localStorage
    const savedTranscription = localStorage.getItem("transcription");
    const savedPatientId = localStorage.getItem("patientId");
    const savedPatientCode = localStorage.getItem("patientCode");
    
    if (!savedTranscription || !savedPatientId || savedPatientId !== id) {
      toast.error("Aucune transcription à analyser pour ce patient");
      navigate(`/patient/${id}`);
      return;
    }
    
    if (savedPatientCode) {
      setPatientCode(savedPatientCode);
    }
    
    // Simulez l'analyse
    setIsLoading(true);
    setTimeout(() => {
      // Données d'exemple pour les relations
      const sampleRelationships: PatientRelationship[] = [
        {
          id: "1",
          name: "Mère",
          relation: "Relation parentale",
          description: "Relation tendue et compliquée, avec des attentes élevées et des critiques fréquentes.",
          connections: ["Père", "Sœur (Julie)"]
        },
        {
          id: "2",
          name: "Père",
          relation: "Relation parentale",
          description: "Relation plus détendue mais passive, n'intervient pas dans les conflits.",
          connections: ["Mère"]
        },
        {
          id: "3",
          name: "Sœur (Julie)",
          relation: "Relation fraternelle",
          description: "Perçue comme 'la préférée', provoquant des sentiments de jalousie et d'injustice.",
          connections: ["Mère", "Père"]
        },
        {
          id: "4",
          name: "Grand-père paternel",
          relation: "Relation grand-parentale",
          description: "Figure de soutien importante, décédé récemment. Lien affectif fort et mentor musical.",
          connections: ["Père", "Grand-mère paternelle"]
        },
        {
          id: "5",
          name: "Grand-mère paternelle",
          relation: "Relation grand-parentale",
          description: "Relation positive mais limitée par des problèmes de santé.",
          connections: ["Grand-père paternel", "Père"]
        }
      ];
      
      // Données d'exemple pour le résumé biographique
      const sampleSummary = "Le patient décrit une dynamique familiale complexe, marquée par une relation conflictuelle avec sa mère et un sentiment d'injustice face au traitement préférentiel accordé à sa sœur Julie. Le père, bien que décrit comme plus détendu, reste passif dans les conflits familiaux. Le grand-père paternel représentait une figure de soutien et de mentorat importante, particulièrement dans le domaine musical, dont la perte récente a eu un impact significatif. La grand-mère, bien que bienveillante, était moins présente en raison de problèmes de santé.";
      
      // Sections d'exemple pour le résumé biographique
      const sampleSections: BackgroundSection[] = [
        {
          title: "Enfance et éducation",
          content: "A reçu sa première guitare à l'âge de 10 ans, offerte par son grand-père. Semble avoir eu une enfance marquée par des attentes élevées et une pression familiale.",
          icon: "calendar"
        },
        {
          title: "Influences et mentors",
          content: "Le grand-père paternel a joué un rôle crucial dans son développement, particulièrement en lui transmettant sa passion pour la musique.",
          icon: "graduation"
        },
        {
          title: "Dynamique familiale",
          content: "Sentiment d'être moins favorisé que sa sœur Julie. Relation conflictuelle avec sa mère et plus distante avec son père qui reste en retrait.",
          icon: "home"
        },
        {
          title: "Événements marquants",
          content: "Le décès du grand-père l'année précédente représente une perte significative, privant le patient d'un soutien émotionnel important.",
          icon: "heart"
        }
      ];
      
      setRelationships(sampleRelationships);
      setSummary(sampleSummary);
      setSections(sampleSections);
      setIsLoading(false);
    }, 2000);
  }, [id, navigate]);
  
  const handleExportRelationships = () => {
    try {
      // Créez un texte formaté pour l'export
      const formattedText = relationships.map(r => (
        `Nom: ${r.name}\nRelation: ${r.relation}\nDescription: ${r.description}\nConnections: ${r.connections.join(", ")}\n\n`
      )).join("");
      
      // Créez un blob et un lien de téléchargement
      const blob = new Blob([formattedText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relations-patient-${patientCode}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Relations exportées avec succès");
    } catch (error) {
      console.error("Error exporting relationships:", error);
      toast.error("Erreur lors de l'exportation");
    }
  };
  
  const handleExportBackground = () => {
    try {
      // Créez un texte formaté pour l'export
      let formattedText = `RÉSUMÉ BIOGRAPHIQUE - PATIENT ${patientCode}\n\n${summary}\n\n`;
      
      formattedText += "SECTIONS DÉTAILLÉES\n\n";
      sections.forEach(section => {
        formattedText += `${section.title}\n${section.content}\n\n`;
      });
      
      // Créez un blob et un lien de téléchargement
      const blob = new Blob([formattedText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `historique-patient-${patientCode}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Historique exporté avec succès");
    } catch (error) {
      console.error("Error exporting background:", error);
      toast.error("Erreur lors de l'exportation");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-6 max-w-6xl">
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate(`/patient/${id}`)}
              className="rounded-full"
            >
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Analyse Patient {patientCode}</h1>
              <p className="text-muted-foreground">Analyse des relations et de l'historique</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate(`/patient/${id}`)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Nouvelle transcription
            </Button>
            
            <Button
              className="rounded-xl"
              onClick={() => {
                if (activeTab === "relationships") {
                  handleExportRelationships();
                } else {
                  handleExportBackground();
                }
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Exporter l'analyse
            </Button>
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="glass-panel p-24 rounded-xl flex flex-col items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg">Analyse en cours...</p>
            <p className="text-sm text-muted-foreground mt-2">Extraction des relations et de l'historique du patient</p>
          </div>
        ) : (
          <Tabs defaultValue="relationships" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2 rounded-xl bg-muted/50">
              <TabsTrigger value="relationships" className="rounded-l-xl">Relations</TabsTrigger>
              <TabsTrigger value="background" className="rounded-r-xl">Historique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="relationships" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <RelationshipMap
                  relationships={relationships}
                  patientId={id || ""}
                  onExport={handleExportRelationships}
                />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="background" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <BackgroundSummary
                  summary={summary}
                  sections={sections}
                  onExport={handleExportBackground}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default PatientAnalysis;
