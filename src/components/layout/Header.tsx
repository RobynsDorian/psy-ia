
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
      <motion.h1 
        className="text-xl font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        SONALIS
      </motion.h1>
      
      <nav className="flex space-x-1">
        <Button
          variant={isActive("/") ? "default" : "ghost"} 
          onClick={() => navigate("/")}
          className="px-4 rounded-xl transition-all duration-300"
        >
          Patients
        </Button>
      </nav>
    </motion.header>
  );
};

export default Header;
