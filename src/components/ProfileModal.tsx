import React from 'react';
import { TradeWorker } from '../types';

interface ProfileModalProps {
  worker: TradeWorker | null;
  onClose: () => void;
  onContact: (worker: TradeWorker) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ worker, onClose, onContact }) => {
  if (!worker) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2E8F0] my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Cover Banner */}
        <div className="relative bg-gradient-to-r from-[#2A5C8A] to-[#104976] p-6 text-white rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-4">
            <img
              src={worker.avatarUrl}
              alt={worker.avatarAlt}
              className="w-18 h-18 rounded-full object-cover border-3 border-[#FFC067] shadow-lg shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{worker.name}</h3>
                {worker.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[#2ECC71] text-white">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Verificado
                  </span>
                )}
              </div>
              <p className="text-sm text-[#FFDD67] font-semibold mt-0.5">{worker.tradeTitle}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-white/90">
                <span className="flex items-center gap-1 font-bold text-[#FFC067]">
                  ★ {worker.rating.toFixed(1)} ({worker.reviewsCount} reseñas)
                </span>
                <span>•</span>
                <span>{worker.address}</span>
                <span>•</span>
                <span>A {worker.distanceMeters} m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold text-[#2A5C8A] uppercase tracking-wider mb-1.5">
              Sobre mi trabajo en el barrio
            </h4>
            <p className="text-sm text-[#2C3E50] leading-relaxed bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              {worker.bio}
            </p>
          </div>

          {/* Specialties */}
          {worker.specialties.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#2A5C8A] uppercase tracking-wider mb-2">
                Especialidades
              </h4>
              <div className="flex flex-wrap gap-2">
                {worker.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#EDF4FF] text-[#2A5C8A] text-xs font-semibold rounded-lg border border-[#D0E4FF]"
                  >
                    ✓ {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trabajos Realizados en el Barrio - visible exclusively in worker profile */}
          {worker.sampleWorks && worker.sampleWorks.length > 0 && (
            <div className="bg-[#F8FAFC] rounded-2xl p-4 md:p-5 border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#2A5C8A]">photo_camera</span>
                  <h4 className="text-sm font-bold text-[#2C3E50]">
                    Trabajos Realizados por {worker.name} en el Barrio ({worker.sampleWorks.length})
                  </h4>
                </div>
                <span className="text-[11px] text-[#2ECC71] font-bold bg-[#E8F8EE] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#C6EFCE]">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  Fotos Verificadas
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {worker.sampleWorks.map((work) => (
                  <div
                    key={work.id}
                    className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
                  >
                    <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={work.imageUrl}
                        alt={work.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {work.date && (
                        <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                          {work.date}
                        </span>
                      )}
                      {work.rating && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-[#E37400] shadow-xs flex items-center gap-0.5">
                          ★ {work.rating}
                        </span>
                      )}
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h5 className="text-xs md:text-sm font-bold text-[#2C3E50] leading-snug">
                          {work.title}
                        </h5>
                        <p className="text-[11px] text-[#6C7A89] mt-1 line-clamp-2 leading-relaxed">
                          {work.description}
                        </p>
                      </div>
                      {work.location && (
                        <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#2A5C8A]">
                          <span className="flex items-center gap-1 font-semibold truncate">
                            <span className="material-symbols-outlined text-[13px]">location_on</span>
                            <span>{work.location}</span>
                          </span>
                          {work.neighborName && (
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {work.neighborName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Neighborhood Reviews */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#2A5C8A] uppercase tracking-wider">
                Valoraciones reales de vecinos de la cuadra ({worker.reviews.length})
              </h4>
              <span className="text-xs font-bold text-[#2ECC71] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                Vecinos Verificados
              </span>
            </div>

            <div className="space-y-3">
              {worker.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#2C3E50]">{rev.author}</span>
                      <span className="text-[10px] text-[#6C7A89]">({rev.neighborhood})</span>
                    </div>
                    <div className="flex items-center text-[#F39C12] text-xs font-bold">
                      {'★'.repeat(Math.floor(rev.rating))}
                      <span className="text-[10px] text-[#6C7A89] ml-1">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#2C3E50] italic leading-relaxed">"{rev.comment}"</p>
                  <p className="text-[10px] text-[#2A5C8A] font-semibold">Trabajo realizado: {rev.workDone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTAs */}
        <div className="p-5 border-t border-[#E2E8F0] bg-[#F8FAFC] rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6C7A89]">
            <span className="font-semibold text-[#2C3E50]">Condición:</span> {worker.conditionOfWork}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6C7A89] hover:bg-slate-200 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => onContact(worker)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FFC067] text-[#2C3E50] hover:brightness-95 active:scale-95 shadow-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Contactar por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
