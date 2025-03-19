
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, ArrowUp, ArrowDown, Users } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { PatientForm } from "@/components/patients/PatientForm";
import { Patient } from "@/types/patient";

// Exemple patient data
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

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"code" | "createdAt" | "updatedAt">("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Generate random patient code
  const generatePatientCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Handle adding a new patient
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

  // Handle sorting
  const handleSort = (field: "code" | "createdAt" | "updatedAt") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Open patient file
  const handleOpenPatientFile = (id: string) => {
    navigate(`/patient/${id}`);
  };

  // Filter patients by search term
  const filteredPatients = patients.filter(patient => 
    patient.code.includes(searchTerm) ||
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortField === "code") {
      return sortDirection === "asc" 
        ? a.code.localeCompare(b.code) 
        : b.code.localeCompare(a.code);
    } else {
      const dateA = sortField === "createdAt" ? a.createdAt : a.updatedAt;
      const dateB = sortField === "createdAt" ? b.createdAt : b.updatedAt;
      return sortDirection === "asc" 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    }
  });

  // Render sort icon
  const renderSortIcon = (field: "code" | "createdAt" | "updatedAt") => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

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
                {sortedPatients.length === 0 
                  ? "Aucun patient trouvé" 
                  : `Liste des patients (${sortedPatients.length})`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[100px] cursor-pointer" 
                    onClick={() => handleSort("code")}
                  >
                    <div className="flex items-center gap-1">
                      Code {renderSortIcon("code")}
                    </div>
                  </TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Âge</TableHead>
                  <TableHead 
                    className="w-[150px] cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="mr-1" />
                      Date d'ajout {renderSortIcon("createdAt")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[150px] cursor-pointer"
                    onClick={() => handleSort("updatedAt")}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="mr-1" />
                      Dernière MAJ {renderSortIcon("updatedAt")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun patient ne correspond à votre recherche
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedPatients.map((patient) => (
                    <TableRow 
                      key={patient.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleOpenPatientFile(patient.id)}
                    >
                      <TableCell className="font-medium">{patient.code}</TableCell>
                      <TableCell>{patient.lastName}</TableCell>
                      <TableCell>{patient.firstName}</TableCell>
                      <TableCell>{patient.age} ans</TableCell>
                      <TableCell>{patient.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>{patient.updatedAt.toLocaleDateString()}</TableCell>
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

export default Patients;
