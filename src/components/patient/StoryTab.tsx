
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, BookOpen, Download, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { GeneratedStory } from "@/types/patient";

interface StoryTabProps {
  patientId: string;
  stories: GeneratedStory[];
}

const StoryTab = ({ patientId, stories = [] }: StoryTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewingStory, setIsViewingStory] = useState(false);
  const [selectedStory, setSelectedStory] = useState<GeneratedStory | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    objectives: "",
    morals: "",
    additionalNotes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateStory = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newStory: GeneratedStory = {
        id: Date.now().toString(),
        patientId,
        title: formData.title,
        type: "therapeutic",
        content: "Il était une fois un petit animal nommé Léo...",
        createdAt: new Date(),
        pages: [
          "Il était une fois un petit animal nommé Léo. Léo était un jeune renard très intelligent, mais qui avait beaucoup de mal à faire confiance aux autres animaux de la forêt.",
          "Un jour, alors qu'une tempête menaçait, Léo dut accepter l'aide d'autres animaux pour mettre son terrier à l'abri.",
          "Grâce à cette expérience, Léo comprit que faire confiance aux autres pouvait parfois être nécessaire et bénéfique."
        ]
      };
      
      // Reset form and close dialog
      setFormData({
        title: "",
        objectives: "",
        morals: "",
        additionalNotes: ""
      });
      
      setIsGenerating(false);
      setIsDialogOpen(false);
      toast.success("Conte thérapeutique généré avec succès");
      
      // In a real app, you would update the stories state or trigger a refetch
    }, 3000);
  };

  const handleExportStory = (story: GeneratedStory) => {
    // Create a text file with the story content
    const content = story.pages.join("\n\n");
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${story.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success("Conte thérapeutique exporté");
  };

  const handleViewStory = (story: GeneratedStory) => {
    setSelectedStory(story);
    setCurrentPage(0);
    setIsViewingStory(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Contes thérapeutiques</CardTitle>
            <CardDescription>Histoires générées pour ce patient</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Créer un conte
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          {stories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell className="font-medium">{story.title}</TableCell>
                    <TableCell>
                      {format(story.createdAt, 'PPP', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewStory(story)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExportStory(story)}>
                          <Download className="h-4 w-4 mr-1" />
                          Exporter
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 opacity-30 mb-2" />
              <p>Aucun conte thérapeutique n'a encore été créé pour ce patient.</p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                Créer votre premier conte
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour créer un nouveau conte */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un conte thérapeutique</DialogTitle>
            <DialogDescription>
              Définissez les paramètres pour le conte que vous souhaitez générer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Titre</label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Titre du conte"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="objectives" className="text-sm font-medium">Objectif(s)</label>
              <Textarea
                id="objectives"
                name="objectives"
                value={formData.objectives}
                onChange={handleInputChange}
                placeholder="Quels sont les objectifs thérapeutiques de ce conte?"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="morals" className="text-sm font-medium">Morale(s)</label>
              <Textarea
                id="morals"
                name="morals"
                value={formData.morals}
                onChange={handleInputChange}
                placeholder="Quelles sont les morales ou leçons que le patient doit comprendre?"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="additionalNotes" className="text-sm font-medium">Notes additionnelles</label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Informations additionnelles pour guider la génération"
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleCreateStory} 
              disabled={!formData.title || !formData.objectives || isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  <span>Génération en cours...</span>
                </div>
              ) : "Générer le conte"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour voir un conte */}
      <Dialog open={isViewingStory} onOpenChange={setIsViewingStory}>
        <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedStory?.title}</DialogTitle>
            <DialogDescription>
              Conte thérapeutique généré le {selectedStory && format(selectedStory.createdAt, 'PPP', { locale: fr })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/30 p-6 rounded-lg">
              {selectedStory?.pages && selectedStory.pages[currentPage]}
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                disabled={currentPage === 0} 
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              >
                Page précédente
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} sur {selectedStory?.pages?.length || 1}
              </span>
              <Button 
                variant="outline" 
                disabled={!selectedStory?.pages || currentPage >= selectedStory.pages.length - 1} 
                onClick={() => setCurrentPage(prev => 
                  selectedStory?.pages ? Math.min(selectedStory.pages.length - 1, prev + 1) : prev
                )}
              >
                Page suivante
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewingStory(false)}>
              Fermer
            </Button>
            <Button onClick={() => selectedStory && handleExportStory(selectedStory)}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoryTab;
