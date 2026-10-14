import React, { useState } from 'react';
import { WhatsAppNotification } from '../types';

interface PostulationModalProps {
  alert: WhatsAppNotification | null;
  onClose: () => void;
  onSubmitProposal: (alertId: string, proposal: string) => void;
}

export const PostulationModal: React.FC<PostulationModalProps> = ({
  alert,
  onClose,
  onSubmitProposal,
}) => {
  if (!alert) return null;

  const [proposal, setProposal] = useState(
    'Hola! Soy Roberto Gómez, carpintero de Bauness al 2100. Estoy disponible hoy a partir de las 17:00 hs para pasar a revisar el trabajo y pasarte presupuesto sin cargo.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal.trim()) return;
    onSubmitProposal(alert.id, proposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <span className="text-[11px] font-bold text-[#2A5C8A] uppercase tracking-wider">
              Postulación a Oportunidad Barrial
            </span>
            <h3 className="text-base font-bold text-[#2C3E50]">{alert.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#6C7A89]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-3 bg-[#EDF4FF] rounded-xl border border-[#D0E4FF] text-xs space-y-1">
          <p className="font-semibold text-[#2A5C8A]">Detalle del vecino:</p>
          <p className="text-[#2C3E50] italic">{alert.description}</p>
          <p className="text-[10px] text-[#6C7A89] pt-1">Ubicación: {alert.distance}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2C3E50]">Tu propuesta o disponibilidad:</label>
            <textarea
              rows={4}
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E2E8F0] text-xs text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#6C7A89] hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2A5C8A] hover:bg-[#104976] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Enviar Postulación Directa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
