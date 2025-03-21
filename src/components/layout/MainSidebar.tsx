
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Calendar, Sparkles } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

export const MainSidebarWrapper = ({ children }: SidebarProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

const MainSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    {
      title: "Tableau de bord",
      path: "/",
      icon: LayoutDashboard
    },
    {
      title: "Patients",
      path: "/patients",
      icon: Users
    },
    {
      title: "Rendez-vous",
      path: "/appointments",
      icon: Calendar
    },
    {
      title: "Outils IA",
      path: "/ai-tools",
      icon: Sparkles
    }
  ];
  
  return (
    <Sidebar>
      <SidebarHeader>
        <motion.div
          className="flex items-center px-4 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="text-xl font-bold text-sonalis-primary">PSY-AI</div>
        </motion.div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  isActive={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                  tooltip={item.title}
                >
                  <item.icon className="mr-2" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          © {new Date().getFullYear()} PSY-IA
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
