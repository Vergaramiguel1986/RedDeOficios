import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo';
import { Neighborhood } from '../types';

interface HeaderProps {
  currentTab: 'explorar' | 'publicar' | 'alertas';
  onSelectTab: (tab: 'explorar' | 'publicar' | 'alertas') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenProfile: () => void;
  selectedNeighborhood: Neighborhood;
  onSelectNeighborhood: (neighborhood: Neighborhood) => void;
  neighborhoods: Neighborhood[];
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onOpenProfile,
  selectedNeighborhood,
  onSelectNeighborhood,
  neighborhoods,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const popoverContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverContainerRef.current &&
        !popoverContainerRef.current.contains(event.target as Node)
      ) {
        setShowLocationPopover(false);
      }
    };
    if (showLocationPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationPopover]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Zone with the exact logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('explorar')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A5C8A] rounded-xl p-0.5 cursor-pointer"
            title="Ir al inicio - Red de Oficios"
          >
            <Logo size="md" />
          </button>

          {/* Location Badge (Dinámico según prestadores) */}
          <div className="relative" ref={popoverContainerRef}>
            <button
              onClick={() => setShowLocationPopover(!showLocationPopover)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#EDF4FF] hover:bg-[#E3EFFF] text-[#2A5C8A] rounded-full text-xs font-semibold border border-[#D0E4FF] transition-colors cursor-pointer"
              title="Cambiar municipio o barrio de búsqueda"
            >
              <span className="material-symbols-outlined text-[17px] text-[#2A5C8A]">location_on</span>
              <span className="font-bold">{selectedNeighborhood.name}</span>
              <span className="text-[11px] text-[#2A5C8A]/75 font-normal">
                {selectedNeighborhood.comuna ? `· ${selectedNeighborhood.comuna}` : ''}
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#6C7A89]">arrow_drop_down</span>
            </button>

            {showLocationPopover && (
              <div className="absolute top-full left-0 mt-2 w-84 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div>
                    <p className="text-xs font-bold text-[#2C3E50]">Zonas y Municipios Dinámicos</p>
                    <p className="text-[10px] text-[#6C7A89]">Generados desde la red de prestadores</p>
                  </div>
                  <span className="text-[10px] text-[#2A5C8A] font-bold bg-[#EDF4FF] px-2 py-0.5 rounded-full">
                    {neighborhoods.length} zonas
                  </span>
                </div>

                <div className="space-y-1 text-xs max-h-72 overflow-y-auto custom-scrollbar pr-0.5">
                  {neighborhoods.map((neighborhood) => {
                    const isSelected = selectedNeighborhood.id === neighborhood.id;
                    return (
                      <button
                        key={neighborhood.id}
                        type="button"
                        onClick={() => {
                          onSelectNeighborhood(neighborhood);
                          setShowLocationPopover(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EDF4FF] text-[#2A5C8A] font-bold border border-[#D0E4FF]'
                            : 'hover:bg-slate-50 text-[#6C7A89] hover:text-[#2C3E50]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={isSelected ? 'text-[#2A5C8A] font-bold' : 'text-[#2C3E50] font-semibold'}>
                            {neighborhood.fullName || neighborhood.name}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {neighborhood.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {neighborhood.workerCount !== undefined && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDF4FF] text-[#2A5C8A] font-extrabold">
                              {neighborhood.workerCount} {neighborhood.workerCount === 1 ? 'oficio' : 'oficios'}
                            </span>
                          )}
                          {isSelected && (
                            <span className="material-symbols-outlined text-[16px] text-[#2A5C8A]">check</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-2">
          <div className="w-full relative flex items-center bg-white rounded-full border border-[#E2E8F0] shadow-xs px-3.5 py-2 hover:border-[#2A5C8A] focus-within:border-[#2A5C8A] focus-within:ring-2 focus-within:ring-[#2A5C8A]/10 transition-all">
            <span className="material-symbols-outlined text-[20px] text-[#6C7A89] mr-2 shrink-0">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar electricista, plomero, reparaciones..."
              className="w-full bg-transparent text-sm text-[#2C3E50] placeholder:text-[#6C7A89] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-xs text-[#6C7A89] hover:text-[#2C3E50] ml-1 p-0.5 cursor-pointer"
                title="Limpiar búsqueda"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden sm:flex items-center gap-1 md:gap-2">
          <button
            onClick={() => onSelectTab('explorar')}
            className={`px-3 md:px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'explorar'
                ? 'bg-[#FFC067] text-[#2C3E50] shadow-sm font-bold'
                : 'text-[#6C7A89] hover:text-[#2C3E50] hover:bg-[#EDF4FF]'
            }`}
          >
            Explorar Oficios y Mapa
          </button>

          <button
            onClick={() => onSelectTab('publicar')}
            className={`px-3 md:px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'publicar'
                ? 'bg-[#FFC067] text-[#2C3E50] shadow-sm font-bold'
                : 'text-[#6C7A89] hover:text-[#2C3E50] hover:bg-[#EDF4FF]'
            }`}
          >
            Publicar Servicio o Necesidad
          </button>

          <button
            onClick={() => onSelectTab('alertas')}
            className={`px-3 md:px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'alertas'
                ? 'bg-[#FFC067] text-[#2C3E50] shadow-sm font-bold'
                : 'text-[#6C7A89] hover:text-[#2C3E50] hover:bg-[#EDF4FF]'
            }`}
          >
            <span>Alertas WhatsApp</span>
            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></span>
          </button>
        </nav>

        {/* User Identity / Profile trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#EDF4FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2A5C8A] cursor-pointer"
            title="Mi cuenta barrial"
          >
            <img
              alt="Perfil de usuario"
              className="w-9 h-9 rounded-full object-cover border-2 border-[#FFC067]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuATYrHb6aCccefWIhfxhfKNZVnu-C8UXHGVh1eJfPjtlqYIL_Jtjb6V_0t-p4XjzvE0__J9xH97phMfAxKDmo0R3qfOLD1sLslfpTz0cYgLYjl26iCSPjd_yfCAh2BCk0UsO8X2LFJYdz3g1Nti-kSRh4EhNZ0oxDDl7CuyYO0WFXteDit48aqmPcKkXfAdEclSVvJ0-lqcLgEZflDXBkVG6NFGe2NMaihEO-VQhXHgAA1x-9P8BQTQ"
            />
            <span className="material-symbols-outlined text-[18px] text-[#6C7A89] hidden sm:inline">
              expand_more
            </span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-xl text-[#2C3E50] hover:bg-[#EDF4FF] cursor-pointer"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#E2E8F0] px-4 py-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between p-2.5 bg-[#EDF4FF] rounded-xl text-xs font-semibold text-[#2A5C8A] border border-[#D0E4FF]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span className="font-bold">{selectedNeighborhood.name}</span>
            </div>
            <select
              value={selectedNeighborhood.id}
              onChange={(e) => {
                const found = neighborhoods.find((n) => n.id === e.target.value);
                if (found) onSelectNeighborhood(found);
              }}
              className="bg-white text-xs font-bold text-[#2A5C8A] py-1 px-2 rounded-lg border border-[#D0E4FF] focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              {neighborhoods.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} ({n.workerCount !== undefined ? `${n.workerCount} oficios` : ''})
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar electricista, plomero..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#2C3E50] placeholder:text-[#6C7A89]"
            />
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={() => {
                onSelectTab('explorar');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${
                currentTab === 'explorar'
                  ? 'bg-[#FFC067] text-[#2C3E50] font-bold'
                  : 'text-[#6C7A89] hover:bg-[#EDF4FF]'
              }`}
            >
              Explorar Oficios y Mapa
            </button>
            <button
              onClick={() => {
                onSelectTab('publicar');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${
                currentTab === 'publicar'
                  ? 'bg-[#FFC067] text-[#2C3E50] font-bold'
                  : 'text-[#6C7A89] hover:bg-[#EDF4FF]'
              }`}
            >
              Publicar Servicio o Necesidad
            </button>
            <button
              onClick={() => {
                onSelectTab('alertas');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
                currentTab === 'alertas'
                  ? 'bg-[#FFC067] text-[#2C3E50] font-bold'
                  : 'text-[#6C7A89] hover:bg-[#EDF4FF]'
              }`}
            >
              <span>Alertas WhatsApp</span>
              <span className="w-2 h-2 rounded-full bg-[#2ECC71]"></span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
