
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mic, Square, Upload, Play, Pause } from "lucide-react";

interface AudioRecorderProps {
  onAudioCaptured: (audioBlob: Blob) => void;
}

const AudioRecorder = ({ onAudioCaptured }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        onAudioCaptured(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Enregistrement démarré");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Impossible d'accéder au microphone");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      toast.success("Enregistrement terminé");
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const audioBlob = file;
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      onAudioCaptured(audioBlob);
      toast.success(`Fichier audio "${file.name}" importé`);
    }
  };
  
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col items-center space-y-6">
        <motion.div 
          className="relative w-64 h-64 rounded-full bg-primary/10 flex items-center justify-center"
          animate={isRecording ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } } : {}}
        >
          {isRecording && (
            <motion.div 
              className="absolute inset-0 rounded-full bg-primary/5"
              animate={{ 
                scale: [1, 1.5, 1.8], 
                opacity: [0.7, 0.5, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeOut", 
              }}
            />
          )}
          
          <motion.div 
            className={`w-32 h-32 rounded-full ${isRecording ? 'bg-red-500' : 'bg-primary'} flex items-center justify-center cursor-pointer`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <Square className="w-12 h-12 text-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </motion.div>
        </motion.div>
        
        {!isRecording && (
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="audio/*"
              id="audio-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="audio-upload">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 rounded-xl"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Importer un audio
                </span>
              </Button>
            </label>
            
            {audioURL && (
              <Button
                variant="secondary"
                className="flex items-center space-x-2 rounded-xl"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isPlaying ? "Pause" : "Écouter"}
              </Button>
            )}
          </div>
        )}
        
        {audioURL && (
          <audio 
            ref={audioRef} 
            src={audioURL} 
            className="hidden" 
            onEnded={() => setIsPlaying(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
