
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Header from "@/components/layout/Header";
import RelationshipMap from "@/components/analysis/RelationshipMap";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PatientRelationship } from "@/types/patient";

// PatientAnalysis component
export const PatientAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [relationships, setRelationships] = useState<PatientRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading patient relationships data
    setIsLoading(true);
    
    // Mock data fetch - in a real app this would be an API call
    setTimeout(() => {
      // Sample data for relationships
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
      
      setRelationships(sampleRelationships);
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  const handleExportRelationships = () => {
    try {
      // Create formatted text for export
      const formattedText = relationships.map(r => (
        `Nom: ${r.name}\nRelation: ${r.relation}\nDescription: ${r.description}\nConnections: ${r.connections.join(", ")}\n\n`
      )).join("");
      
      // Create a blob and download link
      const blob = new Blob([formattedText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relations-patient-${id}.txt`;
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
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => navigate(`/patient/${id}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dossier
            </Button>
            <h1 className="text-2xl font-bold">Analyse du patient {id}</h1>
          </div>
          
          <Button
            className="rounded-xl"
            onClick={handleExportRelationships}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exporter l'analyse
          </Button>
        </motion.div>
        
        {isLoading ? (
          <div className="glass-panel p-24 rounded-xl flex flex-col items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg">Chargement des données...</p>
            <p className="text-sm text-muted-foreground mt-2">Extraction des relations du patient</p>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
};
