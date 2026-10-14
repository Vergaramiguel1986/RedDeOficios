import React, { useState, useEffect, useMemo } from 'react';
import { WhatsAppNotification, CategoryType } from '../types';

interface WhatsAppAlertsViewProps {
  alerts: WhatsAppNotification[];
  onExploreMapForAlert: (alert: WhatsAppNotification) => void;
  onPostulateAlert: (alert: WhatsAppNotification) => void;
  onAddAlert?: (alert: WhatsAppNotification) => void;
}

export const WhatsAppAlertsView: React.FC<WhatsAppAlertsViewProps> = ({
  alerts: initialAlerts,
  onExploreMapForAlert,
  onPostulateAlert,
  onAddAlert,
}) => {
  const [alerts, setAlerts] = useState<WhatsAppNotification[]>(initialAlerts);

  useEffect(() => {
    setAlerts(initialAlerts);
  }, [initialAlerts]);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('todos');
  const [simulatedReplyText, setSimulatedReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const availableCategories = [
    { id: 'todos', label: 'Todos los avisos' },
    { id: 'plomeria', label: 'Plomería' },
    { id: 'electricidad', label: 'Electricidad' },
    { id: 'carpinteria', label: 'Carpintería' },
    { id: 'pintura', label: 'Pintura' },
    { id: 'cerrajeria', label: 'Cerrajería' },
    { id: 'jardineria', label: 'Jardinería' },
  ];

  const handleSendTestMessage = () => {
    const sampleUrgentAlerts = [
      {
        title: '¡Nueva urgencia de plomería en Av. Olazábal!',
        distance: 'A 280m de Plaza Echeverría',
        description: '"Vecino consulta por cambio urgente de flexible bajo mesada. Se inunda la cocina."',
        category: 'plomeria' as CategoryType,
      },
      {
        title: '¡Nuevo pedido de electricidad en Cullen!',
        distance: 'A 420m de tu ubicación',
        description: '"Saltó la térmica general al conectar lavavajillas. Se necesita electricista matriculado hoy."',
        category: 'electricidad' as CategoryType,
      },
      {
        title: '¡Oportunidad de carpintería en Bauness!',
        distance: 'A 350m de Plaza Echeverría',
        description: '"Vecino solicita presupuesto para cepillar y laquear puerta antigua de entrada."',
        category: 'carpinteria' as CategoryType,
      },
      {
        title: '¡Urgencia de cerrajería en Av. Triunvirato!',
        distance: 'A 190m de Estación Rosas',
        description: '"Llave trabada dentro del cilindro. Necesita apertura inmediata."',
        category: 'cerrajeria' as CategoryType,
      },
    ];

    const randomPick = sampleUrgentAlerts[Math.floor(Math.random() * sampleUrgentAlerts.length)];

    const testAlert: WhatsAppNotification = {
      id: 'test-' + Date.now(),
      title: randomPick.title,
      distance: randomPick.distance,
      description: randomPick.description,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      zone: 'Villa Urquiza',
      category: randomPick.category,
      responded: false,
    };

    setAlerts((prev) => (prev.some((a) => a.id === testAlert.id) ? prev : [testAlert, ...prev]));
    onAddAlert?.(testAlert);
    setToastMessage('Nueva alerta barrial recibida en Red de Oficios Bot');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessageToBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedReplyText.trim()) return;

    const userMessage: WhatsAppNotification = {
      id: 'user-msg-' + Date.now(),
      title: 'Tu mensaje enviado al Bot',
      distance: 'Villa Urquiza',
      description: `"${simulatedReplyText.trim()}"`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      zone: 'Villa Urquiza',
      category: 'todos' as any,
      responded: true,
      userProposalSent: simulatedReplyText.trim(),
    };

    setAlerts((prev) => (prev.some((a) => a.id === userMessage.id) ? prev : [userMessage, ...prev]));
    onAddAlert?.(userMessage);
    setSimulatedReplyText('');
    setToastMessage('Mensaje enviado al Bot de WhatsApp');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredAlerts = useMemo(() => {
    const seen = new Set<string>();
    return alerts
      .filter((alert) => {
        if (selectedFilterCategory === 'todos') return true;
        return alert.category === selectedFilterCategory;
      })
      .filter((alert) => {
        if (!alert || !alert.id) return false;
        if (seen.has(alert.id)) return false;
        seen.add(alert.id);
        return true;
      });
  }, [alerts, selectedFilterCategory]);

  return (
    <div className="w-full max-w-[860px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C3E50] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-slate-700">
          <span className="material-symbols-outlined text-[#2ECC71] text-[24px]">verified</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Clean Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F5E9] text-[#1E7E34] text-xs font-bold border border-[#C8E6C9]">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <span>WhatsApp Bot Oficial · Villa Urquiza</span>
        </div>
        <h1 className="text-2xl md:text-3.5xl font-extrabold text-[#2C3E50] tracking-tight">
          Red de Oficios Bot
        </h1>
        <p className="text-sm md:text-base text-[#6C7A89] max-w-xl mx-auto leading-relaxed">
          Canal automatizado para enterarte de avisos, presupuestos y urgencias barriales directamente en tu WhatsApp.
        </p>
      </div>

      {/* Filter Chips & Test Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {availableCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedFilterCategory === cat.id
                  ? 'bg-[#2A5C8A] text-white shadow-2xs'
                  : 'bg-[#F8FAFC] text-[#6C7A89] hover:bg-[#EDF4FF] hover:text-[#2A5C8A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSendTestMessage}
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
          title="Simular nueva alerta entrante"
        >
          <span className="material-symbols-outlined text-[16px]">add_alert</span>
          <span>Simular nueva alerta</span>
        </button>
      </div>

      {/* WhatsApp Chat Viewport */}
      <div className="bg-[#EFEAE2] rounded-3xl border border-[#D5D0C7] overflow-hidden shadow-lg flex flex-col">
        {/* WhatsApp Top Navigation Bar */}
        <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md relative">
              <span className="material-symbols-outlined text-[26px]">chat</span>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#69F0AE] border-2 border-[#075E54]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold leading-tight">Red de Oficios Bot</h2>
                <span className="material-symbols-outlined text-[16px] text-[#69F0AE]">verified</span>
              </div>
              <p className="text-xs text-[#E0F2F1] leading-tight flex items-center gap-1">
                <span>En línea</span>
                <span>•</span>
                <span>Canal Barrial Villa Urquiza</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/90">
            <span className="hidden sm:inline text-xs text-[#E0F2F1] font-medium bg-[#128C7E] px-2.5 py-1 rounded-full">
              {filteredAlerts.length} avisos
            </span>
            <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-white">
              more_vert
            </span>
          </div>
        </div>

        {/* Chat Stream Body */}
        <div className="p-4 md:p-6 space-y-4 max-h-[520px] overflow-y-auto custom-scrollbar">
          {/* Welcome Encrypted Notice */}
          <div className="text-center my-2">
            <div className="inline-flex items-center gap-1.5 bg-[#FFF3C4] text-[#856404] text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-2xs border border-[#FFEEBA] max-w-md">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>
                Los avisos están protegidos y moderados por la comunidad vecinal de Villa Urquiza.
              </span>
            </div>
          </div>

          {/* Bot Initial Presentation Message */}
          <div className="flex items-start gap-2 max-w-lg">
            <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm border border-slate-200/80 space-y-1.5">
              <p className="text-xs font-bold text-[#075E54] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                Red de Oficios Bot
              </p>
              <p className="text-xs text-[#2C3E50] leading-relaxed">
                ¡Hola! Acá recibís alertas inmediatas cuando un vecino de Villa Urquiza o alrededores publica un pedido o urgencia de tu rubro. Podés postularte o ver el punto exacto en el mapa barrial.
              </p>
              <div className="flex items-center justify-end text-[10px] text-slate-400 gap-1 pt-1">
                <span>08:00</span>
                <span className="text-[#34B7F1] font-bold">✓✓</span>
              </div>
            </div>
          </div>

          {/* Alerts Feed */}
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 bg-white/70 rounded-2xl border border-slate-200 p-4">
              <span className="material-symbols-outlined text-[36px] text-slate-400">notifications_paused</span>
              <p className="text-xs font-bold text-[#2C3E50] mt-1">No hay avisos para este rubro</p>
              <p className="text-[11px] text-[#6C7A89] mt-0.5">Elegí "Todos los avisos" o hacé clic en "Simular nueva alerta".</p>
            </div>
          ) : (
            filteredAlerts.map((alert, index) => {
              const isUserMessage = alert.responded && alert.userProposalSent;

              return (
                <div
                  key={`${alert.id}-${index}`}
                  className={`flex flex-col ${isUserMessage ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-xl rounded-2xl p-4 shadow-sm border space-y-2.5 transition-all ${
                      isUserMessage
                        ? 'bg-[#DCF8C6] border-[#C8E6C9] rounded-tr-xs'
                        : 'bg-white border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[#2A5C8A] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2ECC71]"></span>
                        {alert.title}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                        {alert.distance}
                      </span>
                    </div>

                    {/* Description message */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                      <p className="text-xs md:text-sm text-[#2C3E50] leading-relaxed italic">
                        {alert.description}
                      </p>
                    </div>

                    {/* If user sent proposal */}
                    {alert.userProposalSent && (
                      <div className="bg-[#E7F8DA] rounded-lg p-2.5 border border-[#C6E8B1] text-xs space-y-0.5">
                        <span className="font-bold text-[#2E7D32] text-[11px] block">
                          ✓ Tu respuesta enviada:
                        </span>
                        <p className="text-slate-700">{alert.userProposalSent}</p>
                      </div>
                    )}

                    {/* Interactive Actions */}
                    {!alert.userProposalSent && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onPostulateAlert(alert)}
                          className="py-2 px-3 bg-[#2A5C8A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#104976] active:scale-95 transition-all shadow-2xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">reply</span>
                          <span>Responder / Postularme</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onExploreMapForAlert(alert)}
                          className="py-2 px-3 bg-[#EDF4FF] text-[#2A5C8A] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#D0E4FF] active:scale-95 transition-all border border-[#D0E4FF] cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">location_on</span>
                          <span>Ver en el mapa barrial</span>
                        </button>
                      </div>
                    )}

                    {/* Footer checks */}
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                      <span>{alert.time}</span>
                      <span className="text-[#34B7F1] font-bold">✓✓</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Chat Input Bar */}
        <form
          onSubmit={handleSendMessageToBot}
          className="bg-[#F0F2F5] p-3 border-t border-[#D5D0C7] flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[#54656F] text-[22px] px-1 cursor-pointer">
            mood
          </span>
          <span className="material-symbols-outlined text-[#54656F] text-[22px] cursor-pointer">
            attach_file
          </span>

          <input
            type="text"
            value={simulatedReplyText}
            onChange={(e) => setSimulatedReplyText(e.target.value)}
            placeholder="Escribí un mensaje o consultá por pedidos en tu cuadra..."
            className="flex-1 bg-white rounded-xl px-4 py-2 text-xs md:text-sm text-[#2C3E50] border border-slate-300 focus:outline-none focus:border-[#075E54]"
          />

          <button
            type="submit"
            disabled={!simulatedReplyText.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${
              simulatedReplyText.trim()
                ? 'bg-[#075E54] hover:bg-[#128C7E] cursor-pointer shadow-xs'
                : 'bg-[#94A3B8] cursor-not-allowed opacity-60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>

        {/* Bottom Bar Info */}
        <div className="bg-[#E4DDD3] py-2 px-4 text-center text-[11px] text-[#54656F] font-medium border-t border-[#D5D0C7]">
          <span>Red de Oficios · Bot oficial para Villa Urquiza y alrededores · Conexión directa</span>
        </div>
      </div>
    </div>
  );
};
