import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneratedBackground, GeneratedStory, StoryFormData } from "@/types/patient";
import { Calendar, Heart, Home, GraduationCap, Plus, Wand2, FileText, Book, Sparkles } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface HistoryTabProps {
  patientId: string;
  histories: GeneratedBackground[];
  isGeneratingBackground: boolean;
  generatePatientBackground: () => void;
}

const storyFormSchema = z.object({
  title: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères",
  }),
  type: z.enum(["children", "adult", "therapeutic"], {
    required_error: "Veuillez sélectionner un type d'histoire",
  }),
  additionalContext: z.string().optional(),
});

const sampleStories: GeneratedStory[] = [
  {
    id: "1",
    patientId: "1",
    title: "Le voyage de Pierre",
    content: "Introduction à l'histoire thérapeutique...",
    type: "therapeutic",
    createdAt: new Date("2023-05-15"),
    pages: [
      "Il était une fois un petit garçon nommé Pierre qui vivait dans une maison où tout le monde semblait toujours pressé. Sa maman, qu'il aimait beaucoup, attendait toujours qu'il soit le meilleur à l'école.",
      "Un jour, Pierre rencontra un vieil homme sage qui lui dit: \"Tu n'as pas besoin d'être parfait pour être aimé\". Pierre ne comprit pas tout de suite ces paroles.",
      "À l'école, Pierre essayait toujours d'avoir les meilleures notes, mais parfois il n'y arrivait pas, et cela le rendait très triste. Il pensait que sa maman l'aimerait moins.",
      "Le vieil homme apparaissait parfois dans ses rêves et lui racontait des histoires sur des enfants qui apprenaient à s'aimer tels qu'ils étaient, avec leurs forces et leurs faiblesses.",
      "Petit à petit, Pierre comprit qu'il était précieux, même quand il faisait des erreurs. Il apprit à se pardonner et à voir la fierté dans les yeux de sa maman, même lorsqu'il ne réussissait pas parfaitement."
    ]
  }
];

const storyTemplates = [
  { id: "1", title: "Voyage initiatique", type: "children", description: "Histoire d'un personnage qui apprend à se connaître à travers un voyage" },
  { id: "2", title: "Métaphore du jardin intérieur", type: "therapeutic", description: "Histoire thérapeutique utilisant la métaphore d'un jardin à cultiver" },
  { id: "3", title: "Récit de résilience", type: "adult", description: "Histoire pour adulte centrée sur le dépassement d'une épreuve difficile" }
];

