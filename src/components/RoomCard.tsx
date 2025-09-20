import { Id } from "../../convex/_generated/dataModel";

interface Room {
  _id: Id<"rooms">;
  cinemaId: Id<"cinemas">;
  number: number;
  status: "active" | "maintenance" | "stopped";
  projector: string;
  soundSystem: string;
  projectorLampModel?: string;
  projectorLampHours?: number;
  projectorLampMaxHours?: number;
  projectorType?: "lamp" | "laser";
  lastMaintenanceA?: number;
  lastMaintenanceB?: number;
  lastMaintenanceC?: number;
  additionalInfo?: string;
  amplifiers?: string;
  projectorIp?: string;
  server?: string;
  serverIp?: string;
}

interface RoomCardProps {
  room: Room;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function RoomCard({ room, onEdit, onDelete, onClick }: RoomCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "stopped":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Ativa";
      case "maintenance": return "Manutenção";
      case "stopped": return "Parada";
      default: return status;
    }
  };

  const getLampUsagePercent = () => {
    if (room.projectorLampHours && room.projectorLampMaxHours) {
      return Math.round((room.projectorLampHours / room.projectorLampMaxHours) * 100);
    }
    return null;
  };

  const lampUsage = getLampUsagePercent();

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {room.number}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sala {room.number}
            </h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
              {getStatusText(room.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>📽️</span>
          <span>{room.projector}</span>
          {room.projectorType && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
              {room.projectorType === "lamp" ? "Lâmpada" : "Laser"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>🔊</span>
          <span>{room.soundSystem}</span>
        </div>

        {room.projectorLampModel && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>💡</span>
            <span>{room.projectorLampModel}</span>
          </div>
        )}

        {lampUsage !== null && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Uso da lâmpada</span>
              <span className={`font-medium ${
                lampUsage > 80 ? 'text-red-600' : 
                lampUsage > 60 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {lampUsage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  lampUsage > 80 ? 'bg-red-500' : 
                  lampUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${lampUsage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {room.projectorLampHours}h / {room.projectorLampMaxHours}h
            </div>
          </div>
        )}

        {room.projectorIp && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>🌐</span>
            <span>{room.projectorIp}</span>
          </div>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Excluir
            </button>
          )}
        </div>
      )}
    </div>
  );
}
