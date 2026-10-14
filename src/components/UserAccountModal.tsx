import React from 'react';
import { firebaseConfig } from '../firebase';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToWorker: () => void;
  onSwitchToVecino: () => void;
  onSeedSampleWorkers?: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  onSwitchToWorker,
  onSwitchToVecino,
  onSeedSampleWorkers,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <img
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#FFC067]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuATYrHb6aCccefWIhfxhfKNZVnu-C8UXHGVh1eJfPjtlqYIL_Jtjb6V_0t-p4XjzvE0__J9xH97phMfAxKDmo0R3qfOLD1sLslfpTz0cYgLYjl26iCSPjd_yfCAh2BCk0UsO8X2LFJYdz3g1Nti-kSRh4EhNZ0oxDDl7CuyYO0WFXteDit48aqmPcKkXfAdEclSVvJ0-lqcLgEZflDXBkVG6NFGe2NMaihEO-VQhXHgAA1x-9P8BQTQ"
            />
            <div>
              <h3 className="text-base font-bold text-[#2C3E50]">Miguel Vergara</h3>
              <p className="text-xs text-[#2A5C8A] font-semibold">Vecino Activo · Villa Urquiza</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#6C7A89] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 bg-[#EDF4FF] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#2C3E50]">Ubicación fijada:</p>
              <p className="text-[#6C7A89]">Plaza Echeverría (Comuna 12)</p>
            </div>
            <span className="text-[11px] font-bold text-[#2A5C8A]">Activa</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#2C3E50]">WhatsApp Vinculado:</p>
              <p className="text-[#6C7A89]">+54 9 11 5842 1904</p>
            </div>
            <span className="text-[11px] font-bold text-[#2ECC71]">✓ Verificado</span>
          </div>

          {/* Estado de sincronización Firestore */}
          <div className="p-3 bg-[#FFF9E6] border border-[#FFE082] rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#856404] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#FFA000]">database</span>
                <span>Firebase Firestore</span>
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded text-[#856404] font-bold">
                Proyecto: {firebaseConfig.projectId}
              </span>
            </div>
            <p className="text-[11px] text-[#6D4C41] leading-relaxed">
              Cualquier nuevo registro se guarda automáticamente en la colección <code>'workers'</code> de Firestore.
            </p>
            {onSeedSampleWorkers && (
              <button
                type="button"
                onClick={() => {
                  onSeedSampleWorkers();
                  onClose();
                }}
                className="w-full mt-1 py-1.5 px-2.5 bg-[#FFA000] hover:bg-[#FF8F00] text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">cloud_upload</span>
                <span>Guardar prestadores de prueba en Firestore</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-1 border-t border-[#E2E8F0]">
          <p className="text-xs font-bold text-[#6C7A89] uppercase tracking-wider">Modos de uso rápido</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSwitchToVecino();
                onClose();
              }}
              className="p-2.5 rounded-xl border border-[#2A5C8A] bg-[#EDF4FF] text-[#2A5C8A] font-bold text-xs hover:bg-[#D0E4FF] transition-colors cursor-pointer"
            >
              Modo Vecino
            </button>
            <button
              onClick={() => {
                onSwitchToWorker();
                onClose();
              }}
              className="p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#2C3E50] font-bold text-xs transition-colors cursor-pointer"
            >
              Modo Prestador
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#2C3E50] font-bold text-xs transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