const HistoryTab = ({ patientId, histories, isGeneratingBackground, generatePatientBackground }: HistoryTabProps) => {
  const [selectedTab, setSelectedTab] = useState<"stories" | "histories">("stories");
  const [selectedHistory, setSelectedHistory] = useState<GeneratedBackground | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [stories, setStories] = useState<GeneratedStory[]>(sampleStories.filter(s => s.patientId === patientId));
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isStoryFormOpen, setIsStoryFormOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<GeneratedStory | null>(null);
  const [isViewStoryDialogOpen, setIsViewStoryDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  const storyForm = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      title: "",
      type: "therapeutic",
      additionalContext: "",
    },
  });
  
  const handleViewHistory = (history: GeneratedBackground) => {
    setSelectedHistory(history);
    setIsViewDialogOpen(true);
  };
  
  const handleViewStory = (story: GeneratedStory) => {
    setSelectedStory(story);
    setCurrentPage(0);
    setIsViewStoryDialogOpen(true);
  };
  
  const generateStory = (data: StoryFormData) => {
    setIsGeneratingStory(true);
    setIsStoryFormOpen(false);
    
    // Simulate story generation
    setTimeout(() => {
      const newStory: GeneratedStory = {
        id: Date.now().toString(),
        patientId,
        title: data.title,
        content: "Contenu généré par l'IA",
        type: data.type,
        createdAt: new Date(),
        pages: [
          "Page 1: Il était une fois un enfant nommé Alex qui se sentait différent des autres. Dans sa famille, on lui demandait toujours d'être parfait, surtout sa mère qui avait de grandes attentes.",
          "Page 2: Alex avait une sœur qui semblait toujours faire les choses correctement. Cela rendait Alex triste et parfois en colère. Un jour, Alex rencontra un vieil arbre dans le parc.",
          "Page 3: L'arbre semblait comprendre Alex sans même qu'il ait besoin de parler. \"Chaque branche de mon être est unique,\" murmura l'arbre, \"certaines sont tordues, d'autres droites, mais toutes font partie de moi.\"",
          "Page 4: Petit à petit, Alex comprit que ses imperfections étaient ce qui le rendait spécial. Il commença à s'accepter tel qu'il était, avec ses forces et ses faiblesses.",
          "Page 5: Quand Alex rentra chez lui avec cette nouvelle compréhension, quelque chose avait changé. Ce n'était pas sa famille, mais la façon dont il se voyait lui-même. Il savait maintenant qu'il était précieux, exactement tel qu'il était."
        ]
      };
      
      setStories(prev => [newStory, ...prev]);
      setIsGeneratingStory(false);
      toast.success("Histoire générée avec succès");
    }, 3000);
  };
  
  const nextPage = () => {
    if (selectedStory && currentPage < selectedStory.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const onStoryFormSubmit = (data: z.infer<typeof storyFormSchema>) => {
    const storyData: StoryFormData = {
      title: data.title,
      type: data.type,
      additionalContext: data.additionalContext
    };
    
    generateStory(storyData);
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue={selectedTab} value={selectedTab} onValueChange={(value) => setSelectedTab(value as "stories" | "histories")} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="stories">
            <Book className="h-4 w-4 mr-2" />
            Contes thérapeutiques
          </TabsTrigger>
          <TabsTrigger value="histories">
            <FileText className="h-4 w-4 mr-2" />
            Historiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Contes thérapeutiques</CardTitle>
                  <CardDescription>Contes personnalisés basés sur les historiques du patient</CardDescription>
                </div>
                <Button 
                  onClick={() => setIsStoryFormOpen(true)}
                  disabled={isGeneratingStory}
                >
                  {isGeneratingStory ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Nouveau conte
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {stories.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stories.map((story) => (
                      <TableRow key={story.id} className="cursor-pointer hover:bg-muted/60">
                        <TableCell>
                          {format(story.createdAt, 'PPP', { locale: fr })}
                        </TableCell>
                        <TableCell>{story.title}</TableCell>
                        <TableCell>
                          {story.type === "children" ? "Enfant" : 
                           story.type === "adult" ? "Adulte" : "Thérapeutique"}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleViewStory(story)}>
                            <Book className="h-4 w-4 mr-1" />
                            Lire
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Aucun conte thérapeutique n'a encore été généré pour ce patient.</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setIsStoryFormOpen(true)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer un conte
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="histories" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Historiques générés</CardTitle>
                  <CardDescription>Résumés du parcours du patient générés par l'IA</CardDescription>
                </div>
                <Button 
                  onClick={generatePatientBackground}
                  disabled={isGeneratingBackground}
                >
                  {isGeneratingBackground ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouvel historique
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {histories.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {histories.map((history) => (
                      <TableRow key={history.id} className="cursor-pointer hover:bg-muted/60">
                        <TableCell>
                          {history.createdAt ? (
                            format(history.createdAt, 'PPP', { locale: fr })
                          ) : (
                            "Date inconnue"
                          )}
                        </TableCell>
                        <TableCell>{history.title || "Historique patient"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleViewHistory(history)}>
                            <FileText className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Aucun historique n'a encore été généré pour ce patient.</p>
                  <Button 
                    className="mt-4" 
                    onClick={generatePatientBackground}
                    disabled={isGeneratingBackground}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Générer un historique
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedHistory?.title || "Historique patient"}</DialogTitle>
            <DialogDescription>
              {selectedHistory?.createdAt ? (
                `Généré le ${format(selectedHistory.createdAt, 'PPP', { locale: fr })}`
              ) : (
                "Généré par intelligence artificielle"
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedHistory && (
            <div className="space-y-6 py-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <h3 className="font-medium mb-2">Résumé</h3>
                <p className="text-sm">{selectedHistory.summary}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {selectedHistory.sections.map((section, index) => {
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
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isStoryFormOpen} onOpenChange={setIsStoryFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Générer un nouveau conte</DialogTitle>
            <DialogDescription>
              Créez un conte thérapeutique personnalisé basé sur l'historique du patient.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...storyForm}>
            <form onSubmit={storyForm.handleSubmit(onStoryFormSubmit)} className="space-y-4">
              <FormField
                control={storyForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de l'histoire</FormLabel>
                    <FormControl>
                      <Input placeholder="Le voyage intérieur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={storyForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'histoire</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="children">Pour enfant</SelectItem>
                        <SelectItem value="adult">Pour adulte</SelectItem>
                        <SelectItem value="therapeutic">Thérapeutique</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choisissez le style et le public cible de l'histoire.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={storyForm.control}
                name="additionalContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contexte supplémentaire (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notez ici toute information spécifique à inclure dans l'histoire..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ajoutez des éléments particuliers que vous souhaitez voir apparaître dans l'histoire.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Modèles disponibles</h3>
                <div className="grid grid-cols-1 gap-2">
                  {storyTemplates.map((template) => (
                    <div 
                      key={template.id} 
                      className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-muted/30"
                      onClick={() => storyForm.setValue("title", template.title)}
                    >
                      <div>
                        <p className="font-medium">{template.title}</p>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="mt-1">
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">
                            {template.type === "children" ? "Enfant" : 
                             template.type === "adult" ? "Adulte" : "Thérapeutique"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isGeneratingStory}>
                  Générer l'histoire
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isViewStoryDialogOpen} onOpenChange={setIsViewStoryDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedStory?.title}</DialogTitle>
            <DialogDescription>
              {selectedStory?.createdAt ? (
                `Généré le ${format(selectedStory.createdAt, 'PPP', { locale: fr })}`
              ) : ""}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStory && (
            <div className="py-4">
              <div className="relative h-[400px] border rounded-lg p-6 bg-muted/20 flex flex-col">
                <div className="flex-1 overflow-y-auto prose max-w-none">
                  <p className="text-lg leading-relaxed">
                    {selectedStory.pages[currentPage]}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={currentPage === 0}
                    >
                      Page précédente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={currentPage === selectedStory.pages.length - 1}
                    >
                      Page suivante
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage + 1} sur {selectedStory.pages.length}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewStoryDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryTab;
