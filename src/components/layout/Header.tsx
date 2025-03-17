
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <motion.header 
      className="w-full py-6 px-8 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center space-x-2">
        <motion.div 
          className="h-10 w-10 bg-sonalis-primary rounded-xl flex items-center justify-center text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7.5 12C7.5 9.51 9.51 7.5 12 7.5C14.49 7.5 16.5 9.51 16.5 12C16.5 14.49 14.49 16.5 12 16.5C9.51 16.5 7.5 14.49 7.5 12ZM12 20C8.98 20 6.31 18.5 4.68 16.18C5.5 14.9 6.76 14 8.2 14C9.82 14 12.18 14 12.18 14C13.62 14 14.88 14.9 15.7 16.18C14.07 18.5 11.4 20 12 20Z" fill="currentColor" />
          </svg>
        </motion.div>
        <motion.h1 
          className="text-xl font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          SONALIS
        </motion.h1>
      </div>
      
      <nav className="flex space-x-1">
        <Button
          variant={isActive("/") ? "default" : "ghost"} 
          onClick={() => navigate("/")}
          className="px-4 rounded-xl transition-all duration-300"
        >
          Patients
        </Button>
        <Button
          variant={isActive("/transcription") ? "default" : "ghost"} 
          onClick={() => navigate("/transcription")}
          className="px-4 rounded-xl transition-all duration-300"
        >
          Transcription
        </Button>
        <Button
          variant={isActive("/analysis") ? "default" : "ghost"} 
          onClick={() => navigate("/analysis")}
          className="px-4 rounded-xl transition-all duration-300"
        >
          Analyse
        </Button>
      </nav>
    </motion.header>
  );
};

export default Header;
