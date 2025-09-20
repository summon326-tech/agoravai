import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { GeneralDashboard } from "./components/GeneralDashboard";
import { CinemaDetail } from "./components/CinemaDetail";
import { Settings } from "./components/Settings";
import { Id } from "../convex/_generated/dataModel";

type View = "dashboard" | "general" | "settings" | { type: "cinema"; id: Id<"cinemas"> };

export default function App() {
  const [currentView, setCurrentView] = useState<View>("general");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminLogin = () => {
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onSelectCinema={(id) => setCurrentView({ type: "cinema", id })} />;
      case "general":
        return (
          <GeneralDashboard 
            onSelectCinema={(id) => setCurrentView({ type: "cinema", id })} 
            isAdmin={isAdmin}
          />
        );
      case "settings":
        return <Settings />;
      default:
        if (currentView.type === "cinema") {
          return (
            <CinemaDetail
              cinemaId={currentView.id}
              onBack={() => setCurrentView("general")}
              isAdmin={isAdmin}
            />
          );
        }
        return (
          <GeneralDashboard 
            onSelectCinema={(id) => setCurrentView({ type: "cinema", id })} 
            isAdmin={isAdmin}
          />
        );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            isAdmin={isAdmin}
          />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 lg:p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </main>
  );
}
