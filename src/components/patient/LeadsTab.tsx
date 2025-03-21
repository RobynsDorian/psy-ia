
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface LeadsTabProps {
  patientId: string;
}

const LeadsTab = ({ patientId }: LeadsTabProps) => {
  const [isGeneratingLeads, setIsGeneratingLeads] = useState(false);
  const [therapyLeads, setTherapyLeads] = useState<string[]>([
    "Explorer davantage les relations avec la figure maternelle",
    "Travailler sur les techniques de gestion de l'anxiété",
    "Approfondir le sentiment d'infériorité vis-à-vis de la sœur"
  ]);

  const generateNewLeads = () => {
    setIsGeneratingLeads(true);
    
    // Simuler la génération de pistes par l'IA
    setTimeout(() => {
      setTherapyLeads([
        "Explorer davantage les relations avec la figure maternelle",
        "Travailler sur les techniques de gestion de l'anxiété",
        "Approfondir le sentiment d'infériorité vis-à-vis de la sœur",
        "Aborder les stratégies d'affirmation de soi dans le contexte familial",
        "Explorer l'impact du décès du grand-père sur son système de soutien"
      ]);
      setIsGeneratingLeads(false);
      toast.success("Nouvelles pistes générées");
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Pistes à envisager</CardTitle>
          <CardDescription>
            Suggestions générées par l'IA pour les prochaines séances
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={generateNewLeads}
          disabled={isGeneratingLeads}
        >
          {isGeneratingLeads ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              Génération...
            </>
          ) : (
            <>
              <Sparkles size={14} className="mr-2" />
              Régénérer
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {therapyLeads.map((lead, index) => (
            <li key={index} className="flex items-start">
              <Lightbulb className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{lead}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LeadsTab;
