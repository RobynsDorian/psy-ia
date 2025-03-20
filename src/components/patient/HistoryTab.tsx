
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryTabProps {
  patientId: string;
  histories: GeneratedBackground[];
  isGeneratingBackground: boolean;
  generatePatientBackground: () => void;
}

const sampleStories: GeneratedStory[] = [
  {
    id: "1",
    patientId: "1",
    title: "Le voyage intérieur",
    type: "therapeutic",
    content: "Il était une fois, dans un pays lointain...",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    pages: ["Il était une fois, dans un pays lointain...", "Le héros découvre...", "À la fin..."]
  },
  {
    id: "2",
    patientId: "1",
    title: "L'arbre de la sagesse",
    type: "children",
    content: "Un petit garçon nommé Léo...",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    pages: ["Un petit garçon nommé Léo...", "Un jour, il rencontra...", "Cette rencontre lui apprit..."]
  },
];

const storyTemplates = [
  {
    id: "template-1",
    title: "Le voyage du héros",
    type: "therapeutic" as const,
    description: "Une histoire de transformation personnelle à travers des épreuves.",
  },
  {
    id: "template-2",
    title: "Le secret de la forêt enchantée",
    type: "children" as const,
    description: "Une aventure magique pour les enfants, pleine de leçons de vie.",
  },
  {
    id: "template-3",
    title: "La quête de soi",
    type: "adult" as const,
    description: "Une histoire introspective pour les adultes, explorant les thèmes de l'identité et du but.",
  },
];

const storyFormSchema = z.object({
  title: z.string().min(3, {
    message: "Le titre doit comporter au moins 3 caractères.",
  }),
  type: z.enum(["children", "adult", "therapeutic"]).default("therapeutic"),
  additionalContext: z.string().optional(),
});

const HistoryTab = ({ patientId, histories, isGeneratingBackground, generatePatientBackground }: HistoryTabProps) => {
  const [selectedTab, setSelectedTab] = useState<"stories" | "histories">("stories");
  const [stories, setStories] = useState<GeneratedStory[]>(sampleStories);
  const [isStoryFormOpen, setIsStoryFormOpen] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<GeneratedBackground | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<GeneratedStory | null>(null);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  const storyForm = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      title: "",
      type: "therapeutic",
      additionalContext: "",
    },
  });
  
  const onStoryFormSubmit = (values: z.infer<typeof storyFormSchema>) => {
    setIsGeneratingStory(true);
    
    setTimeout(() => {
      const newStory: GeneratedStory = {
        id: Date.now().toString(),
        patientId: patientId,
        title: values.title,
        type: values.type,
        content: `Ceci est un conte généré automatiquement basé sur le type "${values.type}" et le contexte supplémentaire : ${values.additionalContext || "aucun"}.`,
        createdAt: new Date(),
        pages: [
          "Il était une fois un enfant qui se sentait différent...",
          "Au fil de son aventure, il découvrit...",
          "Cette découverte lui montra que...",
          "À la fin, il comprit que sa différence était sa plus grande force."
        ]
      };
      
      setStories((prevStories) => [newStory, ...prevStories]);
      setIsStoryFormOpen(false);
      setIsGeneratingStory(false);
      toast.success("Conte généré avec succès !");
    }, 3000);
  };
  
  const handleViewStory = (story: GeneratedStory) => {
    setSelectedStory(story);
    setCurrentPage(0);
    setIsStoryDialogOpen(true);
  };
  
  const nextPage = () => {
    if (selectedStory && currentPage < selectedStory.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  return (
    <div className="space-y-4 overflow-x-hidden">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stories.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell>
                        <span className="font-medium">{story.title}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {story.type === "children" ? "Pour enfant" : 
                         story.type === "adult" ? "Pour adulte" : "Thérapeutique"}
                      </TableCell>
                      <TableCell>{format(story.createdAt, "PPP", { locale: fr })}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewStory(story)}
                        >
                          <Book className="h-4 w-4 mr-2" />
                          Lire
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {stories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Aucun conte disponible.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="histories" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Historiques</CardTitle>
                  <CardDescription>Analyses contextuelles du patient</CardDescription>
                </div>
                <Button disabled={isGeneratingBackground} onClick={generatePatientBackground}>
                  {isGeneratingBackground ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Générer l'historique
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead className="hidden md:table-cell">Date de création</TableHead>
                    <TableHead>Résumé</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {histories.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>
                        <button
                          className="hover:underline text-left"
                          onClick={() => {
                            setSelectedHistory(history);
                            setIsHistoryDialogOpen(true);
                          }}
                        >
                          {history.title}
                        </button>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{format(history.createdAt, "PPP", { locale: fr })}</TableCell>
                      <TableCell>{history.summary}</TableCell>
                    </TableRow>
                  ))}
                  {histories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Aucun historique disponible.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{selectedHistory?.title}</DialogTitle>
            <DialogDescription>
              {selectedHistory?.createdAt && format(selectedHistory.createdAt, "PPP", { locale: fr })}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-4">
              {selectedHistory?.sections.map((section) => (
                <div key={section.title} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {section.icon === "home" && <Home className="h-4 w-4" />}
                    {section.icon === "heart" && <Heart className="h-4 w-4" />}
                    {section.icon === "calendar" && <Calendar className="h-4 w-4" />}
                    {section.icon === "graduation" && <GraduationCap className="h-4 w-4" />}
                    <h4 className="text-lg font-semibold">{section.title}</h4>
                  </div>
                  <p>{section.content}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
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
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <Form {...storyForm}>
              <form onSubmit={storyForm.handleSubmit(onStoryFormSubmit)} className="space-y-4 px-1">
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
                      <FormLabel>Notes additionnelles (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notez ici toute information spécifique à inclure dans l'histoire..."
                          {...field}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormDescription>
                        Ajoutez des éléments particuliers que vous souhaitez voir apparaître dans l'histoire.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Modèles disponibles</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {storyTemplates.map((template) => (
                      <div 
                        key={template.id} 
                        className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-muted/30"
                        onClick={() => {
                          storyForm.setValue("title", template.title);
                          storyForm.setValue("type", template.type);
                        }}
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
                
                <DialogFooter className="mt-6 pt-4 border-t">
                  <Button type="submit" disabled={isGeneratingStory}>
                    Générer l'histoire
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>{selectedStory?.title}</DialogTitle>
            <DialogDescription>
              {selectedStory?.createdAt && format(selectedStory.createdAt, "PPP", { locale: fr })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedStory && (
              <div className="border rounded-lg p-6 bg-muted/10">
                <div className="prose max-w-none mb-6">
                  <p className="text-lg">{selectedStory.pages[currentPage]}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={currentPage === 0} 
                      onClick={prevPage}
                    >
                      Page précédente
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!selectedStory.pages || currentPage === selectedStory.pages.length - 1} 
                      onClick={nextPage}
                    >
                      Page suivante
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage + 1} sur {selectedStory.pages.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryTab;
