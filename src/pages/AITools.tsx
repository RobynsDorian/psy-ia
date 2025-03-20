
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Users, Book, Network, Sparkles, SearchIcon } from "lucide-react";

const AITools = () => {
  const [selectedTab, setSelectedTab] = useState("genograms");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyType, setStoryType] = useState("therapeutic");
  const [additionalContext, setAdditionalContext] = useState("");
  
  const patients = [
    { id: "1", code: "MART-S-01" },
    { id: "2", code: "DUBO-L-02" },
    { id: "3", code: "LEFV-E-03" },
    { id: "4", code: "BERN-N-04" },
  ];
  
  const genograms = [
    { id: "1", patientId: "1", patientCode: "MART-S-01", createdAt: new Date("2023-10-25") },
    { id: "2", patientId: "2", patientCode: "DUBO-L-02", createdAt: new Date("2023-11-12") },
  ];
  
  const therapeuticStories = [
    { id: "1", patientId: "1", patientCode: "MART-S-01", title: "Le Voyage Intérieur", createdAt: new Date("2023-10-28") },
    { id: "2", patientId: "3", patientCode: "LEFV-E-03", title: "La Forêt des Émotions", createdAt: new Date("2023-11-15") },
  ];
  
  const handleGenerate = () => {
    if (!selectedPatient) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };
  
  return (
    <motion.div 
      className="container py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Outils IA</h1>
        <p className="text-muted-foreground mt-2">
          Générez et consultez les outils d'intelligence artificielle pour vos patients
        </p>
      </div>
      
      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="genograms" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Génogrammes
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center">
            <Book className="mr-2 h-4 w-4" />
            Contes thérapeutiques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="genograms" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Générer un nouveau génogramme</CardTitle>
              <CardDescription>
                Sélectionnez un patient pour générer ou mettre à jour son génogramme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="patient-select">Code Patient</label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger id="patient-select">
                      <SelectValue placeholder="Sélectionner un code patient" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="additional-info">Informations supplémentaires (optionnel)</label>
                  <Textarea 
                    id="additional-info"
                    placeholder="Ajoutez des détails spécifiques pour le génogramme..."
                    className="resize-none h-24"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerate} 
                disabled={!selectedPatient || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Network className="mr-2 h-4 w-4" />
                    Générer le génogramme
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Génogrammes existants</CardTitle>
                  <CardDescription>
                    Consultez les génogrammes déjà générés pour vos patients
                  </CardDescription>
                </div>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-9 w-[200px]" 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {genograms.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code Patient</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {genograms.map(genogram => (
                      <TableRow key={genogram.id}>
                        <TableCell>{genogram.patientCode}</TableCell>
                        <TableCell>{format(genogram.createdAt, 'PPP', { locale: fr })}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Voir
                            </Button>
                            <Button variant="outline" size="sm">
                              Mettre à jour
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Aucun génogramme n'a encore été généré.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stories" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Générer un nouveau conte thérapeutique</CardTitle>
              <CardDescription>
                Créez un conte personnalisé adapté aux besoins de votre patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="story-patient-select">Code Patient</label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger id="story-patient-select">
                      <SelectValue placeholder="Sélectionner un code patient" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="story-title">Titre du conte</label>
                  <Input 
                    id="story-title" 
                    placeholder="Le voyage intérieur" 
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="story-type">Type de conte</label>
                  <Select value={storyType} onValueChange={setStoryType}>
                    <SelectTrigger id="story-type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="children">Pour enfant</SelectItem>
                      <SelectItem value="adult">Pour adulte</SelectItem>
                      <SelectItem value="therapeutic">Thérapeutique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="story-context">Contexte et thématiques (optionnel)</label>
                  <Textarea 
                    id="story-context"
                    placeholder="Décrivez les thèmes à aborder dans le conte..."
                    className="resize-none h-24"
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerate} 
                disabled={!selectedPatient || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer le conte
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contes thérapeutiques existants</CardTitle>
                  <CardDescription>
                    Consultez les contes déjà générés pour vos patients
                  </CardDescription>
                </div>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-9 w-[200px]" 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {therapeuticStories.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code Patient</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {therapeuticStories.map(story => (
                      <TableRow key={story.id}>
                        <TableCell>{story.patientCode}</TableCell>
                        <TableCell>{story.title}</TableCell>
                        <TableCell>{format(story.createdAt, 'PPP', { locale: fr })}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Lire
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Aucun conte thérapeutique n'a encore été généré.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AITools;
