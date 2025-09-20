import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface DashboardProps {
  onSelectCinema: (id: Id<"cinemas">) => void;
}

export function Dashboard({ onSelectCinema }: DashboardProps) {
  const cinemas = useQuery(api.cinemas.list) || [];
  const lampAlerts = useQuery(api.rooms.getMaintenanceAlerts, {}) || [];

  const totalRooms = cinemas.reduce((sum, cinema) => sum + (cinema.totalRooms || 0), 0);
  const activeRooms = cinemas.reduce((sum, cinema) => sum + (cinema.activeRooms || 0), 0);
  const averageAvailability = cinemas.length > 0 
    ? Math.round(cinemas.reduce((sum, cinema) => sum + (cinema.availability || 0), 0) / cinemas.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Visão geral do sistema</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="text-2xl">🏢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cinemas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{cinemas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <span className="text-2xl">🎭</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Salas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalRooms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Salas Ativas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeRooms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disponibilidade</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{averageAvailability}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {lampAlerts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <span className="text-red-500 text-xl mr-2">⚠️</span>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Alertas de Manutenção
            </h3>
          </div>
          <div className="space-y-2">
            {lampAlerts.map((room: any) => (
              <div key={room._id} className="text-sm text-red-700 dark:text-red-300">
                Sala {room.number}: {room.projectorType === "lamp" ? "Lâmpada" : "Laser"} precisa ser trocado 
                (restam {room.remainingHours}h)
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cinemas List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cinemas</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cinemas.map((cinema) => (
              <div
                key={cinema._id}
                onClick={() => onSelectCinema(cinema._id)}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{cinema.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">📍 {cinema.location}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {cinema.totalRooms || 0} salas
                  </span>
                  <span className={`font-medium ${
                    (cinema.availability || 0) > 80 
                      ? 'text-green-600 dark:text-green-400' 
                      : (cinema.availability || 0) > 50 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-red-600 dark:text-red-400'
                  }`}>
                    {cinema.availability || 0}% disponível
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
