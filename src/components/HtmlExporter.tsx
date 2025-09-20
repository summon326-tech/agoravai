import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function HtmlExporter() {
  const [isGenerating, setIsGenerating] = useState(false);
  const data = useQuery(api.dataExport.getCompleteData);

  const generateHtml = () => {
    if (!data) return;

    setIsGenerating(true);

    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Gestão de Cinemas - Exportação</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        
        .export-info {
            background: #e0f2fe;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            border-left: 4px solid #0284c7;
        }
        
        .section {
            background: white;
            margin-bottom: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .section-header {
            background: #f1f5f9;
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .section-header h2 {
            color: #1e293b;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .section-content {
            padding: 1.5rem;
        }
        
        .grid {
            display: grid;
            gap: 1rem;
        }
        
        .grid-2 {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        .grid-3 {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        
        .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            transition: transform 0.2s;
        }
        
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .card-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }
        
        .status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .status-active {
            background: #dcfce7;
            color: #166534;
        }
        
        .status-maintenance {
            background: #fef3c7;
            color: #92400e;
        }
        
        .status-stopped {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .priority-high {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .priority-medium {
            background: #fef3c7;
            color: #92400e;
        }
        
        .priority-low {
            background: #dcfce7;
            color: #166534;
        }
        
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        .table th,
        .table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .table th {
            background: #f1f5f9;
            font-weight: 600;
            color: #374151;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #3b82f6;
        }
        
        .stat-label {
            color: #6b7280;
            margin-top: 0.5rem;
        }
        
        .footer {
            text-align: center;
            padding: 2rem;
            color: #6b7280;
            border-top: 1px solid #e2e8f0;
            margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .grid-2,
            .grid-3 {
                grid-template-columns: 1fr;
            }
            
            .stats {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media print {
            body {
                background: white;
            }
            
            .section {
                box-shadow: none;
                border: 1px solid #e2e8f0;
            }
            
            .card:hover {
                transform: none;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎬 Sistema de Gestão de Cinemas</h1>
            <p>Relatório Completo do Sistema</p>
        </div>
        
        <div class="export-info">
            <strong>📊 Dados exportados em:</strong> ${new Date(data.exportDate).toLocaleString('pt-BR')}
            <br>
            <strong>📈 Total de registros:</strong> ${data.cinemas.length} cinemas, ${data.rooms.length} salas, ${data.tasks.length} tarefas, ${data.events.length} eventos
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${data.cinemas.length}</div>
                <div class="stat-label">Cinemas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.rooms.length}</div>
                <div class="stat-label">Salas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.tasks.filter(t => t.status === 'todo').length}</div>
                <div class="stat-label">Tarefas Pendentes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.events.filter(e => e.status === 'scheduled').length}</div>
                <div class="stat-label">Eventos Agendados</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <h2>🏢 Cinemas</h2>
            </div>
            <div class="section-content">
                <div class="grid grid-2">
                    ${data.cinemas.map(cinema => `
                        <div class="card">
                            <div class="card-title">${cinema.name}</div>
                            <p><strong>📍 Localização:</strong> ${cinema.location}</p>
                            <p><strong>🎭 Total de Salas:</strong> ${cinema.totalRooms || 'N/A'}</p>
                            <p><strong>✅ Salas Ativas:</strong> ${cinema.activeRooms || 'N/A'}</p>
                            <p><strong>📊 Disponibilidade:</strong> ${cinema.availability ? cinema.availability + '%' : 'N/A'}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <h2>🎭 Salas de Cinema</h2>
            </div>
            <div class="section-content">
                <div class="grid grid-3">
                    ${data.rooms.map(room => {
                        const cinema = data.cinemas.find(c => c._id === room.cinemaId);
                        return `
                            <div class="card">
                                <div class="card-title">Sala ${room.number}</div>
                                <p><strong>🏢 Cinema:</strong> ${cinema?.name || 'N/A'}</p>
                                <p><strong>📊 Status:</strong> <span class="status status-${room.status}">${room.status}</span></p>
                                <p><strong>📽️ Projetor:</strong> ${room.projector}</p>
                                <p><strong>🔊 Som:</strong> ${room.soundSystem}</p>
                                ${room.projectorLampModel ? `<p><strong>💡 Lâmpada:</strong> ${room.projectorLampModel}</p>` : ''}
                                ${room.projectorLampHours ? `<p><strong>⏱️ Horas de Uso:</strong> ${room.projectorLampHours}h</p>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <h2>📋 Tarefas</h2>
            </div>
            <div class="section-content">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Cinema</th>
                            <th>Sala</th>
                            <th>Prioridade</th>
                            <th>Status</th>
                            <th>Responsável</th>
                            <th>Vencimento</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.tasks.map(task => {
                            const cinema = data.cinemas.find(c => c._id === task.cinemaId);
                            const room = task.roomId ? data.rooms.find(r => r._id === task.roomId) : null;
                            return `
                                <tr>
                                    <td><strong>${task.title}</strong><br><small>${task.description}</small></td>
                                    <td>${cinema?.name || 'N/A'}</td>
                                    <td>${room ? `Sala ${room.number}` : 'Geral'}</td>
                                    <td><span class="status priority-${task.priority}">${task.priority}</span></td>
                                    <td><span class="status status-${task.status}">${task.status}</span></td>
                                    <td>${task.assignedTo || 'Não atribuído'}</td>
                                    <td>${task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Sem prazo'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <h2>📅 Eventos</h2>
            </div>
            <div class="section-content">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Cinema</th>
                            <th>Sala</th>
                            <th>Tipo</th>
                            <th>Data/Hora</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.events.map(event => {
                            const cinema = data.cinemas.find(c => c._id === event.cinemaId);
                            const room = event.roomId ? data.rooms.find(r => r._id === event.roomId) : null;
                            return `
                                <tr>
                                    <td><strong>${event.title}</strong>${event.description ? `<br><small>${event.description}</small>` : ''}</td>
                                    <td>${cinema?.name || 'N/A'}</td>
                                    <td>${room ? `Sala ${room.number}` : 'Geral'}</td>
                                    <td><span class="status status-${event.type}">${event.type}</span></td>
                                    <td>
                                        <strong>Início:</strong> ${new Date(event.startTime).toLocaleString('pt-BR')}<br>
                                        <strong>Fim:</strong> ${new Date(event.endTime).toLocaleString('pt-BR')}
                                    </td>
                                    <td><span class="status status-${event.status}">${event.status}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        ${data.settings.length > 0 ? `
        <div class="section">
            <div class="section-header">
                <h2>⚙️ Configurações do Sistema</h2>
            </div>
            <div class="section-content">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Configuração</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.settings.map(setting => `
                            <tr>
                                <td><strong>${setting.key}</strong></td>
                                <td>${setting.value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        ` : ''}
        
        <div class="footer">
            <p>📊 Relatório gerado automaticamente pelo Sistema de Gestão de Cinemas</p>
            <p>🕒 ${new Date().toLocaleString('pt-BR')}</p>
        </div>
    </div>
    
    <script>
        // Funcionalidade para impressão
        function printReport() {
            window.print();
        }
        
        // Adicionar botão de impressão
        document.addEventListener('DOMContentLoaded', function() {
            const header = document.querySelector('.header');
            const printButton = document.createElement('button');
            printButton.textContent = '🖨️ Imprimir Relatório';
            printButton.style.cssText = \`
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 1rem;
                font-size: 1rem;
                transition: all 0.3s ease;
            \`;
            printButton.onmouseover = function() {
                this.style.background = 'rgba(255, 255, 255, 0.3)';
            };
            printButton.onmouseout = function() {
                this.style.background = 'rgba(255, 255, 255, 0.2)';
            };
            printButton.onclick = printReport;
            header.appendChild(printButton);
        });
        
        // Funcionalidade para busca
        function addSearchFunctionality() {
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = '🔍 Buscar no relatório...';
            searchInput.style.cssText = \`
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 1rem;
                margin-bottom: 1rem;
            \`;
            
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const cards = document.querySelectorAll('.card, .table tbody tr');
                
                cards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
            
            const container = document.querySelector('.container');
            const exportInfo = document.querySelector('.export-info');
            container.insertBefore(searchInput, exportInfo.nextSibling);
        }
        
        document.addEventListener('DOMContentLoaded', addSearchFunctionality);
    </script>
</body>
</html>`;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cinema-management-export-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Exportar Sistema Completo
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gere um arquivo HTML completo com todos os dados atuais do sistema
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            📋 O que será incluído na exportação:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Todos os cinemas cadastrados com suas informações</li>
            <li>• Todas as salas com status e equipamentos</li>
            <li>• Lista completa de tarefas e seus status</li>
            <li>• Calendário de eventos agendados</li>
            <li>• Configurações do sistema</li>
            <li>• Estatísticas e relatórios visuais</li>
            <li>• Funcionalidade de busca e impressão</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
            ✨ Recursos do arquivo HTML:
          </h4>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <li>• Arquivo único e independente</li>
            <li>• Funciona em qualquer navegador</li>
            <li>• Design responsivo para mobile</li>
            <li>• Otimizado para impressão</li>
            <li>• Busca integrada no conteúdo</li>
            <li>• Não requer conexão com internet</li>
          </ul>
        </div>

        {data && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              📊 Dados atuais disponíveis:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.cinemas.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Cinemas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.rooms.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Salas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {data.tasks.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Tarefas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {data.events.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Eventos</div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={generateHtml}
          disabled={isGenerating || !data}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Gerando arquivo HTML...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Gerar e Baixar HTML Completo
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          O arquivo será baixado automaticamente e poderá ser aberto em qualquer navegador
        </p>
      </div>
    </div>
  );
}
