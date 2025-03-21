
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus, Sparkles } from "lucide-react";

interface SessionSummaryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const summarySchema = z.object({
  summaryType: z.enum(["classic", "custom"]),
  customAxes: z.array(z.object({
    name: z.string().min(1, "L'axe ne peut pas être vide"),
    description: z.string().optional()
  })).optional(),
  additionalNotes: z.string().optional()
});

type SummaryFormValues = z.infer<typeof summarySchema>;

const SessionSummaryForm = ({ open, onClose, onSubmit, isLoading }: SessionSummaryFormProps) => {
  const [customAxes, setCustomAxes] = useState<Array<{ name: string; description: string }>>([]);

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summaryType: "classic",
      customAxes: [],
      additionalNotes: ""
    }
  });

  const summaryType = form.watch("summaryType");

  const handleSubmit = (values: SummaryFormValues) => {
    if (values.summaryType === "custom") {
      values.customAxes = customAxes;
    }
    onSubmit(values);
  };

  const addCustomAxis = () => {
    setCustomAxes([...customAxes, { name: "", description: "" }]);
  };

  const removeCustomAxis = (index: number) => {
    setCustomAxes(customAxes.filter((_, i) => i !== index));
  };

  const updateCustomAxis = (index: number, field: 'name' | 'description', value: string) => {
    const updatedAxes = [...customAxes];
    updatedAxes[index][field] = value;
    setCustomAxes(updatedAxes);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Générer un résumé de séance</DialogTitle>
          <DialogDescription>
            Choisissez comment vous souhaitez résumer cette séance
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="summaryType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type de résumé</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="classic" id="classic" />
                        <Label htmlFor="classic">Résumé classique (synthèse générale de la séance)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom">Résumé personnalisé (avec axes spécifiques)</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Choisissez le type de résumé que vous souhaitez générer
                  </FormDescription>
                </FormItem>
              )}
            />

            {summaryType === "custom" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Axes de résumé personnalisés</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addCustomAxis}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un axe
                  </Button>
                </div>

                <div className="space-y-4">
                  {customAxes.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Ajoutez des axes pour personnaliser votre résumé (ex: traumatismes, relations, cognitions...)
                    </p>
                  )}

                  {customAxes.map((axis, index) => (
                    <div key={index} className="border rounded-md p-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        onClick={() => removeCustomAxis(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <div className="space-y-3">
                        <div className="grid gap-2">
                          <Label htmlFor={`axis-${index}`}>Titre de l'axe</Label>
                          <Input
                            id={`axis-${index}`}
                            value={axis.name}
                            onChange={(e) => updateCustomAxis(index, 'name', e.target.value)}
                            placeholder="Ex: Analyse des traumatismes"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`description-${index}`}>Description (optionnel)</Label>
                          <Textarea
                            id={`description-${index}`}
                            value={axis.description}
                            onChange={(e) => updateCustomAxis(index, 'description', e.target.value)}
                            placeholder="Ex: Se concentrer sur les événements traumatiques mentionnés pendant la séance"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informations importantes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ajoutez des notes ou informations qui doivent être prises en compte dans le résumé"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générer le résumé
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionSummaryForm;
