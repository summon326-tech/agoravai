import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface RoomFormProps {
  cinemaId: Id<"cinemas">;
  room?: any;
  onClose: () => void;
}

export function RoomForm({ cinemaId, room, onClose }: RoomFormProps) {
  const [formData, setFormData] = useState({
    number: "",
    projector: "",
    soundSystem: "",
    projectorLampModel: "",
    projectorLampHours: "",
    projectorLampMaxHours: "",
    projectorType: "lamp" as const,
    additionalInfo: "",
    amplifiers: "",
    projectorIp: "",
    server: "",
    serverIp: "",
  });

  const createRoom = useMutation(api.rooms.create);
  const updateRoom = useMutation(api.rooms.update);

  useEffect(() => {
    if (room) {
      setFormData({
        number: room.number?.toString() || "",
        projector: room.projector || "",
        soundSystem: room.soundSystem || "",
        projectorLampModel: room.projectorLampModel || "",
        projectorLampHours: room.projectorLampHours?.toString() || "",
        projectorLampMaxHours: room.projectorLampMaxHours?.toString() || "",
        projectorType: room.projectorType || "lamp",
        additionalInfo: room.additionalInfo || "",
        amplifiers: room.amplifiers || "",
        projectorIp: room.projectorIp || "",
        server: room.server || "",
        serverIp: room.serverIp || "",
      });
    }
  }, [room]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        cinemaId,
        number: parseInt(formData.number),
        projector: formData.projector,
        soundSystem: formData.soundSystem,
        projectorLampModel: formData.projectorLampModel || undefined,
        projectorLampHours: formData.projectorLampHours ? parseInt(formData.projectorLampHours) : undefined,
        projectorLampMaxHours: formData.projectorLampMaxHours ? parseInt(formData.projectorLampMaxHours) : undefined,
        projectorType: formData.projectorType,
        additionalInfo: formData.additionalInfo || undefined,
        amplifiers: formData.amplifiers || undefined,
        projectorIp: formData.projectorIp || undefined,
        server: formData.server || undefined,
        serverIp: formData.serverIp || undefined,
      };

      if (room) {
        await updateRoom({ id: room._id, ...data });
      } else {
        await createRoom(data);
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {room ? "Editar Sala" : "Nova Sala"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número da Sala *
              </label>
              <input
                type="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Projetor
              </label>
              <select
                value={formData.projectorType}
                onChange={(e) => setFormData({ ...formData, projectorType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="lamp">Lâmpada</option>
                <option value="laser">Laser</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Projetor *
            </label>
            <input
              type="text"
              value={formData.projector}
              onChange={(e) => setFormData({ ...formData, projector: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sistema de Som *
            </label>
            <input
              type="text"
              value={formData.soundSystem}
              onChange={(e) => setFormData({ ...formData, soundSystem: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {formData.projectorType === "lamp" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Modelo da Lâmpada
                </label>
                <input
                  type="text"
                  value={formData.projectorLampModel}
                  onChange={(e) => setFormData({ ...formData, projectorLampModel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Horas de Uso
                </label>
                <input
                  type="number"
                  value={formData.projectorLampHours}
                  onChange={(e) => setFormData({ ...formData, projectorLampHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Horas Máximas
                </label>
                <input
                  type="number"
                  value={formData.projectorLampMaxHours}
                  onChange={(e) => setFormData({ ...formData, projectorLampMaxHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amplificadores
              </label>
              <input
                type="text"
                value={formData.amplifiers}
                onChange={(e) => setFormData({ ...formData, amplifiers: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                IP do Projetor
              </label>
              <input
                type="text"
                value={formData.projectorIp}
                onChange={(e) => setFormData({ ...formData, projectorIp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="192.168.1.100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Servidor
              </label>
              <input
                type="text"
                value={formData.server}
                onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                IP do Servidor
              </label>
              <input
                type="text"
                value={formData.serverIp}
                onChange={(e) => setFormData({ ...formData, serverIp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="192.168.1.101"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Informações Adicionais
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {room ? "Atualizar" : "Criar"} Sala
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
