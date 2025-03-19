
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Appointment } from "@/types/patient";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Veuillez sélectionner un patient"),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format de l'heure invalide (HH:MM)"),
  duration: z.coerce.number().min(15, "15 minutes minimum").max(120, "120 minutes maximum"),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

// Patients d'exemple pour le sélecteur
const samplePatients = [
  { id: "1", code: "426247", name: "Jean Dupont" },
  { id: "2", code: "782523", name: "Marie Laurent" },
  { id: "3", code: "934721", name: "Thomas Martin" },
];

interface AppointmentFormProps {
  initialData?: Partial<Appointment>;
  onSubmit: (data: Omit<Appointment, 'id'>) => void;
  onCancel: () => void;
}

const AppointmentForm = ({ initialData, onSubmit, onCancel }: AppointmentFormProps) => {
  const [date, setDate] = useState<Date | undefined>(initialData?.date || new Date());
  
  // Parse initial time if available
  const initialTime = initialData?.date
    ? format(initialData.date, "HH:mm")
    : format(new Date().setMinutes(Math.ceil(new Date().getMinutes() / 15) * 15), "HH:mm");
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: initialData?.patientId || "",
      date: initialData?.date || new Date(),
      time: initialTime,
      duration: initialData?.duration || 45,
      notes: initialData?.notes || "",
    },
  });
  
  const handleFormSubmit = (values: AppointmentFormValues) => {
    // Combine date and time
    const [hours, minutes] = values.time.split(':').map(Number);
    const combinedDate = new Date(values.date);
    combinedDate.setHours(hours, minutes);
    
    // Find patient details
    const selectedPatient = samplePatients.find(p => p.id === values.patientId);
    
    const appointmentData: Omit<Appointment, 'id'> = {
      patientId: values.patientId,
      patientName: selectedPatient?.name,
      patientCode: selectedPatient?.code,
      date: combinedDate,
      duration: values.duration,
      notes: values.notes,
      status: "scheduled",
    };
    
    onSubmit(appointmentData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {samplePatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionnez une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDate(date);
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure</FormLabel>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input {...field} placeholder="HH:MM" className="pl-10" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée (minutes)</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une durée" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="90">1 heure 30</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ajoutez des notes concernant ce rendez-vous..." 
                  className="resize-none h-20" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? "Mettre à jour" : "Ajouter"} le rendez-vous
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentForm;
