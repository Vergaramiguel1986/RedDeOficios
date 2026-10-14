import React, { useState, useMemo } from 'react';
import { SampleWork, CategoryType, TradeWorker } from '../types';
import { CATEGORIES } from '../data/mockData';

interface WorksGalleryViewProps {
  works: SampleWork[];
  workers: TradeWorker[];
  onContactWorker: (worker: TradeWorker, customMessage?: string) => void;
  onViewWorkerDetails: (worker: TradeWorker) => void;
}

export const WorksGalleryView: React.FC<WorksGalleryViewProps> = ({
  works,
  workers,
  onContactWorker,
  onViewWorkerDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('todos');
  const [selectedPhoto, setSelectedPhoto] = useState<SampleWork | null>(null);

  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'todos') return works;
    return works.filter((w) => w.category === selectedCategory);
  }, [works, selectedCategory]);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Contextual */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-[#E2E8F0] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF4FF] text-[#2A5C8A] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>Galería Territorial Verificada</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2C3E50] tracking-tight">
              Trabajos Realizados en Villa Urquiza y alrededores
            </h1>
            <p className="text-sm md:text-base text-[#6C7A89] leading-relaxed max-w-3xl">
              Mirá las obras, arreglos y remodelaciones que los profesionales del barrio hicieron en las casas de tus vecinos. Calidad comprobada y trato directo.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-[#E2E8F0]">
            <span className="material-symbols-outlined text-[#2ECC71] text-[20px]">verified</span>
            <span className="text-xs font-bold text-[#2C3E50]">
              {filteredWorks.length} trabajos con fotos verificadas
            </span>
          </div>
        </div>

        {/* Categories selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {CATEGORIES.slice(0, 8).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as CategoryType)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2A5C8A] text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-[#EDF4FF] text-[#6C7A89] hover:text-[#2C3E50] border border-[#E2E8F0]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid of Completed Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorks.map((work) => {
          const worker = workers.find((w) => w.id === work.workerId);
          return (
            <article
              key={work.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Photo Banner with Click to Zoom */}
              <div
                className="relative h-56 w-full overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => setSelectedPhoto(work)}
              >
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Badges on image */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#2A5C8A] shadow-xs">
                    {work.date || 'Reciente'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#2ECC71] text-white shadow-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    Verificado
                  </span>
                </div>

                {/* Fullscreen icon on hover */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                </div>

                {/* Location overlay */}
                {work.location && (
                  <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1 drop-shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span>{work.location}</span>
                  </div>
                )}
              </div>

              {/* Work Details & Provider */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-[#2C3E50] group-hover:text-[#2A5C8A] transition-colors leading-snug">
                    {work.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#6C7A89] leading-relaxed line-clamp-3">
                    {work.description}
                  </p>
                </div>

                {/* Neighbor recommendation quote if present */}
                {work.reviewComment && (
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs text-[#2C3E50] space-y-1">
                    <div className="flex items-center gap-1 text-[#FFC067] font-bold">
                      <span>★★★★★</span>
                      <span className="text-[#6C7A89] font-medium ml-1">
                        {work.neighborName || 'Vecino verificado'}
                      </span>
                    </div>
                    <p className="italic text-[#4A5568]">"{work.reviewComment}"</p>
                  </div>
                )}

                {/* Worker Identity Strip */}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <div
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => worker && onViewWorkerDetails(worker)}
                  >
                    <img
                      src={work.workerAvatar}
                      alt={work.workerName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#2A5C8A] shadow-xs"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#2C3E50] leading-tight">
                        {work.workerName}
                      </h4>
                      <p className="text-xs text-[#6C7A89] leading-tight">{work.workerTrade}</p>
                    </div>
                  </div>

                  {/* Contact button */}
                  {worker && (
                    <button
                      onClick={() =>
                        onContactWorker(
                          worker,
                          `Hola ${worker.name}! Vi en Red de Oficios la foto de tu trabajo "${work.title}" en Villa Urquiza y me gustaría pedirte presupuesto para un trabajo similar.`
                        )
                      }
                      className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[#2C3E50] bg-[#FFC067] hover:brightness-95 transition-transform active:scale-[0.98] shadow-xs shrink-0"
                      title="Pedir presupuesto similar por WhatsApp"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>Consultar</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox Modal for Photo Zoom */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-white/20 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              className="w-full h-80 object-cover"
            />

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#2A5C8A] uppercase tracking-wider">
                  {selectedPhoto.category.toUpperCase()} • {selectedPhoto.location}
                </span>
                <h3 className="text-xl font-extrabold text-[#2C3E50] mt-1">
                  {selectedPhoto.title}
                </h3>
                <p className="text-sm text-[#6C7A89] mt-2 leading-relaxed">
                  {selectedPhoto.description}
                </p>
              </div>

              {selectedPhoto.reviewComment && (
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                  <p className="text-xs font-bold text-[#2C3E50] mb-1">
                    Reseña del vecino ({selectedPhoto.neighborName}):
                  </p>
                  <p className="text-sm italic text-[#4A5568]">"{selectedPhoto.reviewComment}"</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPhoto.workerAvatar}
                    alt={selectedPhoto.workerName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#2A5C8A]"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#2C3E50]">{selectedPhoto.workerName}</h4>
                    <p className="text-xs text-[#6C7A89]">{selectedPhoto.workerTrade}</p>
                  </div>
                </div>

                {(() => {
                  const worker = workers.find((w) => w.id === selectedPhoto.workerId);
                  if (!worker) return null;
                  return (
                    <button
                      onClick={() => {
                        setSelectedPhoto(null);
                        onContactWorker(
                          worker,
                          `Hola ${worker.name}! Vi tu trabajo "${selectedPhoto.title}" en Red de Oficios y quiero consultar por presupuesto.`
                        );
                      }}
                      className="py-2.5 px-4 rounded-xl text-sm font-bold text-[#2C3E50] bg-[#FFC067] hover:brightness-95 flex items-center gap-2 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      <span>Pedir presupuesto</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
