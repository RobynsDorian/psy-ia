
import { useState } from "react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import AudioRecorder from "@/components/audio/AudioRecorder";
import TranscriptionEditor from "@/components/transcription/TranscriptionEditor";
import { motion } from "framer-motion";

const Transcription = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAudioCaptured = (blob: Blob) => {
    setAudioBlob(blob);
    // Simulez une transcription vide au début
    setTranscription("");
  };
  
  const transcribeAudio = async () => {
    if (!audioBlob) {
      toast.error("Aucun audio à transcrire");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulez l'appel API de transcription
      setTimeout(() => {
        // Exemple de texte de transcription
        const sampleTranscription = `Patient: Je ne sais pas, c'est compliqué avec ma mère en ce moment. Nous nous disputons beaucoup.
        
Thérapeute: Pouvez-vous me parler davantage de votre relation avec votre mère?

Patient: Eh bien, elle a toujours été très exigeante. Mon père est plus détendu, mais il n'intervient jamais quand elle et moi nous disputons. Ma sœur Julie, elle, a toujours été la préférée. Elle ne subit jamais les mêmes critiques que moi.

Thérapeute: Et comment cela vous fait-il sentir?

Patient: Frustré, principalement. Et triste aussi. J'ai l'impression que rien de ce que je fais n'est jamais assez bien pour ma mère. Mon grand-père paternel était la seule personne qui me soutenait vraiment, mais il est décédé l'année dernière.

Thérapeute: Je suis désolé pour votre perte. Votre grand-père semble avoir été une personne importante dans votre vie.

Patient: Oui, il l'était. Il m'a beaucoup appris, notamment sur la musique. C'est lui qui m'a offert ma première guitare quand j'avais 10 ans. Ma grand-mère aussi était gentille, mais elle était souvent malade et ne pouvait pas passer beaucoup de temps avec nous.`;
        
        setTranscription(sampleTranscription);
        setIsProcessing(false);
        toast.success("Transcription terminée");
      }, 3000);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast.error("Erreur lors de la transcription");
      setIsProcessing(false);
    }
  };
  
  const handleSaveTranscription = (text: string) => {
    setTranscription(text);
  };
  
  const handleAnalyze = () => {
    // Sauvegardez d'abord la transcription dans le local storage
    localStorage.setItem("transcription", transcription);
    // Redirigez vers la page d'analyse
    window.location.href = "/analysis";
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-6 max-w-6xl">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Transcription d'audio
        </motion.h1>
        
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div 
            className="glass-panel p-8 rounded-xl flex flex-col items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-6">Enregistrement audio</h2>
            <AudioRecorder onAudioCaptured={handleAudioCaptured} />
            
            <div className="mt-8 w-full">
              <button
                className={`w-full py-3 rounded-xl text-white font-medium transition-all
                  ${audioBlob && !isProcessing 
                    ? "bg-primary hover:bg-primary/90" 
                    : "bg-gray-300 cursor-not-allowed"}`}
                disabled={!audioBlob || isProcessing}
                onClick={transcribeAudio}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    <span>Transcription en cours...</span>
                  </div>
                ) : (
                  "Transcrire l'audio"
                )}
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel p-8 rounded-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TranscriptionEditor 
              transcription={transcription}
              onSave={handleSaveTranscription}
              onAnalyze={handleAnalyze}
              isProcessing={isProcessing}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Transcription;
