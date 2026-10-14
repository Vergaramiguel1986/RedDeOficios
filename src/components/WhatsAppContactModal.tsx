import React, { useState } from 'react';
import { TradeWorker } from '../types';

interface WhatsAppContactModalProps {
  worker: TradeWorker | null;
  onClose: () => void;
  onMessageSent: (workerName: string, text: string) => void;
}

export const WhatsAppContactModal: React.FC<WhatsAppContactModalProps> = ({
  worker,
  onClose,
  onMessageSent,
}) => {
  if (!worker) return null;

  const defaultMsg = `Hola ${worker.name}, te contacto desde Red de Oficios Villa Urquiza. Quería consultarte por un trabajo de ${worker.tradeTitle.toLowerCase()} cerca de Plaza Echeverría.`;
  const [message, setMessage] = useState(defaultMsg);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = () => {
    setSentSuccess(true);
    onMessageSent(worker.name, message);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleOpenRealWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    const cleanPhone = worker.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#EFEAE2] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={worker.avatarUrl}
              alt={worker.name}
              className="w-10 h-10 rounded-full object-cover border border-white/50"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
              }}
            />
            <div>
              <h3 className="text-sm font-bold leading-tight">{worker.name}</h3>
              <p className="text-[11px] text-[#A7F3D0] leading-tight flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#69F0AE]"></span>
                En línea en Villa Urquiza • {worker.address}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Chat message space */}
        <div className="p-5 space-y-4">
          <div className="bg-[#DCF8C6] rounded-2xl p-4 shadow-xs text-xs text-[#2C3E50] border border-[#C5E1A5] space-y-2 relative">
            <span className="text-[10px] font-bold text-[#075E54] block">
              Mensaje directo entre vecinos de la cuadra
            </span>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent border-0 text-xs text-[#2C3E50] focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
              <span>{worker.conditionOfWork}</span>
              <span className="text-[#34B7F1] font-bold">15:45 ✓✓</span>
            </div>
          </div>

          {sentSuccess ? (
            <div className="p-3 bg-white rounded-xl text-center text-xs font-bold text-[#075E54] shadow-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[#2ECC71]">check_circle</span>
              <span>¡Mensaje enviado a {worker.name}! Recibirás respuesta directa en WhatsApp.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleSend}
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Enviar mensaje directo ahora</span>
              </button>
              <button
                onClick={handleOpenRealWhatsApp}
                className="w-full py-2 text-xs font-bold text-[#075E54] hover:underline text-center"
              >
                Abrir en la app de WhatsApp Web / Celular ↗
              </button>
            </div>
          )}
        </div>

        <div className="bg-white/80 p-3 px-4 border-t border-slate-300 text-[11px] text-[#6C7A89] flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-[#2ECC71]">lock</span>
          <span>Encriptado de extremo a extremo · Trato directo sin comisiones</span>
        </div>
      </div>
    </div>
  );
};
