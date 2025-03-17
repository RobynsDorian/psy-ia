
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { UserRound, Heart, Users, FileDown } from "lucide-react";

interface Relationship {
  name: string;
  relation: string;
  description: string;
  connections: string[];
}

interface RelationshipMapProps {
  relationships: Relationship[];
  onExport: () => void;
}

const RelationshipMap = ({ relationships, onExport }: RelationshipMapProps) => {
  const [activeTab, setActiveTab] = useState("list");
  
  return (
    <Card className="w-full overflow-hidden border rounded-xl">
      <CardHeader className="bg-secondary/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Relations du patient</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={onExport}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
        <CardDescription>
          Informations sur les relations personnelles identifiées
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 rounded-none">
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="map">Genogramme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="p-6 space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {relationships.length > 0 ? (
                relationships.map((relation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="glass-panel p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <UserRound className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{relation.name}</div>
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
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center p-12 text-muted-foreground">
                  Aucune relation n'a encore été identifiée. Veuillez analyser une transcription.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="p-6">
            <div className="glass-panel p-6 h-80 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Génogramme</h3>
                  <p className="text-sm text-muted-foreground">
                    Représentation visuelle des relations familiales et sociales basée sur les données analysées
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RelationshipMap;
