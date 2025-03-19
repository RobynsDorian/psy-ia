
import { useState, useMemo } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, parse, addWeeks, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileText, Check, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Appointment } from "@/types/patient";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  appointments: Appointment[];
  onCloseAppointment: (id: string) => void;
}

// Heures de travail
const WORK_HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8h à 18h

const WeekView = ({ appointments, onCloseAppointment }: WeekViewProps) => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  
  // Calculer les jours de la semaine courante
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Semaine commence le lundi
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentWeek]);
  
  // Fonction pour naviguer à la semaine suivante
  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };
  
  // Fonction pour naviguer à la semaine précédente
  const goToPrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };
  
  // Fonction pour afficher le rendez-vous d'un patient
  const handleViewPatient = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };
  
  // Filtrer les rendez-vous pour la semaine courante
  const weekAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return weekDays.some(day => isSameDay(day, appointmentDate));
    });
  }, [appointments, weekDays]);
  
  // Obtenir la couleur de l'événement en fonction du code patient
  const getAppointmentColor = (patientCode: string) => {
    const hash = patientCode.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const colors = [
      "bg-blue-100 border-blue-300 text-blue-800",
      "bg-green-100 border-green-300 text-green-800",
      "bg-purple-100 border-purple-300 text-purple-800",
      "bg-yellow-100 border-yellow-300 text-yellow-800",
      "bg-pink-100 border-pink-300 text-pink-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800",
      "bg-red-100 border-red-300 text-red-800",
      "bg-orange-100 border-orange-300 text-orange-800",
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Obtenir la position de l'événement en fonction de l'heure
  const getAppointmentPosition = (appointment: Appointment) => {
    const hour = appointment.date.getHours();
    const minute = appointment.date.getMinutes();
    const top = (hour - 8) * 60 + minute; // Convertir en minutes depuis 8h
    const height = appointment.duration;
    
    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Vue hebdomadaire</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevWeek}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(weekDays[0], "d MMM", { locale: fr })} - {format(weekDays[weekDays.length - 1], "d MMM yyyy", { locale: fr })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextWeek}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* En-têtes des jours de la semaine */}
          {weekDays.map((day, i) => (
            <div 
              key={i} 
              className={cn(
                "p-2 text-center font-medium border-b",
                isSameDay(day, new Date()) && "bg-primary/10 rounded-t-md"
              )}
            >
              <div>{format(day, "EEEE", { locale: fr })}</div>
              <div className="text-sm">{format(day, "d MMM", { locale: fr })}</div>
            </div>
          ))}
          
          {/* Grille du calendrier */}
          <div className="col-span-7 grid grid-cols-7 gap-1 relative mt-1" style={{ height: '700px' }}>
            {/* Lignes d'heures */}
            {WORK_HOURS.map((hour) => (
              <div key={hour} className="absolute w-full border-t border-gray-200" style={{ top: `${(hour-8) * 60}px` }}>
                <div className="absolute -mt-3 -ml-7 text-xs text-gray-500">{hour}:00</div>
              </div>
            ))}
            
            {/* Colonnes des jours */}
            {weekDays.map((day, dayIndex) => (
              <div 
                key={dayIndex} 
                className={cn(
                  "relative h-full border-r",
                  isSameDay(day, new Date()) && "bg-primary/5"
                )}
              >
                {/* Rendez-vous du jour */}
                {weekAppointments
                  .filter(appointment => isSameDay(appointment.date, day))
                  .map((appointment) => {
                    const posStyle = getAppointmentPosition(appointment);
                    return (
                      <div
                        key={appointment.id}
                        className={cn(
                          "absolute left-1 right-1 p-2 rounded-md border text-sm overflow-hidden",
                          getAppointmentColor(appointment.patientCode || "000000")
                        )}
                        style={{
                          top: posStyle.top,
                          height: posStyle.height,
                        }}
                      >
                        <div className="font-medium truncate">
                          Patient #{appointment.patientCode}
                        </div>
                        <div className="text-xs truncate">
                          {format(appointment.date, "HH:mm")} - {format(new Date(appointment.date.getTime() + appointment.duration * 60000), "HH:mm")}
                        </div>
                        {appointment.notes && (
                          <div className="text-xs truncate mt-1">{appointment.notes}</div>
                        )}
                        <div className="absolute bottom-1 right-1 flex gap-1">
                          <Button
                            size="icon" 
                            variant="ghost" 
                            className="h-5 w-5" 
                            onClick={() => navigate(`/appointments/edit/${appointment.id}`)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon" 
                            variant="ghost" 
                            className="h-5 w-5"
                            onClick={() => onCloseAppointment(appointment.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon" 
                            variant="ghost" 
                            className="h-5 w-5"
                            onClick={() => handleViewPatient(appointment.patientId)}
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekView;
