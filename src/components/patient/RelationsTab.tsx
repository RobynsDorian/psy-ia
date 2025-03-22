
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, Heart, Users, FileDown, Plus, Edit, Save, X, Wand2, History, RotateCcw } from "lucide-react";
import { PatientRelationship } from "@/types/patient";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RelationsTabProps {
  relationships: PatientRelationship[];
  onAddRelationship: (relationship: PatientRelationship) => void;
  onUpdateRelationship: (id: string, relationship: Partial<PatientRelationship>) => void;
}

interface RelationVersionHistory {
  id: string;
  date: Date;
  relationships: PatientRelationship[];
  notes?: string;
}

const RelationsTab = ({ relationships, onAddRelationship, onUpdateRelationship }: RelationsTabProps) => {
  const [activeTab, setActiveTab] = useState("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRelationship, setNewRelationship] = useState<Partial<PatientRelationship>>({
    name: "",
    relation: "",
    description: "",
    connections: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [relationVersions, setRelationVersions] = useState<RelationVersionHistory[]>([
    {
      id: "1",
      date: new Date(new Date().setDate(new Date().getDate() - 15)),
      relationships: [...relationships],
      notes: "Version initiale des relations"
    }
  ]);
  
  const handleEdit = (id: string) => {
    setEditingId(id);
    // Find the relationship to edit and set the form values
    const relationshipToEdit = relationships.find(r => r.id === id);
    if (relationshipToEdit) {
      setNewRelationship({ ...relationshipToEdit });
    }
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setNewRelationship({
      name: "",
      relation: "",
      description: "",
      connections: []
    });
  };
  
  const handleSaveEdit = () => {
    if (editingId && newRelationship.name && newRelationship.relation) {
      onUpdateRelationship(editingId, newRelationship);
      setEditingId(null);
      setNewRelationship({
        name: "",
        relation: "",
        description: "",
        connections: []
      });
      toast.success("Relation mise à jour");
      
      // Save a new version in history
      const newVersion: RelationVersionHistory = {
        id: Date.now().toString(),
        date: new Date(),
        relationships: [...relationships],
        notes: "Modification manuelle d'une relation"
      };
      setRelationVersions([...relationVersions, newVersion]);
    } else {
      toast.error("Veuillez remplir tous les champs obligatoires");
    }
  };
  
  const handleAddNew = () => {
    if (newRelationship.name && newRelationship.relation) {
      const connection = newRelationship.connections || [];
      onAddRelationship({
        id: Date.now().toString(),
        name: newRelationship.name || "",
        relation: newRelationship.relation || "",
        description: newRelationship.description || "",
        connections: Array.isArray(connection) ? connection : []
      });
      setNewRelationship({
        name: "",
        relation: "",
        description: "",
        connections: []
      });
      setActiveTab("list");
      toast.success("Nouvelle relation ajoutée");
      
      // Save a new version in history
      const newVersion: RelationVersionHistory = {
        id: Date.now().toString(),
        date: new Date(),
        relationships: [...relationships, {
          id: Date.now().toString(),
          name: newRelationship.name || "",
          relation: newRelationship.relation || "",
          description: newRelationship.description || "",
          connections: Array.isArray(connection) ? connection : []
        }],
        notes: "Ajout manuel d'une relation"
      };
      setRelationVersions([...relationVersions, newVersion]);
    } else {
      toast.error("Veuillez remplir tous les champs obligatoires");
    }
  };
  
  const handleExport = () => {
    toast.success("Export des relations en cours...");
    // Here you would implement the export functionality
  };
  
  const handleInputChange = (field: keyof PatientRelationship, value: string) => {
    setNewRelationship(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleConnectionChange = (value: string) => {
    // Split by commas and trim whitespace
    const connectionsArray = value.split(',').map(c => c.trim()).filter(c => c);
    setNewRelationship(prev => ({
      ...prev,
      connections: connectionsArray
    }));
  };
  
  const handleGenerateRelations = () => {
    setIsGenerating(true);
    
    // Mock AI-generated relationships
    setTimeout(() => {
      const aiGeneratedRelations: PatientRelationship[] = [
        {
          id: Date.now().toString(),
          name: "Sophie Dupont",
          relation: "Mère",
          description: "Relation conflictuelle marquée par des attentes élevées. Source d'anxiété pour le patient.",
          connections: ["Thomas Dupont", "Emma Dupont"]
        },
        {
          id: (Date.now() + 1).toString(),
          name: "Thomas Dupont",
          relation: "Père",
          description: "Relation distante. Peu impliqué dans l'éducation, tendance à éviter les conflits familiaux.",
          connections: ["Sophie Dupont", "Emma Dupont"]
        },
        {
          id: (Date.now() + 2).toString(),
          name: "Emma Dupont",
          relation: "Sœur cadette",
          description: "Relation teintée de jalousie, le patient perçoit qu'elle reçoit plus d'attention parentale.",
          connections: ["Sophie Dupont", "Thomas Dupont"]
        },
        {
          id: (Date.now() + 3).toString(),
          name: "Marie Leclerc",
          relation: "Grand-mère maternelle",
          description: "Relation positive et soutenante, figure d'attachement sécure pour le patient.",
          connections: ["Sophie Dupont"]
        }
      ];
      
      // Add each AI-generated relationship
      aiGeneratedRelations.forEach(relation => {
        onAddRelationship(relation);
      });
      
      // Save a new version in history
      const newVersion: RelationVersionHistory = {
        id: Date.now().toString(),
        date: new Date(),
        relationships: [...aiGeneratedRelations],
        notes: "Relations générées par IA"
      };
      setRelationVersions([...relationVersions, newVersion]);
      
      setIsGenerating(false);
      toast.success("Relations générées avec succès");
    }, 2000);
  };
  
  const handleRestoreVersion = (version: RelationVersionHistory) => {
    // Replace current relationships with the ones from the selected version
    // This would require a function to replace all relationships at once in the parent component
    // For now, we'll just show a toast
    toast.success(`Version du ${version.date.toLocaleDateString()} restaurée`);
    setShowVersionHistory(false);
  };
  
  return (
    <Card className="w-full overflow-hidden border rounded-xl">
      <CardHeader className="bg-secondary/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Relations du patient</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Historique des versions</DialogTitle>
                  <DialogDescription>
                    Consultez et restaurez des versions précédentes des relations
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto">
                  {relationVersions.length > 0 ? (
                    <div className="space-y-2">
                      {relationVersions.map((version) => (
                        <div 
                          key={version.id} 
                          className="p-3 rounded-lg border"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">
                                {version.date.toLocaleDateString()} à {version.date.toLocaleTimeString()}
                              </div>
                              {version.notes && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {version.notes}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">
                                {version.relationships.length} relations
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => handleRestoreVersion(version)}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restaurer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Aucune version disponible
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setShowVersionHistory(true)}
            >
              <History className="h-4 w-4 mr-2" />
              Historique
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={handleGenerateRelations}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Génération...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Générer
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={handleExport}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            
            {activeTab === "list" && (
              <Button
                size="sm"
                className="rounded-xl"
                onClick={() => setActiveTab("add")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Informations sur les relations personnelles identifiées
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none">
            <TabsTrigger value="list" className="flex-1">Liste</TabsTrigger>
            <TabsTrigger value="add" className="flex-1">Ajouter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="p-6 space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {relationships.length > 0 ? (
                relationships.map((relation, index) => (
                  <motion.div
                    key={relation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="glass-panel p-4 border rounded-lg"
                  >
                    {editingId === relation.id ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${relation.id}`}>Nom</Label>
                          <Input 
                            id={`name-${relation.id}`}
                            value={newRelationship.name || ""}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Nom de la personne"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`relation-${relation.id}`}>Relation</Label>
                          <Input 
                            id={`relation-${relation.id}`}
                            value={newRelationship.relation || ""}
                            onChange={(e) => handleInputChange('relation', e.target.value)}
                            placeholder="Type de relation (ex: mère, père, ami)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`description-${relation.id}`}>Description</Label>
                          <Textarea 
                            id={`description-${relation.id}`}
                            value={newRelationship.description || ""}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Description de la relation"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`connections-${relation.id}`}>Liens (séparés par des virgules)</Label>
                          <Input 
                            id={`connections-${relation.id}`}
                            value={newRelationship.connections?.join(', ') || ""}
                            onChange={(e) => handleConnectionChange(e.target.value)}
                            placeholder="Ex: Marie, Jean, etc."
                          />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-1" /> Annuler
                          </Button>
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Save className="h-4 w-4 mr-1" /> Sauvegarder
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <UserRound className="h-4 w-4" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between items-start">
                            <div className="font-medium">{relation.name}</div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(relation.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {relation.relation}
                          </div>
                          <p className="text-sm mt-2">{relation.description}</p>
                          
                          {relation.connections.length > 0 && (
                            <div className="mt-3">
                              <div className="text-xs text-muted-foreground mb-1">Liens avec:</div>
                              <div className="flex flex-wrap gap-1">
                                {relation.connections.map((connection, i) => (
                                  <span 
                                    key={i} 
                                    className="text-xs bg-accent/50 text-accent-foreground px-2 py-0.5 rounded-full"
                                  >
                                    {connection}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center p-12 text-muted-foreground">
                  <p>Aucune relation n'a encore été identifiée.</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button onClick={() => setActiveTab("add")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter manuellement
                    </Button>
                    <Button onClick={handleGenerateRelations} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Générer avec l'IA
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="add" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une nouvelle relation</CardTitle>
                <CardDescription>
                  Entrez les détails de la relation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom*</Label>
                  <Input 
                    id="name"
                    value={newRelationship.name || ""}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nom de la personne"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relation">Relation*</Label>
                  <Input 
                    id="relation"
                    value={newRelationship.relation || ""}
                    onChange={(e) => handleInputChange('relation', e.target.value)}
                    placeholder="Type de relation (ex: mère, père, ami)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={newRelationship.description || ""}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description de la relation"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connections">Liens (séparés par des virgules)</Label>
                  <Input 
                    id="connections"
                    value={newRelationship.connections?.join(', ') || ""}
                    onChange={(e) => handleConnectionChange(e.target.value)}
                    placeholder="Ex: Marie, Jean, etc."
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setActiveTab("list")}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddNew}>
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RelationsTab;
