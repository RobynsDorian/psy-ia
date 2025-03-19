
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import { Patient, Appointment } from "@/types/patient";

// Données d'exemple pour les patients récents
const recentPatients: Patient[] = [
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
  }
];

// Données d'exemple pour les rendez-vous à venir
const upcomingAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Patient #426247",
    patientCode: "426247",
    date: new Date(new Date().setHours(new Date().getHours() + 3)),
    duration: 45,
    notes: "Suivi régulier",
    status: "scheduled"
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Patient #782523",
    patientCode: "782523",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    duration: 60,
    notes: "Premier rendez-vous",
    status: "scheduled"
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Patient #934721",
    patientCode: "934721",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    duration: 30,
    status: "scheduled"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Format de date pour les rendez-vous
  const formatAppointmentDate = (date: Date) => {
    const isToday = new Date().toDateString() === date.toDateString();
    
    if (isToday) {
      return `Aujourd'hui à ${format(date, 'HH:mm')}`;
    }
    
    const isTomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() === date.toDateString();
    
    if (isTomorrow) {
      return `Demain à ${format(date, 'HH:mm')}`;
    }
    
    return format(date, "EEEE d MMMM à HH:mm", { locale: fr });
  };
  
  const handleViewPatient = (patientId: string) => {
    navigate(`/patient/${patientId}`);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">Aperçu de votre activité</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Colonne de gauche - 8/12 */}
          <div className="md:col-span-8 space-y-8">
            {/* Prochains rendez-vous */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-secondary/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-medium">Prochains rendez-vous</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => navigate('/appointments')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Voir tous
                  </Button>
                </div>
                <CardDescription>
                  Les prochains rendez-vous planifiés
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                {upcomingAppointments.length > 0 ? (
                  <div className="divide-y">
                    {upcomingAppointments.slice(0, 5).map((appointment, index) => (
                      <div key={appointment.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <div className="font-medium">{appointment.patientCode}</div>
                              <div className="text-xs bg-muted px-2 py-0.5 rounded">Patient</div>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1.5" />
                              {formatAppointmentDate(appointment.date)}
                              <span className="mx-1.5">•</span>
                              <span>{appointment.duration} min</span>
                            </div>
                            {appointment.notes && (
                              <div className="mt-2 text-sm">{appointment.notes}</div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/appointments/edit/${appointment.id}`)}
                            >
                              Modifier
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleViewPatient(appointment.patientId)}
                            >
                              Voir le dossier
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>Aucun rendez-vous à venir</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/appointments/new')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Ajouter un rendez-vous
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Colonne de droite - 4/12 */}
          <div className="md:col-span-4 space-y-8">
            {/* Patients récents */}
            <Card>
              <CardHeader className="bg-secondary/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-medium">Patients récents</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => navigate('/patients')}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentPatients.map((patient) => (
                    <div 
                      key={patient.id} 
                      className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/patient/${patient.id}`)}
                    >
                      <div className="font-medium">
                        Patient #{patient.code}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <span>Dernière mise à jour: {format(patient.updatedAt, 'dd/MM/yyyy')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/patients')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gérer les patients
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/appointments')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Gérer les rendez-vous
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;
