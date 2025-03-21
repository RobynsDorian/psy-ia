
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, Wand2, Edit2, Check } from "lucide-react";
import { toast } from "sonner";

interface SessionSummaryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

interface CustomAxis {
  id: string;
  name: string;
}

const SessionSummaryForm = ({ open, onClose, onSubmit, isLoading }: SessionSummaryFormProps) => {
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [summaryType, setSummaryType] = useState("standard");
  const [customAxes, setCustomAxes] = useState<CustomAxis[]>([
    { id: "1", name: "Traumatisme" }
  ]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const addCustomAxis = () => {
    setCustomAxes([...customAxes, { id: Date.now().toString(), name: "" }]);
  };

  const removeCustomAxis = (id: string) => {
    setCustomAxes(customAxes.filter(axis => axis.id !== id));
  };

  const updateCustomAxisName = (id: string, name: string) => {
    setCustomAxes(
      customAxes.map(axis => (axis.id === id ? { ...axis, name } : axis))
    );
  };

  const handleGeneratePreview = () => {
    setIsGeneratingPreview(true);
    
    // Simulate API call for generating summary preview
    setTimeout(() => {
      const sampleSummary = `Résumé de la séance généré sur base des données fournies:

Le patient a exprimé des inquiétudes concernant sa relation avec sa mère, qu'il décrit comme exigeante et critique. Il se sent constamment comparé à sa sœur Julie, qui semble recevoir un traitement préférentiel. 

${summaryType === "custom" ? "Axes spécifiques analysés:\n" + customAxes.map(a => `- ${a.name}: Le patient montre des signes de difficulté dans ce domaine`).join("\n") : ""}

Cette dynamique familiale a créé un sentiment profond d'insuffisance chez le patient. Le décès récent de son grand-père paternel, qui représentait une figure de soutien importante, a exacerbé ses difficultés.`;
      
      setGeneratedSummary(sampleSummary);
      setEditedSummary(sampleSummary);
      setIsGeneratingPreview(false);
      setActiveTab("preview");
    }, 1500);
  };

  const handleSubmit = () => {
    onSubmit({
      summaryType,
      customAxes,
      additionalNotes,
      summary: isEditing ? editedSummary : generatedSummary
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Générer un résumé de séance</DialogTitle>
          <DialogDescription>
            Personnalisez les paramètres de génération du résumé de la séance
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "form" | "preview")} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Configuration</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedSummary && !isGeneratingPreview}>
              Prévisualisation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4 pt-4">
            <div className="space-y-4">
              <RadioGroup
                value={summaryType}
                onValueChange={setSummaryType}
                className="space-y-3"
              >
                <div className="flex items-start space-x-2 p-2 rounded-md border border-input">
                  <RadioGroupItem value="standard" id="standard" className="mt-1" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="standard" className="font-medium">
                      Résumé standard
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Génère un résumé général de la séance basé sur les thèmes principaux abordés
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-2 rounded-md border border-input">
                  <RadioGroupItem value="custom" id="custom" className="mt-1" />
                  <div className="grid gap-1.5 leading-none w-full">
                    <Label htmlFor="custom" className="font-medium">
                      Résumé personnalisé
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Spécifiez des axes spécifiques à analyser pendant la génération
                    </p>

                    {summaryType === "custom" && (
                      <div className="space-y-3 mt-2">
                        {customAxes.map((axis) => (
                          <div key={axis.id} className="flex items-center space-x-2">
                            <Input
                              value={axis.name}
                              onChange={(e) => updateCustomAxisName(axis.id, e.target.value)}
                              placeholder="Nom de l'axe (ex: Trauma, Relation...)"
                              className="flex-grow"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCustomAxis(axis.id)}
                              disabled={customAxes.length <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCustomAxis}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un axe
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Notes additionnelles</Label>
                <Textarea
                  id="additionalNotes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Informations supplémentaires pour guider la génération du résumé"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleGeneratePreview}
                disabled={summaryType === "custom" && customAxes.some(a => !a.name) || isGeneratingPreview}
              >
                {isGeneratingPreview ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Générer un aperçu
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Résumé généré</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(!isEditing);
                    if (isEditing) {
                      setGeneratedSummary(editedSummary);
                      toast.success("Modifications appliquées");
                    }
                  }}
                >
                  {isEditing ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Appliquer
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Modifier
                    </>
                  )}
                </Button>
              </div>

              {isEditing ? (
                <Textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              ) : (
                <div className="bg-muted/30 rounded-lg p-4 min-h-[300px] whitespace-pre-wrap">
                  {generatedSummary}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !generatedSummary}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Traitement...
              </>
            ) : (
              "Sauvegarder l'analyse"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionSummaryForm;
