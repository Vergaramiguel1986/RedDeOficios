import React, { useState, useMemo, useEffect } from 'react';
import { CategoryType, TradeWorker, ServiceRequest, Neighborhood } from '../types';
import { CATEGORIES } from '../data/mockData';
import {
  REGIONES_DATA,
  MUNICIPIOS_DATA,
  getLocalidadesForMunicipio,
  resolvePreciseCoords,
  normalizeName,
  cleanDisplayName,
  findClosestLocality,
  reverseGeocodeGPS,
} from '../utils/localityUtils';

interface PublishViewProps {
  onAddWorker: (worker: TradeWorker) => void;
  onAddRequest: (request: ServiceRequest) => void;
  onNavigateToExplore: () => void;
  onNavigateToAlerts: () => void;
  selectedNeighborhood?: Neighborhood;
  onSeedSampleWorkers?: () => void;
}

const STORAGE_MUNI_KEY = 'red_oficios_saved_muni';
const STORAGE_LOC_KEY = 'red_oficios_saved_loc';

export const PublishView: React.FC<PublishViewProps> = ({
  onAddWorker,
  onAddRequest,
  onNavigateToExplore,
  onNavigateToAlerts,
  selectedNeighborhood,
  onSeedSampleWorkers,
}) => {
  const [activeTab, setActiveTab] = useState<'prestador' | 'vecino'>('prestador');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Inicialización inteligente con memoria local (localStorage) y fallback al barrio activo
  const initialLocInfo = useMemo(() => {
    // 1. Revisar memoria local (localStorage)
    try {
      const savedMuni = localStorage.getItem(STORAGE_MUNI_KEY);
      const savedLoc = localStorage.getItem(STORAGE_LOC_KEY);
      if (savedMuni) {
        const found = MUNICIPIOS_DATA.find(
          (m) => normalizeName(m.nombre) === normalizeName(savedMuni)
        );
        if (found) {
          const locMatch = found.localidades.find(
            (l) => normalizeName(l.nombre) === normalizeName(savedLoc || '')
          );
          return {
            muni: found.nombre,
            loc: locMatch ? locMatch.nombre : found.localidades[0]?.nombre || 'Centro',
          };
        }
      }
    } catch {
      // Ignorar fallo de almacenamiento
    }

    // 2. Si no hay memoria, utilizar la zona activa del header
    if (selectedNeighborhood) {
      const name = selectedNeighborhood.name;
      const match = name.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        return { loc: match[1].trim(), muni: match[2].trim() };
      }
      const found = MUNICIPIOS_DATA.find((m) => normalizeName(m.nombre) === normalizeName(name));
      if (found) {
        return { muni: found.nombre, loc: found.localidades[0]?.nombre || '' };
      }
    }

    // 3. Fallback predeterminado a Pilar
    return { muni: 'Pilar', loc: 'Del Viso' };
  }, [selectedNeighborhood]);

  // Estados de búsqueda rápida estilo Computrabajo
  const [workerSearchTerm, setWorkerSearchTerm] = useState('');
  const [vecinoSearchTerm, setVecinoSearchTerm] = useState('');

  // Estados para GPS del celular
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);
  const [workerCustomGpsCoords, setWorkerCustomGpsCoords] = useState<[number, number] | null>(null);
  const [vecinoCustomGpsCoords, setVecinoCustomGpsCoords] = useState<[number, number] | null>(null);

  // Estados para Prestador (Trabajador)
  const [workerName, setWorkerName] = useState('');
  const [workerTrade, setWorkerTrade] = useState('');
  const [workerCategory, setWorkerCategory] = useState<CategoryType>('electricidad');
  const [workerMunicipio, setWorkerMunicipio] = useState<string>(initialLocInfo.muni || 'Pilar');
  const [workerLocalidad, setWorkerLocalidad] = useState<string>(initialLocInfo.loc || 'Del Viso');
  const [workerStreet, setWorkerStreet] = useState('');
  const [workerBio, setWorkerBio] = useState('');
  const [workerCondition, setWorkerCondition] = useState('Presupuesto sin cargo en la zona');
  const [workerPhone, setWorkerPhone] = useState('+54 9 11 9988-1122');
  const [workerSpecialties, setWorkerSpecialties] = useState('Instalaciones, urgencias, presupuestos, mantenimiento');

  // Estados para Vecino (Pedido de servicio)
  const [vecinoTitle, setVecinoTitle] = useState('');
  const [vecinoCategory, setVecinoCategory] = useState<CategoryType>('plomeria');
  const [vecinoDesc, setVecinoDesc] = useState('');
  const [vecinoUrgency, setVecinoUrgency] = useState<'normal' | 'hoy' | 'urgente24h'>('normal');
  const [vecinoMunicipio, setVecinoMunicipio] = useState<string>(initialLocInfo.muni || 'Pilar');
  const [vecinoLocalidad, setVecinoLocalidad] = useState<string>(initialLocInfo.loc || 'Del Viso');
  const [vecinoStreet, setVecinoStreet] = useState('');
  const [vecinoBudget, setVecinoBudget] = useState('Presupuesto a convenir con visita');
  const [vecinoContactName, setVecinoContactName] = useState('Martín V.');
  const [vecinoPhone, setVecinoPhone] = useState('+54 9 11 4455-6677');

  // Guardar en localStorage cada vez que cambie municipio o localidad
  const saveLocationToStorage = (muni: string, loc: string) => {
    try {
      if (muni) localStorage.setItem(STORAGE_MUNI_KEY, muni);
      if (loc) localStorage.setItem(STORAGE_LOC_KEY, loc);
    } catch {
      // Ignorar errores de almacenamiento
    }
  };

  // Localidades dinámicas del municipio para Prestador
  const availableWorkerLocalidades = useMemo(() => {
    return getLocalidadesForMunicipio(workerMunicipio);
  }, [workerMunicipio]);

  // Localidades dinámicas del municipio para Vecino
  const availableVecinoLocalidades = useMemo(() => {
    return getLocalidadesForMunicipio(vecinoMunicipio);
  }, [vecinoMunicipio]);

  // Filtrado reactivo de municipios para Prestador (según el buscador instantáneo)
  const filteredWorkerRegiones = useMemo(() => {
    if (!workerSearchTerm.trim()) return REGIONES_DATA;
    const q = normalizeName(workerSearchTerm);
    return REGIONES_DATA.map((reg) => ({
      region: reg.region,
      partidos: reg.partidos.filter(
        (p) =>
          normalizeName(cleanDisplayName(p.nombre)).includes(q) ||
          normalizeName(p.nombre).includes(q) ||
          p.localidades.some((l) => normalizeName(cleanDisplayName(l.nombre)).includes(q))
      ),
    })).filter((reg) => reg.partidos.length > 0);
  }, [workerSearchTerm]);

  // Filtrado reactivo de municipios para Vecino
  const filteredVecinoRegiones = useMemo(() => {
    if (!vecinoSearchTerm.trim()) return REGIONES_DATA;
    const q = normalizeName(vecinoSearchTerm);
    return REGIONES_DATA.map((reg) => ({
      region: reg.region,
      partidos: reg.partidos.filter(
        (p) =>
          normalizeName(cleanDisplayName(p.nombre)).includes(q) ||
          normalizeName(p.nombre).includes(q) ||
          p.localidades.some((l) => normalizeName(cleanDisplayName(l.nombre)).includes(q))
      ),
    })).filter((reg) => reg.partidos.length > 0);
  }, [vecinoSearchTerm]);

  // Manejador del cambio de municipio para Prestador
  const handleWorkerMunicipioChange = (newMuni: string) => {
    setWorkerMunicipio(newMuni);
    setWorkerCustomGpsCoords(null);
    const locs = getLocalidadesForMunicipio(newMuni);
    const newLoc = locs.length > 0 ? locs[0].nombre : '';
    setWorkerLocalidad(newLoc);
    saveLocationToStorage(newMuni, newLoc);
  };

  // Manejador del cambio de localidad para Prestador
  const handleWorkerLocalidadChange = (newLoc: string) => {
    setWorkerLocalidad(newLoc);
    setWorkerCustomGpsCoords(null);
    saveLocationToStorage(workerMunicipio, newLoc);
  };

  // Manejador del cambio de municipio para Vecino
  const handleVecinoMunicipioChange = (newMuni: string) => {
    setVecinoMunicipio(newMuni);
    setVecinoCustomGpsCoords(null);
    const locs = getLocalidadesForMunicipio(newMuni);
    const newLoc = locs.length > 0 ? locs[0].nombre : '';
    setVecinoLocalidad(newLoc);
    saveLocationToStorage(newMuni, newLoc);
  };

  // Manejador del cambio de localidad para Vecino
  const handleVecinoLocalidadChange = (newLoc: string) => {
    setVecinoLocalidad(newLoc);
    setVecinoCustomGpsCoords(null);
    saveLocationToStorage(vecinoMunicipio, newLoc);
  };

  // Detección automática mediante el GPS del dispositivo
  const handleDetectGPS = (target: 'prestador' | 'vecino') => {
    if (!navigator.geolocation) {
      setGpsStatusMessage('La geolocalización no está disponible en este dispositivo.');
      setTimeout(() => setGpsStatusMessage(null), 3500);
      return;
    }

    setIsGpsLoading(true);
    setGpsStatusMessage('Detectando tu ubicación GPS con precisión...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const result = await reverseGeocodeGPS(lat, lng);
          if (target === 'prestador') {
            setWorkerMunicipio(result.municipio);
            setWorkerLocalidad(result.localidad);
            setWorkerCustomGpsCoords([lat, lng]);
            saveLocationToStorage(result.municipio, result.localidad);
          } else {
            setVecinoMunicipio(result.municipio);
            setVecinoLocalidad(result.localidad);
            setVecinoCustomGpsCoords([lat, lng]);
            saveLocationToStorage(result.municipio, result.localidad);
          }
          setGpsStatusMessage(`✓ GPS detectado: ${cleanDisplayName(result.localidad)}, ${cleanDisplayName(result.municipio)}`);
        } catch {
          const closest = findClosestLocality(lat, lng);
          if (target === 'prestador') {
            setWorkerMunicipio(closest.municipio);
            setWorkerLocalidad(closest.localidad);
            setWorkerCustomGpsCoords([lat, lng]);
            saveLocationToStorage(closest.municipio, closest.localidad);
          } else {
            setVecinoMunicipio(closest.municipio);
            setVecinoLocalidad(closest.localidad);
            setVecinoCustomGpsCoords([lat, lng]);
            saveLocationToStorage(closest.municipio, closest.localidad);
          }
          setGpsStatusMessage(`✓ GPS detectado: ${cleanDisplayName(closest.localidad)}, ${cleanDisplayName(closest.municipio)}`);
        } finally {
          setIsGpsLoading(false);
          setTimeout(() => setGpsStatusMessage(null), 4000);
        }
      },
      (error) => {
        setIsGpsLoading(false);
        console.warn('Error al obtener GPS:', error);
        setGpsStatusMessage('No se pudo acceder al GPS. Podés elegir tu municipio en la lista.');
        setTimeout(() => setGpsStatusMessage(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Coordenadas exactas en tiempo real para Prestador (usa GPS directo si se activó, o las de la localidad)
  const currentWorkerCoords = useMemo((): [number, number] => {
    if (workerCustomGpsCoords) return workerCustomGpsCoords;
    const foundLoc = availableWorkerLocalidades.find((l) => l.nombre === workerLocalidad);
    if (foundLoc) return foundLoc.coords;
    return resolvePreciseCoords(workerMunicipio, workerLocalidad, workerStreet);
  }, [workerCustomGpsCoords, availableWorkerLocalidades, workerLocalidad, workerMunicipio, workerStreet]);

  // Coordenadas exactas en tiempo real para Vecino
  const currentVecinoCoords = useMemo((): [number, number] => {
    if (vecinoCustomGpsCoords) return vecinoCustomGpsCoords;
    const foundLoc = availableVecinoLocalidades.find((l) => l.nombre === vecinoLocalidad);
    if (foundLoc) return foundLoc.coords;
    return resolvePreciseCoords(vecinoMunicipio, vecinoLocalidad, vecinoStreet);
  }, [vecinoCustomGpsCoords, availableVecinoLocalidades, vecinoLocalidad, vecinoMunicipio, vecinoStreet]);

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim() || !workerTrade.trim()) return;

    const muni = cleanDisplayName(workerMunicipio.trim());
    const loc = cleanDisplayName(workerLocalidad.trim() || muni);

    // Coordenadas exactas asignadas
    const baseCoords = currentWorkerCoords;

    // Pequeño jitter para evitar solapamientos exactos si hay dos prestadores en la misma esquina
    const jitterLat = workerCustomGpsCoords ? 0 : (Math.random() - 0.5) * 0.0015;
    const jitterLng = workerCustomGpsCoords ? 0 : (Math.random() - 0.5) * 0.0015;
    const workerLat = Number((baseCoords[0] + jitterLat).toFixed(6));
    const workerLng = Number((baseCoords[1] + jitterLng).toFixed(6));

    const zoneDisplay = loc.toLowerCase() !== muni.toLowerCase() ? `${loc} (${muni})` : loc;
    const fullAddress = workerStreet.trim() ? `${workerStreet.trim()}, ${zoneDisplay}` : zoneDisplay;

    // Persistir última selección en localStorage
    saveLocationToStorage(workerMunicipio, workerLocalidad);

    const newWorker: TradeWorker = {
      id: 'worker-' + Date.now(),
      name: workerName.trim(),
      tradeTitle: workerTrade.trim(),
      category: workerCategory,
      verified: true,
      urgent24h: false,
      rating: 5.0,
      reviewsCount: 1,
      distanceMeters: 300,
      distanceKm: 0.3,
      municipio: muni,
      localidad: loc,
      zone: zoneDisplay,
      location: zoneDisplay,
      address: fullAddress,
      bio:
        workerBio.trim() ||
        `Prestador de ${zoneDisplay} con recomendaciones barriales y compromiso de calidad.`,
      conditionOfWork: workerCondition,
      whatsappNumber: workerPhone,
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      avatarAlt: `Foto de ${workerName}`,
      mapCoords: {
        x: 350,
        y: 300,
        lat: workerLat,
        lng: workerLng,
        walkingTime: 'A 5 min caminando',
      },
      specialties: workerSpecialties.split(',').map((s) => s.trim()).filter(Boolean),
      reviews: [
        {
          id: 'rev-' + Date.now(),
          author: 'Vecino verificado',
          neighborhood: zoneDisplay,
          date: 'Reciente',
          rating: 5,
          comment: `Se sumó a la Red de Oficios comunitaria en ${zoneDisplay}.`,
          workDone: workerTrade,
        },
      ],
    };

    onAddWorker(newWorker);
    setSuccessNotice(`¡Tu oficio fue registrado en ${zoneDisplay}! Guardado en Firestore y ubicado con precisión en el mapa.`);
    setTimeout(() => {
      onNavigateToExplore();
    }, 1500);
  };

  const handleVecinoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vecinoTitle.trim()) return;

    const muni = cleanDisplayName(vecinoMunicipio.trim());
    const loc = cleanDisplayName(vecinoLocalidad.trim() || muni);
    const zoneDisplay = loc.toLowerCase() !== muni.toLowerCase() ? `${loc} (${muni})` : loc;
    const fullLocation = vecinoStreet.trim()
      ? `${vecinoStreet.trim()}, ${zoneDisplay}`
      : zoneDisplay;

    saveLocationToStorage(vecinoMunicipio, vecinoLocalidad);

    const newRequest: ServiceRequest = {
      id: 'req-' + Date.now(),
      title: vecinoTitle.trim(),
      category: vecinoCategory,
      description: vecinoDesc.trim() || `Vecino de ${zoneDisplay} solicita presupuesto para trabajo de cercanía.`,
      urgency: vecinoUrgency,
      location: fullLocation,
      budgetEstimated: vecinoBudget,
      contactName: vecinoContactName.trim() || 'Vecino',
      contactPhone: vecinoPhone.trim() || '+54 9 11 ...',
      createdAt: 'Hace instantes',
      status: 'abierto',
    };

    onAddRequest(newRequest);
    setSuccessNotice(`¡Tu pedido fue publicado en ${zoneDisplay} y notificado a los prestadores de la zona!`);
    setTimeout(() => {
      onNavigateToAlerts();
    }, 1500);
  };

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Notice Banner */}
      {successNotice && (
        <div className="p-4 bg-[#2ECC71]/15 border border-[#2ECC71] text-[#2C3E50] rounded-2xl flex items-center gap-3 animate-fade-in shadow-xs">
          <span className="material-symbols-outlined text-[#2ECC71] text-[24px]">task_alt</span>
          <span className="text-sm font-bold">{successNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF4FF] text-[#2A5C8A] text-xs font-bold">
          <span className="material-symbols-outlined text-[16px]">pin_drop</span>
          <span>Red Territorial PBA y CABA · Cobertura Total</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#2C3E50]">
          Publicar Servicio o Necesidad Barrial
        </h1>
        <p className="text-sm text-[#6C7A89]">
          Seleccioná tu ubicación en dos desplegables limpios estilo Computrabajo o usá el botón GPS para ubicarte automáticamente.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#EDF4FF] rounded-2xl border border-[#D0E4FF]">
        <button
          onClick={() => setActiveTab('prestador')}
          className={`py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'prestador'
              ? 'bg-white text-[#2C3E50] shadow-xs'
              : 'text-[#6C7A89] hover:text-[#2C3E50]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-[#2A5C8A]">engineering</span>
          <span>Ofrezco mi Oficio (Soy Trabajador)</span>
        </button>

        <button
          onClick={() => setActiveTab('vecino')}
          className={`py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'vecino'
              ? 'bg-white text-[#2C3E50] shadow-xs'
              : 'text-[#6C7A89] hover:text-[#2C3E50]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-[#2A5C8A]">search</span>
          <span>Necesito un Oficio (Soy Vecino)</span>
        </button>
      </div>

      {/* Form: Soy Prestador (Trabajador) */}
      {activeTab === 'prestador' ? (
        <form onSubmit={handleWorkerSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#2C3E50]">Registrar mi oficio en la red</h2>
              <p className="text-xs text-[#6C7A89] mt-0.5">
                Al guardar, se ejecuta automáticamente <code>addDoc(collection(db, 'workers'), ...)</code> en Firestore.
              </p>
            </div>
            {onSeedSampleWorkers && (
              <button
                type="button"
                onClick={onSeedSampleWorkers}
                className="shrink-0 px-3 py-1.5 bg-[#FFA000] hover:bg-[#FF8F00] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                <span>Cargar prestadores de prueba</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50]">Nombre y Apellido</label>
              <input
                type="text"
                required
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="Ej: Marcelo Bianchi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50]">Especialidad / Título</label>
              <input
                type="text"
                required
                value={workerTrade}
                onChange={(e) => setWorkerTrade(e.target.value)}
                placeholder="Ej: Electricista Matriculado e Instalador"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[#2C3E50]">Categoría principal</label>
              <select
                value={workerCategory}
                onChange={(e) => setWorkerCategory(e.target.value as CategoryType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] bg-white focus:outline-none focus:border-[#2A5C8A] cursor-pointer"
              >
                {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* SECCIÓN DE UBICACIÓN LIMPIA ESTILO COMPUTRABAJO */}
            <div className="md:col-span-2 p-5 bg-[#F8FAFC] rounded-2xl border-2 border-[#D0E4FF] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2A5C8A] text-[22px]">location_on</span>
                  <div>
                    <span className="text-xs font-extrabold text-[#2C3E50] uppercase tracking-wide block">
                      Ubicación (Partido y Localidad)
                    </span>
                    <span className="text-[11px] text-[#6C7A89]">
                      Seleccioná tu zona en dos menús limpios o detectala con GPS.
                    </span>
                  </div>
                </div>

                {/* BOTÓN RÁPIDO DE GPS */}
                <button
                  type="button"
                  onClick={() => handleDetectGPS('prestador')}
                  disabled={isGpsLoading}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#EDF4FF] hover:bg-[#D9E9FF] text-[#2A5C8A] border border-[#BFDBFE] text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-60 self-start sm:self-auto"
                >
                  <span className={`material-symbols-outlined text-[18px] text-[#2A5C8A] ${isGpsLoading ? 'animate-spin' : ''}`}>
                    {isGpsLoading ? 'sync' : 'my_location'}
                  </span>
                  <span>{isGpsLoading ? 'Detectando GPS...' : 'Usar mi ubicación actual'}</span>
                </button>
              </div>

              {/* Mensaje de estado de GPS */}
              {gpsStatusMessage && (
                <div className="p-2.5 bg-[#EDF4FF] border border-[#BFDBFE] text-[#2A5C8A] text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
                  <span className="material-symbols-outlined text-[18px]">gps_fixed</span>
                  <span>{gpsStatusMessage}</span>
                </div>
              )}

              {/* Buscador instantáneo integrado estilo Computrabajo */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#64748B]">
                  search
                </span>
                <input
                  type="text"
                  value={workerSearchTerm}
                  onChange={(e) => setWorkerSearchTerm(e.target.value)}
                  placeholder="Buscar partido o localidad (ej: Mar del Plata, Pilar, Tigre, Quilmes, Belgrano)..."
                  className="w-full pl-10 pr-9 py-2.5 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#2C3E50] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2A5C8A] shadow-2xs"
                />
                {workerSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setWorkerSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#2C3E50] cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* LOS 2 DESPLEGABLES LIMPIOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Desplegable 1: Partido / Municipio (Limpio y directo, sin paréntesis redundantes) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2C3E50] flex items-center justify-between">
                    <span>Partido / Municipio</span>
                    <span className="text-[10px] text-[#2A5C8A] font-bold bg-[#EDF4FF] px-2 py-0.5 rounded">
                      {cleanDisplayName(workerMunicipio)}
                    </span>
                  </label>
                  <select
                    value={workerMunicipio}
                    onChange={(e) => handleWorkerMunicipioChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#2C3E50] font-bold focus:outline-none focus:border-[#2A5C8A] shadow-2xs cursor-pointer"
                  >
                    {filteredWorkerRegiones.map((reg) => (
                      <optgroup key={reg.region} label={reg.region}>
                        {reg.partidos.map((m) => (
                          <option key={m.nombre} value={m.nombre}>
                            {cleanDisplayName(m.nombre)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Desplegable 2: Localidad / Barrio (Limpio, dinámico y sin texto redundante) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2C3E50] flex items-center justify-between">
                    <span>Localidad / Barrio</span>
                    <span className="text-[10px] text-[#2ECC71] font-bold bg-[#E8F8F0] text-[#1E7E34] px-2 py-0.5 rounded">
                      {availableWorkerLocalidades.length} localidades
                    </span>
                  </label>
                  <select
                    value={workerLocalidad}
                    onChange={(e) => handleWorkerLocalidadChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#2C3E50] font-bold focus:outline-none focus:border-[#2A5C8A] shadow-2xs cursor-pointer"
                  >
                    {availableWorkerLocalidades.map((loc) => (
                      <option key={loc.nombre} value={loc.nombre}>
                        {cleanDisplayName(loc.nombre)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calle opcional de aproximación */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-[#2C3E50]">
                  Calle / Altura de referencia (opcional)
                </label>
                <input
                  type="text"
                  value={workerStreet}
                  onChange={(e) => setWorkerStreet(e.target.value)}
                  placeholder="Ej: Av. Cazón al 1200, Mitre al 400, Calle 8 e/ 45 y 46"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
                />
              </div>

              {/* Panel de Coordenadas Leaflet Exactas */}
              <div className="p-3 bg-white rounded-xl border border-[#BFDBFE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2A5C8A] text-[20px]">pin_drop</span>
                  <span className="text-xs font-bold text-[#2C3E50]">
                    Punto en el mapa: <span className="text-[#2A5C8A]">{cleanDisplayName(workerLocalidad)}, {cleanDisplayName(workerMunicipio)}</span>
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EDF4FF] rounded-lg border border-[#D0E4FF] font-mono text-[11px] font-bold text-[#2A5C8A] self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[14px]">gps_fixed</span>
                  <span>{currentWorkerCoords[0].toFixed(4)}, {currentWorkerCoords[1].toFixed(4)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[#2C3E50]">Presentación para los vecinos</label>
              <textarea
                rows={3}
                value={workerBio}
                onChange={(e) => setWorkerBio(e.target.value)}
                placeholder="Contá cuántos años de experiencia tenés, qué garantías ofrecés y en qué tipo de trabajos te destacás..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50]">Condición de trabajo</label>
              <input
                type="text"
                value={workerCondition}
                onChange={(e) => setWorkerCondition(e.target.value)}
                placeholder={`Ej: Presupuesto sin cargo en ${cleanDisplayName(workerLocalidad) || cleanDisplayName(workerMunicipio)}`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50]">Número de WhatsApp directo</label>
              <input
                type="text"
                value={workerPhone}
                onChange={(e) => setWorkerPhone(e.target.value)}
                placeholder="+54 9 11 ..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[#2C3E50]">Especialidades (separadas por coma)</label>
              <input
                type="text"
                value={workerSpecialties}
                onChange={(e) => setWorkerSpecialties(e.target.value)}
                placeholder="Instalaciones, urgencias, presupuestos, mantenimiento"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#6C7A89] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#2ECC71]">verified</span>
              Perfil persistido en Firestore y guardado en tu dispositivo.
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2A5C8A] text-white text-sm font-bold hover:brightness-105 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sumar mi Oficio en {cleanDisplayName(workerLocalidad)} ({cleanDisplayName(workerMunicipio)})</span>
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
            </button>
          </div>
        </form>
      ) : (
        /* Form: Soy Vecino */
        <form onSubmit={handleVecinoSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-lg font-bold text-[#2C3E50]">Publicar pedido de arreglo o reparación</h2>
            <p className="text-xs text-[#6C7A89] mt-0.5">
              Los trabajadores de tu localidad recibirán tu aviso directo por WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[#2C3E50]">¿Qué necesitás resolver?</label>
              <input
                type="text"
                required
                value={vecinoTitle}
                onChange={(e) => setVecinoTitle(e.target.value)}
                placeholder="Ej: Reparación de pérdida en bomba sumergible y canilla de entrada"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] placeholder:text-[#6C7A89] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50]">Rubro / Categoría</label>
              <select
                value={vecinoCategory}
                onChange={(e) => setVecinoCategory(e.target.value as CategoryType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] bg-white focus:outline-none focus:border-[#2A5C8A] cursor-pointer"
              >
                {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50]">Urgencia del trabajo</label>
              <select
                value={vecinoUrgency}
                onChange={(e) => setVecinoUrgency(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] bg-white focus:outline-none focus:border-[#2A5C8A] cursor-pointer"
              >
                <option value="normal">Normal (Esta semana)</option>
                <option value="hoy">Hoy mismo</option>
                <option value="urgente24h">Emergencia 24h inmediata</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[#2C3E50]">Detalles del problema o medidas</label>
              <textarea
                rows={3}
                value={vecinoDesc}
                onChange={(e) => setVecinoDesc(e.target.value)}
                placeholder="Contá qué pasó, si ya tenés los materiales o repuestos, y días/horarios en los que estás en tu casa..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] placeholder:text-[#6C7A89] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>

            {/* SECCIÓN ESTRUCTURADA PARA VECINO: ESTILO COMPUTRABAJO */}
            <div className="md:col-span-2 p-5 bg-[#F8FAFC] rounded-2xl border-2 border-[#D0E4FF] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2A5C8A] text-[22px]">pin_drop</span>
                  <div>
                    <span className="text-xs font-extrabold text-[#2C3E50] uppercase tracking-wide block">
                      Zona del Pedido (Partido y Localidad)
                    </span>
                    <span className="text-[11px] text-[#6C7A89]">
                      Elegí tu zona o usá el botón GPS para ubicarte de forma automática.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDetectGPS('vecino')}
                  disabled={isGpsLoading}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#EDF4FF] hover:bg-[#D9E9FF] text-[#2A5C8A] border border-[#BFDBFE] text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-60 self-start sm:self-auto"
                >
                  <span className={`material-symbols-outlined text-[18px] text-[#2A5C8A] ${isGpsLoading ? 'animate-spin' : ''}`}>
                    {isGpsLoading ? 'sync' : 'my_location'}
                  </span>
                  <span>{isGpsLoading ? 'Detectando GPS...' : 'Usar mi ubicación actual'}</span>
                </button>
              </div>

              {gpsStatusMessage && (
                <div className="p-2.5 bg-[#EDF4FF] border border-[#BFDBFE] text-[#2A5C8A] text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
                  <span className="material-symbols-outlined text-[18px]">gps_fixed</span>
                  <span>{gpsStatusMessage}</span>
                </div>
              )}

              {/* Buscador instantáneo integrado para Vecino */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#64748B]">
                  search
                </span>
                <input
                  type="text"
                  value={vecinoSearchTerm}
                  onChange={(e) => setVecinoSearchTerm(e.target.value)}
                  placeholder="Buscar partido o localidad (ej: Mar del Plata, Pilar, Tigre, Quilmes)..."
                  className="w-full pl-10 pr-9 py-2.5 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#2C3E50] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2A5C8A] shadow-2xs"
                />
                {vecinoSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setVecinoSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#2C3E50] cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* LOS 2 DESPLEGABLES LIMPIOS PARA VECINO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2C3E50] flex items-center justify-between">
                    <span>Partido / Municipio</span>
                    <span className="text-[10px] text-[#2A5C8A] font-bold bg-[#EDF4FF] px-2 py-0.5 rounded">
                      {cleanDisplayName(vecinoMunicipio)}
                    </span>
                  </label>
                  <select
                    value={vecinoMunicipio}
                    onChange={(e) => handleVecinoMunicipioChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#2C3E50] font-bold focus:outline-none focus:border-[#2A5C8A] shadow-2xs cursor-pointer"
                  >
                    {filteredVecinoRegiones.map((reg) => (
                      <optgroup key={reg.region} label={reg.region}>
                        {reg.partidos.map((m) => (
                          <option key={m.nombre} value={m.nombre}>
                            {cleanDisplayName(m.nombre)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2C3E50] flex items-center justify-between">
                    <span>Localidad / Barrio</span>
                    <span className="text-[10px] text-[#2ECC71] font-bold bg-[#E8F8F0] text-[#1E7E34] px-2 py-0.5 rounded">
                      {availableVecinoLocalidades.length} localidades
                    </span>
                  </label>
                  <select
                    value={vecinoLocalidad}
                    onChange={(e) => handleVecinoLocalidadChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#2C3E50] font-bold focus:outline-none focus:border-[#2A5C8A] shadow-2xs cursor-pointer"
                  >
                    {availableVecinoLocalidades.map((loc) => (
                      <option key={loc.nombre} value={loc.nombre}>
                        {cleanDisplayName(loc.nombre)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calle opcional */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-[#2C3E50]">Calle / Cuadra de referencia (opcional)</label>
                <input
                  type="text"
                  value={vecinoStreet}
                  onChange={(e) => setVecinoStreet(e.target.value)}
                  placeholder="Ej: Av. San Martín al 400 o Calle 7 entre 50 y 51"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
                />
              </div>

              {/* Coordenadas asignadas */}
              <div className="p-3 bg-white rounded-xl border border-[#BFDBFE] flex items-center justify-between text-xs text-[#2A5C8A]">
                <span>
                  <strong>Geocodificación:</strong> {cleanDisplayName(vecinoLocalidad)}, {cleanDisplayName(vecinoMunicipio)}
                </span>
                <span className="font-mono text-[11px] font-bold bg-[#EDF4FF] px-2.5 py-1 rounded border border-[#D0E4FF]">
                  {currentVecinoCoords[0].toFixed(4)}, {currentVecinoCoords[1].toFixed(4)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50]">Presupuesto estimativo</label>
              <input
                type="text"
                value={vecinoBudget}
                onChange={(e) => setVecinoBudget(e.target.value)}
                placeholder="A convenir o rango aproximado"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C3E50]">Tu nombre</label>
              <input
                type="text"
                value={vecinoContactName}
                onChange={(e) => setVecinoContactName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[#2C3E50]">Teléfono de contacto / WhatsApp</label>
              <input
                type="text"
                value={vecinoPhone}
                onChange={(e) => setVecinoPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#2C3E50] focus:outline-none focus:border-[#2A5C8A]"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#6C7A89] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#2ECC71]">verified_user</span>
              Sin comisiones ni intermediarios.
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2A5C8A] text-white text-sm font-bold hover:brightness-105 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Publicar Pedido en {cleanDisplayName(vecinoLocalidad)} ({cleanDisplayName(vecinoMunicipio)})</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
