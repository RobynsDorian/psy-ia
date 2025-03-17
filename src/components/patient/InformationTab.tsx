
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient, BackgroundSection, GeneratedBackground } from "@/types/patient";
import { PatientForm } from "@/components/patients/PatientForm";
import { Wand2, Heart, Home, GraduationCap, Calendar, Save, Edit, X } from "lucide-react";
import { toast } from "sonner";

interface InformationTabProps {
  patient: Patient;
  onUpdatePatient: (updatedPatient: Patient) => void;
  generatedBackground: GeneratedBackground | null;
  isGeneratingBackground: boolean;
  generatePatientBackground: () => void;
}

const InformationTab = ({ 
  patient, 
  onUpdatePatient, 
  generatedBackground, 
  isGeneratingBackground, 
  generatePatientBackground 
}: InformationTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleFormSubmit = (formData: any) => {
    const updatedPatient = {
      ...patient,
      ...formData,
      updatedAt: new Date()
    };
    onUpdatePatient(updatedPatient);
    setIsEditing(false);
    toast.success("Informations mises à jour");
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Informations confidentielles du patient
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full"
            onClick={handleEditToggle}
          >
            {isEditing ? (
              <>
                <X size={14} className="mr-2" />
                Annuler
              </>
            ) : (
              <>
                <Edit size={14} className="mr-2" />
                Modifier
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <PatientForm
              initialData={{
                code: patient.code,
                firstName: patient.firstName,
                lastName: patient.lastName,
                age: patient.age,
                gender: patient.gender,
                notes: patient.notes
              }}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Nom</h3>
                  <p className="text-lg">{patient.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Prénom</h3>
                  <p className="text-lg">{patient.firstName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Âge</h3>
                  <p className="text-lg">{patient.age} ans</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Genre</h3>
                  <p className="text-lg">{patient.gender === "M" ? "Masculin" : patient.gender === "F" ? "Féminin" : "Autre"}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>
            Notes concernant le suivi du patient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{patient.notes || "Aucune note pour ce patient."}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique du patient</CardTitle>
              <CardDescription>
                Génération IA d'une histoire personnalisée basée sur les données du patient
              </CardDescription>
            </div>
            <Button 
              onClick={generatePatientBackground}
              disabled={isGeneratingBackground}
              className="flex items-center gap-2"
            >
              {isGeneratingBackground ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Génération...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Générer un historique
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {generatedBackground ? (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-muted/30">
                <h3 className="font-medium mb-2">Résumé</h3>
                <p className="text-sm">{generatedBackground.summary}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {generatedBackground.sections.map((section, index) => {
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
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aucun historique n'a encore été généré.</p>
              <p className="text-sm mt-2">Cliquez sur "Générer un historique" pour créer un résumé IA du parcours du patient.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationTab;
