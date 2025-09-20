import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface TechnicalReportProps {
  cinemaId?: Id<"cinemas">;
}

export function TechnicalReport({ cinemaId }: TechnicalReportProps) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [isExporting, setIsExporting] = useState(false);

  const report = useQuery(api.reports.getTechnicalReport, {
    cinemaId,
    startDate: new Date(dateRange.startDate).getTime(),
    endDate: new Date(dateRange.endDate + 'T23:59:59').getTime(),
  });

  const criticalAlerts = useQuery(api.equipment.getCriticalAlerts, { cinemaId });

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.getElementById('technical-report');
      if (!element) return;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `relatorio-tecnico-${dateRange.startDate}-${dateRange.endDate}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header and Date Range */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📊 Relatório Técnico Abrangente
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Análise detalhada de performance e manutenção
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Exportando...
                </>
              ) : (
                <>
                  📄 Exportar PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div id="technical-report" className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg">
        {/* Critical Alerts */}
        {criticalAlerts && criticalAlerts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
              🚨 Alertas Críticos ({criticalAlerts.length})
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {criticalAlerts.map((equipment) => (
                <div key={equipment._id} className="bg-white dark:bg-red-900/30 rounded-lg p-3">
                  <div className="font-medium text-red-900 dark:text-red-100">
                    {equipment.name}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-200">
                    Status: {equipment.status === "maintenance" ? "Manutenção" : "Substituição"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {report.summary.totalRooms}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total de Salas</div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {report.roomAvailability.length > 0 
                ? formatPercentage(report.roomAvailability.reduce((sum, r) => sum + r.availabilityPercent, 0) / report.roomAvailability.length)
                : '0%'
              }
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">Disponibilidade</div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {report.summary.totalMaintenance}
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Manutenções</div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(report.maintenanceStats.totalCost)}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Custo Total</div>
          </div>
        </div>

        {/* Maintenance Statistics */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📈 Estatísticas de Manutenção
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Por Categoria</h4>
              <div className="space-y-2">
                {Object.entries(report.maintenanceStats.byCategory).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {category === 'projection' ? 'Projeção' :
                       category === 'sound' ? 'Som' :
                       category === 'climate' ? 'Climatização' :
                       category === 'electrical' ? 'Elétrico' :
                       category === 'network' ? 'Rede' :
                       category === 'cleaning' ? 'Limpeza' : 'Outros'}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Resumo</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Custo Total</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(report.maintenanceStats.totalCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tempo de Parada</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {report.maintenanceStats.totalDowntime}h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio de Resolução</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {report.summary.avgResolutionTimeHours}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Impact Statistics */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎬 Impactos em Sessões
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Por Causa</h4>
              <div className="space-y-2">
                {Object.entries(report.sessionImpacts.byCause).map(([cause, count]) => (
                  <div key={cause} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {cause === 'projection' ? 'Projeção' :
                       cause === 'sound' ? 'Som' :
                       cause === 'climate' ? 'Climatização' :
                       cause === 'electrical' ? 'Elétrico' :
                       cause === 'network' ? 'Rede' : 'Outros'}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Por Tipo de Impacto</h4>
              <div className="space-y-2">
                {Object.entries(report.sessionImpacts.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {type === 'cancelled' ? 'Cancelada' :
                       type === 'delayed' ? 'Atrasada' : 'Interrompida'}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {report.summary.totalImpacts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total de Impactos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {report.sessionImpacts.totalDelayMinutes} min
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tempo Total de Atraso</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {report.summary.totalCinemas}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Cinemas Analisados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cinema Comparison */}
        {report.cinemaComparison.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🏢 Comparação entre Cinemas
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-gray-900 dark:text-white">Cinema</th>
                    <th className="text-center py-2 text-gray-900 dark:text-white">Salas</th>
                    <th className="text-center py-2 text-gray-900 dark:text-white">Disponibilidade</th>
                    <th className="text-center py-2 text-gray-900 dark:text-white">Manutenções</th>
                    <th className="text-center py-2 text-gray-900 dark:text-white">Impactos</th>
                  </tr>
                </thead>
                <tbody>
                  {report.cinemaComparison.map((cinema) => (
                    <tr key={cinema._id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 text-gray-900 dark:text-white font-medium">
                        {cinema.name}
                      </td>
                      <td className="text-center py-2 text-gray-600 dark:text-gray-400">
                        {cinema.operationalRooms}/{cinema.roomCount}
                      </td>
                      <td className="text-center py-2">
                        <span className={`font-medium ${
                          cinema.avgAvailability >= 90 ? 'text-green-600 dark:text-green-400' :
                          cinema.avgAvailability >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {formatPercentage(cinema.avgAvailability)}
                        </span>
                      </td>
                      <td className="text-center py-2 text-gray-600 dark:text-gray-400">
                        {cinema.maintenanceCount}
                      </td>
                      <td className="text-center py-2 text-gray-600 dark:text-gray-400">
                        {cinema.impactCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-200 dark:border-gray-700">
          Relatório gerado em {new Date().toLocaleString('pt-BR')} | 
          Período: {new Date(dateRange.startDate).toLocaleDateString('pt-BR')} - {new Date(dateRange.endDate).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  );
}
