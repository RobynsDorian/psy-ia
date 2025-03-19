import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/patient";
import { Calendar as CalendarIcon, Plus, Clock, Search, Edit, Check, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import WeekView from "@/components/appointments/WeekView";

const sampleAppointments: Appointment[] = [
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
  },
  {
    id: "4",
    patientId: "1",
    patientName: "Patient #426247",
    patientCode: "426247",
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    duration: 45,
    notes: "Suivi bi-mensuel",
    status: "scheduled"
  }
];

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = !searchTerm || 
      appointment.patientCode.includes(searchTerm);
    
    if (activeTab === "calendar" && selectedDate) {
      const appointmentDate = new Date(appointment.date);
      return matchesSearch && 
        appointmentDate.getDate() === selectedDate.getDate() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getFullYear() === selectedDate.getFullYear();
    }
    
    return matchesSearch;
  });
  
  const sortedAppointments = [...filteredAppointments].sort((a, b) => a.date.getTime() - b.date.getTime());
  
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
  
  const handleAddAppointment = (data: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...data
    };
    
    setAppointments([...appointments, newAppointment]);
    setIsAddDialogOpen(false);
    toast.success("Rendez-vous ajouté avec succès");
  };
  
  const handleViewPatient = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };
  
  const handleCloseAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId 
          ? { ...app, status: "completed" } 
          : app
      )
    );
    toast.success("Rendez-vous clôturé avec succès");
  };
  
  const appointmentDates = appointments.map(app => {
    const date = new Date(app.date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });
  
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
            <h1 className="text-3xl font-bold">Gestion des Rendez-vous</h1>
            <p className="text-muted-foreground">Planifiez et gérez vos rendez-vous</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Nouveau Rendez-vous</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter un Rendez-vous</DialogTitle>
                <DialogDescription>
                  Planifiez un nouveau rendez-vous avec un patient
                </DialogDescription>
              </DialogHeader>
              <AppointmentForm 
                onSubmit={handleAddAppointment} 
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="list">Liste</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              <TabsTrigger value="week">Semaine</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par code..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          
          <TabsContent value="list" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Prochains rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedAppointments.length > 0 ? (
                  <div className="space-y-1 divide-y">
                    {sortedAppointments.map((appointment) => (
                      <div key={appointment.id} className="pt-4 first:pt-0 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <div className="font-medium">Patient #{appointment.patientCode}</div>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                              {formatAppointmentDate(appointment.date)}
                              <span className="mx-1.5">•</span>
                              <Clock className="h-3.5 w-3.5 mr-1.5" />
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
                              <Edit className="h-4 w-4 mr-1.5" />
                              Modifier
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleCloseAppointment(appointment.id)}
                            >
                              <Check className="h-4 w-4 mr-1.5" />
                              Clôturer
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleViewPatient(appointment.patientId)}
                            >
                              <FileText className="h-4 w-4 mr-1.5" />
                              Voir le dossier
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? (
                      <p>Aucun rendez-vous ne correspond à votre recherche</p>
                    ) : activeTab === "calendar" && selectedDate ? (
                      <p>Aucun rendez-vous pour le {format(selectedDate, 'PPP', { locale: fr })}</p>
                    ) : (
                      <p>Aucun rendez-vous à venir</p>
                    )}
                    <Button 
                      className="mt-4" 
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un rendez-vous
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{
                      booked: appointmentDates
                    }}
                    modifiersClassNames={{
                      booked: "border-2 border-primary text-primary-foreground font-bold"
                    }}
                    className="pointer-events-auto"
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle>
                    {selectedDate ? (
                      `Rendez-vous du ${format(selectedDate, 'PPP', { locale: fr })}`
                    ) : (
                      "Sélectionnez une date"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sortedAppointments.length > 0 ? (
                    <div className="space-y-4 divide-y">
                      {sortedAppointments.map((appointment) => (
                        <div key={appointment.id} className="pt-4 first:pt-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <div className="font-medium">Patient #{appointment.patientCode}</div>
                              </div>
                              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                <span>{format(appointment.date, 'HH:mm')}</span>
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
                                <Edit className="h-4 w-4 mr-1.5" />
                                Modifier
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleCloseAppointment(appointment.id)}
                              >
                                <Check className="h-4 w-4 mr-1.5" />
                                Clôturer
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleViewPatient(appointment.patientId)}
                              >
                                <FileText className="h-4 w-4 mr-1.5" />
                                Voir le dossier
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Aucun rendez-vous pour cette date</p>
                      <Button 
                        className="mt-4" 
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un rendez-vous
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="mt-0">
            <WeekView 
              appointments={appointments} 
              onCloseAppointment={handleCloseAppointment} 
            />
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  );
};

export default Appointments;
