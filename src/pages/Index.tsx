
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { FileText, Wand2, Upload, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload d'audio",
      description: "Importez un enregistrement audio de séance de thérapie",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Transcription automatique",
      description: "Convertissez l'audio en texte avec précision",
    },
    {
      icon: <Wand2 className="h-6 w-6" />,
      title: "Analyse des relations",
      description: "Identifiez les relations et leur nature",
    },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-16 items-center mt-8">
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Analysez vos <span className="text-primary">séances</span> de thérapie
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Transcrivez automatiquement vos enregistrements audio et extrayez 
              des informations clés pour mieux comprendre les relations et 
              l'historique de vos patients.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button 
                size="lg" 
                className="rounded-xl"
                onClick={() => navigate("/transcription")}
              >
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="glass-panel aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl p-1">
              <div className="bg-gradient-to-br from-primary/10 to-accent/20 h-full w-full rounded-3xl p-8 flex items-center justify-center">
                <div className="w-full max-w-sm aspect-square rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center">
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Wand2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Analyse intelligente</h3>
                    <p className="text-sm text-muted-foreground">
                      Obtenez des insights précieux sur les relations et le parcours de vos patients
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-24 grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-panel p-6 rounded-xl"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
