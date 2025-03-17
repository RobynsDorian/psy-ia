
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { FileText, FileDown, Calendar, GraduationCap, Home, Heart } from "lucide-react";

interface BackgroundSection {
  title: string;
  content: string;
  icon: "calendar" | "graduation" | "home" | "heart";
}

interface BackgroundSummaryProps {
  summary: string;
  sections: BackgroundSection[];
  onExport: () => void;
}

const iconMap = {
  calendar: Calendar,
  graduation: GraduationCap,
  home: Home,
  heart: Heart,
};

const BackgroundSummary = ({ summary, sections, onExport }: BackgroundSummaryProps) => {
  return (
    <Card className="w-full overflow-hidden border rounded-xl">
      <CardHeader className="bg-secondary/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Résumé de l'historique</CardTitle>
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
          Synthèse des éléments biographiques du patient
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          <ScrollArea className="h-48 rounded-lg border p-4">
            <div className="text-sm leading-relaxed">
              {summary || "Aucun résumé disponible. Veuillez analyser une transcription."}
            </div>
          </ScrollArea>
          
          <div className="grid gap-4 md:grid-cols-2">
            {sections.length > 0 ? (
              sections.map((section, index) => {
                const Icon = iconMap[section.icon];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="glass-panel p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{section.title}</div>
                        <p className="text-sm">{section.content}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-2 text-center p-12 text-muted-foreground">
                Aucune section n'a encore été créée. Veuillez analyser une transcription.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundSummary;
