
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PatientForm } from "@/components/patients/PatientForm";
import { Patient } from "@/types/patient";

// Données d'exemple pour les patients
const initialPatients: Patient[] = [
  {
    id: "1",
    code: "426247",
    firstName: "Jean",
    lastName: "Dupont",
    age: 45,
    gender: "M",
    notes: "Anxiété chronique, suivi depuis 3 ans",
    createdAt: new Date("2021-03-15"),
    updatedAt: new Date("2023-06-20"),
  },
  {
    id: "2",
    code: "782523",
    firstName: "Marie",
    lastName: "Laurent",
    age: 32,
    gender: "F",
    notes: "Dépression post-partum",
    createdAt: new Date("2022-11-05"),
    updatedAt: new Date("2023-05-18"),
  },
  {
    id: "3",
    code: "934721",
    firstName: "Thomas",
    lastName: "Martin",
    age: 28,
    gender: "M",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
  },
];

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fonction pour générer un code patient aléatoire à 6 chiffres
  const generatePatientCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Gérer l'ajout d'un nouveau patient
  const handleAddPatient = (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setPatients([...patients, newPatient]);
    setIsAddDialogOpen(false);
    toast.success("Patient ajouté avec succès");
  };

  // Gérer la modification d'un patient
  const handleEditPatient = (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentPatient) return;
    
    const updatedPatients = patients.map(patient => 
      patient.id === currentPatient.id 
        ? { ...patient, ...data, updatedAt: new Date() } 
        : patient
    );
    
    setPatients(updatedPatients);
    setIsEditDialogOpen(false);
    setCurrentPatient(null);
    toast.success("Patient modifié avec succès");
  };

  // Gérer la suppression d'un patient
  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(patient => patient.id !== id));
    toast.success("Patient supprimé avec succès");
  };

  // Filtrer les patients en fonction du terme de recherche
  const filteredPatients = patients.filter(patient => 
    patient.code.includes(searchTerm) || 
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main 
        className="flex-1 container mx-auto px-6 py-8 max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Patients</h1>
            <p className="text-muted-foreground">Gérez vos patients et leurs informations</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Nouveau Patient</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un Patient</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du nouveau patient
                </DialogDescription>
              </DialogHeader>
              <PatientForm 
                onSubmit={handleAddPatient}
                initialData={{
                  code: generatePatientCode(),
                  firstName: "",
                  lastName: "",
                  age: 30,
                  gender: "M",
                  notes: ""
                }}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center gap-2">
                <Users size={20} />
                Liste des Patients
              </CardTitle>
              <div className="w-64">
                <Input
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {filteredPatients.length === 0 
                  ? "Aucun patient trouvé" 
                  : `Liste des patients (${filteredPatients.length})`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead className="w-[80px]">Âge</TableHead>
                  <TableHead className="w-[80px]">Genre</TableHead>
                  <TableHead className="w-[150px]">Date d'ajout</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun patient ne correspond à votre recherche
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.code}</TableCell>
                      <TableCell>{patient.lastName}</TableCell>
                      <TableCell>{patient.firstName}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen && currentPatient?.id === patient.id} onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) setCurrentPatient(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setCurrentPatient(patient);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit size={14} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Modifier le Patient</DialogTitle>
                                <DialogDescription>
                                  Modifiez les informations du patient
                                </DialogDescription>
                              </DialogHeader>
                              {currentPatient && (
                                <PatientForm 
                                  onSubmit={handleEditPatient}
                                  initialData={{
                                    code: currentPatient.code,
                                    firstName: currentPatient.firstName,
                                    lastName: currentPatient.lastName,
                                    age: currentPatient.age,
                                    gender: currentPatient.gender,
                                    notes: currentPatient.notes || ""
                                  }}
                                  onCancel={() => {
                                    setIsEditDialogOpen(false);
                                    setCurrentPatient(null);
                                  }}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeletePatient(patient.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.main>
    </div>
  );
};

export default Index;
