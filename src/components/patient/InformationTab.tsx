
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient, BackgroundSection, GeneratedBackground } from "@/types/patient";
import { PatientForm } from "@/components/patients/PatientForm";
import { Edit, X } from "lucide-react";
import { toast } from "sonner";

interface InformationTabProps {
  patient: Patient;
  onUpdatePatient: (updatedPatient: Patient) => void;
}

const InformationTab = ({ 
  patient, 
  onUpdatePatient
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
    </div>
  );
};

export default InformationTab;
