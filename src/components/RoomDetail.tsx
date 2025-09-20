import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { RoomForm } from "./RoomForm";
import { EquipmentForm } from "./EquipmentForm";

interface RoomDetailProps {
  roomId: Id<"rooms">;
  onBack: () => void;
  isAdmin: boolean;
}

export function RoomDetail({ roomId, onBack, isAdmin }: RoomDetailProps) {
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<any>(null);

  const room = useQuery(api.rooms.get, { id: roomId });
  const equipment = useQuery(api.equipment.listByRoom, { roomId }) || [];
  const deleteEquipment = useMutation(api.equipment.remove);

  if (!room) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

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

  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "replacement":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getEquipmentStatusText = (status: string) => {
    switch (status) {
      case "operational": return "Operacional";
      case "maintenance": return "Manutenção";
      case "replacement": return "Substituição";
      default: return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "projection": return "📽️";
      case "sound": return "🔊";
      case "climate": return "❄️";
      case "electrical": return "⚡";
      case "network": return "🌐";
      default: return "🔧";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "projection": return "Projeção";
      case "sound": return "Som";
      case "climate": return "Climatização";
      case "electrical": return "Elétrico";
      case "network": return "Rede";
      case "other": return "Outros";
      default: return category;
    }
  };

  const getLampUsagePercent = () => {
    if (room.projectorLampHours && room.projectorLampMaxHours) {
      return Math.round((room.projectorLampHours / room.projectorLampMaxHours) * 100);
    }
    return null;
  };

  const handleDeleteEquipment = async (equipmentId: Id<"equipment">) => {
    if (confirm("Tem certeza que deseja excluir este equipamento?")) {
      await deleteEquipment({ id: equipmentId });
    }
  };

  const handleEditEquipment = (equipment: any) => {
    setEditingEquipment(equipment);
    setShowEquipmentForm(true);
  };

  const handleCloseEquipmentForm = () => {
    setShowEquipmentForm(false);
    setEditingEquipment(null);
  };

  const lampUsage = getLampUsagePercent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            ← Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sala {room.number}
            </h1>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(room.status)}`}>
              {getStatusText(room.status)}
            </span>
          </div>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setShowRoomForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Editar Sala
          </button>
        )}
      </div>

      {/* Room Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informações da Sala
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📽️</span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Projetor</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{room.projector}</div>
                {room.projectorType && (
                  <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs mt-1">
                    {room.projectorType === "lamp" ? "Lâmpada" : "Laser"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">🔊</span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Sistema de Som</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{room.soundSystem}</div>
              </div>
            </div>

            {room.amplifiers && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎚️</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Amplificadores</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{room.amplifiers}</div>
                </div>
              </div>
            )}

            {room.server && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">💻</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Servidor</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{room.server}</div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {room.projectorLampModel && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Lâmpada do Projetor</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{room.projectorLampModel}</div>
                </div>
              </div>
            )}

            {room.projectorIp && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">IP do Projetor</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{room.projectorIp}</div>
                </div>
              </div>
            )}

            {room.serverIp && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🖥️</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">IP do Servidor</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{room.serverIp}</div>
                </div>
              </div>
            )}

            {lampUsage !== null && (
              <div className="space-y-2">
                <div className="font-medium text-gray-900 dark:text-white">Uso da Lâmpada</div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    {room.projectorLampHours}h / {room.projectorLampMaxHours}h
                  </span>
                  <span className={`font-medium ${
                    lampUsage > 80 ? 'text-red-600' : 
                    lampUsage > 60 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {lampUsage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      lampUsage > 80 ? 'bg-red-500' : 
                      lampUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${lampUsage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {room.additionalInfo && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-900 dark:text-white mb-2">Informações Adicionais</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{room.additionalInfo}</div>
          </div>
        )}
      </div>

      {/* Custom Equipment */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Equipamentos Personalizados
          </h2>
          {isAdmin && (
            <button
              onClick={() => setShowEquipmentForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Adicionar Equipamento
            </button>
          )}
        </div>

        {equipment.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Nenhum equipamento personalizado cadastrado
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((eq) => (
              <div
                key={eq._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getCategoryIcon(eq.category)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {eq.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getCategoryName(eq.category)}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEquipmentStatusColor(eq.status)}`}>
                    {getEquipmentStatusText(eq.status)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {eq.description}
                </p>

                {eq.ipAddress && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span>🌐</span>
                    <span>{eq.ipAddress}</span>
                  </div>
                )}

                {eq.installDate && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Instalado em: {new Date(eq.installDate).toLocaleDateString('pt-BR')}
                  </div>
                )}

                {isAdmin && (
                  <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleEditEquipment(eq)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteEquipment(eq._id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room Form Modal */}
      {showRoomForm && (
        <RoomForm
          cinemaId={room.cinemaId}
          room={room}
          onClose={() => setShowRoomForm(false)}
        />
      )}

      {/* Equipment Form Modal */}
      {showEquipmentForm && (
        <EquipmentForm
          roomId={roomId}
          cinemaId={room.cinemaId}
          equipment={editingEquipment}
          onClose={handleCloseEquipmentForm}
        />
      )}
    </div>
  );
}
