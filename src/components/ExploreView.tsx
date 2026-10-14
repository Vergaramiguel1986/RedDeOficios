import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TradeWorker, CategoryType, Neighborhood } from '../types';
import { CATEGORIES, calculateDistanceKm } from '../data/mockData';
import { MapTerritorial } from './MapTerritorial';

interface ExploreViewProps {
  workers: TradeWorker[];
  searchQuery: string;
  selectedNeighborhood?: Neighborhood;
  onContactWorker: (worker: TradeWorker) => void;
  onViewWorkerDetails: (worker: TradeWorker) => void;
  onNavigateToPublish: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  workers,
  searchQuery,
  selectedNeighborhood,
  onContactWorker,
  onViewWorkerDetails,
  onNavigateToPublish,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('todos');
  const [radiusKm, setRadiusKm] = useState<number>(2);
  const [viewMode, setViewMode] = useState<'both' | 'mapOnly'>('both');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews'>('distance');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');

  // Categories horizontal scroll management
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollPercent, setScrollPercent] = useState(0);

  const checkScrollState = () => {
    if (!categoriesScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoriesScrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    const max = scrollWidth - clientWidth;
    if (max > 0) {
      setScrollPercent(Math.min(100, Math.max(0, (scrollLeft / max) * 100)));
    }
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, []);

  const handleScrollLeft = () => {
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!categoriesScrollRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const max = categoriesScrollRef.current.scrollWidth - categoriesScrollRef.current.clientWidth;
    categoriesScrollRef.current.scrollTo({ left: ratio * max, behavior: 'smooth' });
  };

  // Filter & sort logic with dynamic distance calculation relative to selectedNeighborhood
  const filteredWorkers = useMemo(() => {
    const center = selectedNeighborhood?.coords ?? [-34.5735, -58.4878];
    const [centerLat, centerLng] = center;

    return workers
      .map((w) => {
        const wLat = w.mapCoords?.lat ?? centerLat;
        const wLng = w.mapCoords?.lng ?? centerLng;
        const dynamicDistKm = calculateDistanceKm(centerLat, centerLng, wLat, wLng);
        const dynamicDistMeters = Math.round(dynamicDistKm * 1000);
        return {
          ...w,
          distanceKm: dynamicDistKm,
          distanceMeters: dynamicDistMeters,
        };
      })
      .filter((w) => {
        // Category filter
        if (selectedCategory !== 'todos' && w.category !== selectedCategory) {
          return false;
        }
        // Distance filter based on dynamic distance from selected neighborhood
        if (w.distanceKm > radiusKm) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = w.name.toLowerCase().includes(q);
          const matchTrade = w.tradeTitle.toLowerCase().includes(q);
          const matchBio = w.bio.toLowerCase().includes(q);
          const matchSpecialty = w.specialties.some((s) => s.toLowerCase().includes(q));
          return matchName || matchTrade || matchBio || matchSpecialty;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewsCount - a.reviewsCount;
      });
  }, [workers, selectedCategory, radiusKm, searchQuery, sortBy, selectedNeighborhood]);

  const activeZoneName = selectedNeighborhood?.name ?? 'Villa Urquiza';
  const activeComuna = selectedNeighborhood?.comuna ?? 'Comuna 12';
  const activeDesc = selectedNeighborhood?.description ?? 'Plaza Echeverría · Bauness y Rivera';

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Contextual & Barra Territorial */}
      <section className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-[#E2E8F0]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF4FF] text-[#2A5C8A] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>Comunidad Activa: {activeZoneName} ({activeComuna})</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2C3E50] tracking-tight">
              Oficios de cercanía en {activeZoneName} y alrededores
            </h1>
            <p className="text-sm md:text-base text-[#6C7A89] leading-relaxed">
              Punto de partida: <span className="font-semibold text-[#2C3E50]">{activeDesc}</span>. Trato directo entre vecinos, presupuestos transparentes y recomendaciones reales de la cuadra.
            </p>
          </div>

          {/* Selector de Radio y Modos de Vista */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {/* Alcance barrial con slider */}
            <div className="flex items-center gap-3 bg-[#F8FAFC] px-4 py-2.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
              <span className="material-symbols-outlined text-[#2A5C8A] text-[20px]">radar</span>
              <div className="flex flex-col">
                <span className="text-xs text-[#6C7A89] leading-tight font-medium">Alcance barrial</span>
                <span className="text-sm font-bold text-[#2C3E50]">
                  Radio: {radiusKm} km a la redonda
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={radiusKm}
                onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                className="w-20 md:w-24 accent-[#2A5C8A] cursor-pointer ml-1"
                aria-label="Selector de radio de alcance"
              />
            </div>

            {/* Switch Vista Mapa + Lista */}
            <div className="inline-flex p-1 bg-[#EDF4FF] rounded-xl border border-[#E2E8F0] text-sm">
              <button
                onClick={() => setViewMode('both')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'both'
                    ? 'bg-white text-[#2C3E50] shadow-xs'
                    : 'text-[#6C7A89] hover:text-[#2C3E50]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-[#2A5C8A]">view_agenda</span>
                <span>Mapa + Lista</span>
              </button>
              <button
                onClick={() => setViewMode('mapOnly')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'mapOnly'
                    ? 'bg-white text-[#2C3E50] shadow-xs'
                    : 'text-[#6C7A89] hover:text-[#2C3E50]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">map</span>
                <span className="hidden sm:inline">Solo Mapa</span>
              </button>
            </div>
          </div>
        </div>

        {/* 
          Barra de Scroll de izquierda a derecha en la sección de oficios
          desde "Todos los oficios" hacia el otro extremo con botones de avance
        */}
        <div className="pt-4 relative">
          {/* Botón flecha izquierda */}
          {canScrollLeft && (
            <button
              onClick={handleScrollLeft}
              className="absolute left-0 top-[45%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-[#E2E8F0] flex items-center justify-center text-[#2A5C8A] hover:bg-[#EDF4FF] transition-all"
              title="Desplazar a la izquierda"
              aria-label="Desplazar oficios a la izquierda"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
          )}

          {/* Contenedor con barra de desplazamiento sin barra visible (solo flechas de desplazar) */}
          <div
            ref={categoriesScrollRef}
            onScroll={checkScrollState}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as CategoryType)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2A5C8A] text-white shadow-xs font-bold'
                      : 'bg-white hover:bg-[#EDF4FF] text-[#6C7A89] hover:text-[#2C3E50] border border-[#E2E8F0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                  <span className="whitespace-nowrap">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Botón flecha derecha */}
          {canScrollRight && (
            <button
              onClick={handleScrollRight}
              className="absolute right-0 top-[45%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-[#E2E8F0] flex items-center justify-center text-[#2A5C8A] hover:bg-[#EDF4FF] transition-all"
              title="Desplazar a la derecha"
              aria-label="Desplazar oficios a la derecha"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          )}
        </div>
      </section>

      {/* Disposición Principal: 2 Columnas con scrollbars independientes (Lista de disponibles / Mapa) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda (Personas Disponibles con barra de scroll independiente) */}
        {viewMode !== 'mapOnly' && (
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-semibold text-[#6C7A89]">
                <span className="text-[#2C3E50] font-bold text-base">
                  {filteredWorkers.length} disponibles
                </span>{' '}
                a menos de {radiusKm} km
              </p>

              <div className="flex items-center gap-1.5 text-xs text-[#6C7A89]">
                <span>Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-bold text-[#2A5C8A] focus:outline-none cursor-pointer hover:underline"
                >
                  <option value="distance">Distancia</option>
                  <option value="rating">Calificación</option>
                  <option value="reviews">Más valorados</option>
                </select>
              </div>
            </div>

            {/* Contenedor con barra de scroll para personas disponibles */}
            <div className="max-h-[660px] overflow-y-auto custom-scrollbar pr-2 space-y-3.5">
              {filteredWorkers.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] text-center space-y-3">
                  <span className="material-symbols-outlined text-[42px] text-[#6C7A89]">search_off</span>
                  <h3 className="font-bold text-[#2C3E50] text-lg">No encontramos oficios con este filtro</h3>
                  <p className="text-sm text-[#6C7A89]">
                    Probá aumentando el radio de alcance barrial o seleccionando "Todos los oficios".
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('todos');
                      setRadiusKm(4);
                    }}
                    className="px-4 py-2 bg-[#2A5C8A] text-white rounded-xl text-sm font-bold shadow-xs hover:brightness-105"
                  >
                    Ampliar búsqueda a 4 km
                  </button>
                </div>
              ) : (
                filteredWorkers.map((worker, index) => {
                  const isSelected = worker.id === selectedWorkerId;

                  return (
                    <article
                      key={`${worker.id}-${index}`}
                      onClick={() => setSelectedWorkerId(isSelected ? '' : worker.id)}
                      className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'border-[#2A5C8A] shadow-md ring-2 ring-[#2A5C8A]/10'
                          : 'border-[#E2E8F0] shadow-xs hover:shadow-sm hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={worker.avatarUrl}
                          alt={worker.avatarAlt}
                          className={`w-14 h-14 rounded-full object-cover shrink-0 border-2 ${
                            worker.id === 'roberto-gomez' ? 'border-[#FFC067]' : 'border-[#2A5C8A]'
                          }`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="text-lg font-bold text-[#2C3E50] truncate">
                              {worker.name}
                            </h3>
                            {worker.urgent24h ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F39C12]/15 text-[#F39C12] shrink-0">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>
                                Urgencias 24h
                              </span>
                            ) : worker.verified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2ECC71]/15 text-[#2ECC71] shrink-0">
                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                Verificado
                              </span>
                            ) : null}
                          </div>

                          <p className="text-sm font-semibold text-[#2A5C8A]">{worker.tradeTitle}</p>

                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <div className="flex items-center text-[#F39C12] text-sm font-bold">
                              <span
                                className="material-symbols-outlined text-[18px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                star
                              </span>
                              <span className="ml-0.5">{worker.rating.toFixed(1)}</span>
                              <span className="text-[#6C7A89] font-normal text-xs ml-1">
                                ({worker.reviewsCount} valoraciones de vecinos)
                              </span>
                            </div>
                            <span className="text-[#6C7A89] text-xs">•</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EDF4FF] text-[#2C3E50]">
                              A {worker.distanceMeters} m
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-[#6C7A89] mt-3 line-clamp-2 leading-relaxed">
                        {worker.bio}
                      </p>

                      <div className="mt-3 py-2 px-3 bg-[#F8FAFC] rounded-xl flex items-center justify-between text-xs border border-[#E2E8F0]">
                        <span className="font-medium text-[#6C7A89]">
                          {worker.estimatedArrival ? 'Tiempo de arribo estimado:' : 'Condición de trabajo:'}
                        </span>
                        <span className="font-bold text-[#2C3E50]">
                          {worker.estimatedArrival || worker.conditionOfWork}
                        </span>
                      </div>

                      {/* Mini Muestra de Trabajos Realizados que lleva directo a ver su perfil */}
                      {worker.sampleWorks && worker.sampleWorks.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-bold text-[#2A5C8A] flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                              <span>Fotos de trabajos realizados ({worker.sampleWorks.length})</span>
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewWorkerDetails(worker);
                              }}
                              className="text-[11px] font-bold text-[#2A5C8A] hover:underline cursor-pointer"
                            >
                              Ver en su perfil →
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {worker.sampleWorks.slice(0, 2).map((work) => (
                              <div
                                key={work.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewWorkerDetails(worker);
                                }}
                                className="relative h-20 rounded-xl overflow-hidden group/thumb cursor-pointer border border-[#E2E8F0] bg-slate-100"
                                title={work.title}
                              >
                                <img
                                  src={work.imageUrl}
                                  alt={work.title}
                                  className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-1.5">
                                  <span className="text-[10px] text-white font-medium truncate leading-tight">
                                    {work.title}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onContactWorker(worker);
                          }}
                          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-transform active:scale-[0.98] text-[#2C3E50] bg-[#FFC067] shadow-2xs hover:brightness-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[17px]">chat</span>
                          Contactar por WhatsApp
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewWorkerDetails(worker);
                          }}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-[#2A5C8A] hover:bg-[#EDF4FF] transition-colors cursor-pointer"
                        >
                          <span>Ver perfil y trabajos</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Columna Derecha: Mapa Territorial con barra de scroll independiente */}
        <div className={`${viewMode === 'mapOnly' ? 'lg:col-span-12' : 'lg:col-span-7'} max-h-[660px] overflow-y-auto custom-scrollbar pl-1 space-y-4`}>
          <MapTerritorial
            workers={filteredWorkers}
            selectedWorkerId={selectedWorkerId}
            onSelectWorker={(id) => setSelectedWorkerId(id)}
            radiusKm={radiusKm}
            onRadiusChange={(r) => setRadiusKm(r)}
            onContactWorker={onContactWorker}
            onViewWorkerDetails={onViewWorkerDetails}
            selectedNeighborhood={selectedNeighborhood}
          />

          {/* Banner de Cercanía Comunitaria */}
          <section
            className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
            style={{ borderLeft: '5px solid #FFC067' }}
          >
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="material-symbols-outlined text-[#F39C12] text-[20px]">handshake</span>
                <h2 className="text-base md:text-lg font-bold text-[#2C3E50]">
                  Conectá con gente de tu barrio con confianza y trato directo
                </h2>
              </div>
              <p className="text-sm text-[#6C7A89]">
                Sin comisiones abusivas ni intermediarios anónimos. Trabajo digno y soluciones rápidas en tu manzana.
              </p>
            </div>
            <button
              onClick={onNavigateToPublish}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#2A5C8A] hover:brightness-105 active:scale-[0.98] shadow-xs transition-all cursor-pointer"
            >
              <span>Sumar mi oficio</span>
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
