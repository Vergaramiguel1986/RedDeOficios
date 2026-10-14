import { useState, useEffect, useMemo } from 'react';
import { TradeWorker, ServiceRequest, WhatsAppNotification, Neighborhood } from './types';
import { INITIAL_WORKERS, INITIAL_REQUESTS, INITIAL_WHATSAPP_ALERTS, NEIGHBORHOODS } from './data/mockData';
import { extractNeighborhoodsFromWorkers, resolvePreciseCoords } from './utils/localityUtils';
import { sanitizeForFirestore } from './utils/firestoreUtils';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { Header } from './components/Header';
import { ExploreView } from './components/ExploreView';
import { WhatsAppAlertsView } from './components/WhatsAppAlertsView';
import { PublishView } from './components/PublishView';
import { ProfileModal } from './components/ProfileModal';
import { WhatsAppContactModal } from './components/WhatsAppContactModal';
import { PostulationModal } from './components/PostulationModal';
import { UserAccountModal } from './components/UserAccountModal';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const { currentUser, loading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState<'explorar' | 'publicar' | 'alertas'>('explorar');
  const [searchQuery, setSearchQuery] = useState('');

  // Workers combinados (Firestore + datos iniciales de prueba para coexistencia)
  const [workers, setWorkers] = useState<TradeWorker[]>(INITIAL_WORKERS);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [alerts, setAlerts] = useState<WhatsAppNotification[]>(INITIAL_WHATSAPP_ALERTS);

  // Zonas y municipios extraídos dinámicamente de los trabajadores
  const availableNeighborhoods = useMemo(() => {
    return extractNeighborhoodsFromWorkers(workers, NEIGHBORHOODS);
  }, [workers]);

  // Barrio o municipio activo seleccionado (por defecto el primero de la lista dinámica)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood>(NEIGHBORHOODS[0]);

  // Sincronizar datos del barrio seleccionado si cambian los conteos de trabajadores
  useEffect(() => {
    if (availableNeighborhoods.length > 0) {
      const match = availableNeighborhoods.find((n) => n.id === selectedNeighborhood.id);
      if (match && match.workerCount !== selectedNeighborhood.workerCount) {
        setSelectedNeighborhood(match);
      }
    }
  }, [availableNeighborhoods, selectedNeighborhood.id]);

  // Modals
  const [viewingWorker, setViewingWorker] = useState<TradeWorker | null>(null);
  const [contactingWorker, setContactingWorker] = useState<TradeWorker | null>(null);
  const [postulatingAlert, setPostulatingAlert] = useState<WhatsAppNotification | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [appToast, setAppToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setAppToast(msg);
    setTimeout(() => setAppToast(null), 4000);
  };

  // 1. Sincronización en tiempo real de Trabajadores (Colección 'workers')
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, "workers"), (snapshot) => {
        const seenWorkerIds = new Set<string>();
        const firestoreWorkers: TradeWorker[] = [];

        for (const d of snapshot.docs) {
          const data = d.data() as any;
          let uniqueId = data.id || d.id;
          if (seenWorkerIds.has(uniqueId)) {
            uniqueId = `${uniqueId}-${d.id}`;
          }
          seenWorkerIds.add(uniqueId);

          const wMunicipio = data.municipio || '';
          const wLocalidad = data.localidad || '';
          let defaultCoords: [number, number] = [-34.5735, -58.4878];
          if (wMunicipio || wLocalidad) {
            defaultCoords = resolvePreciseCoords(wMunicipio, wLocalidad);
          }

          firestoreWorkers.push({
            id: uniqueId,
            name: data.name || 'Prestador',
            tradeTitle: data.tradeTitle || 'Oficio General',
            category: data.category || 'todos',
            verified: data.verified ?? true,
            urgent24h: data.urgent24h ?? false,
            rating: data.rating ?? 5.0,
            reviewsCount: data.reviewsCount ?? 1,
            distanceMeters: data.distanceMeters ?? 450,
            distanceKm: data.distanceKm ?? 0.45,
            municipio: wMunicipio,
            localidad: wLocalidad,
            zone: data.zone || data.location || (wMunicipio ? `${wLocalidad || ''} (${wMunicipio})` : 'Villa Urquiza'),
            location: data.location || data.zone || 'Villa Urquiza',
            address: data.address || data.location || 'Villa Urquiza',
            bio: data.bio || data.description || 'Prestador de confianza en el barrio.',
            conditionOfWork: data.conditionOfWork || 'Presupuesto sin cargo',
            whatsappNumber: data.whatsappNumber || data.whatsapp || '+5491158421904',
            avatarUrl: data.avatarUrl || data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            avatarAlt: data.avatarAlt || data.name || 'Foto de prestador',
            mapCoords: {
              x: data.mapCoords?.x ?? 350,
              y: data.mapCoords?.y ?? 300,
              lat: typeof data.mapCoords?.lat === 'number' ? data.mapCoords.lat : defaultCoords[0],
              lng: typeof data.mapCoords?.lng === 'number' ? data.mapCoords.lng : defaultCoords[1],
              walkingTime: data.mapCoords?.walkingTime || 'A 5 min caminando',
            },
            specialties: data.specialties || [],
            reviews: data.reviews || [],
            sampleWorks: data.sampleWorks || [],
          } as TradeWorker);
        }

        const samplesNotOverridden = INITIAL_WORKERS.filter(
          (iw) => !seenWorkerIds.has(iw.id) && !firestoreWorkers.some((fw) => fw.name === iw.name && fw.tradeTitle === iw.tradeTitle)
        );

        setWorkers([...firestoreWorkers, ...samplesNotOverridden]);
      }, (error) => {
        console.warn("Aviso en listener de 'workers':", error);
        setWorkers(INITIAL_WORKERS);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore listener fallback a INITIAL_WORKERS", e);
    }
  }, []);

  // 2. Sincronización de Pedidos
  useEffect(() => {
    try {
      const unsubscribeRequests = onSnapshot(collection(db, "requests"), (snapshot) => {
        const seenReqIds = new Set<string>();
        const firestoreRequests: ServiceRequest[] = [];

        for (const d of snapshot.docs) {
          const data = d.data() as any;
          let uniqueId = data.id || d.id;
          if (seenReqIds.has(uniqueId)) {
            uniqueId = `${uniqueId}-${d.id}`;
          }
          seenReqIds.add(uniqueId);

          firestoreRequests.push({
            ...(data as any),
            id: uniqueId,
          });
        }

        const samplesNotOverridden = INITIAL_REQUESTS.filter(
          (ir) => !seenReqIds.has(ir.id)
        );
        setRequests([...firestoreRequests, ...samplesNotOverridden]);
      }, (err) => {
        console.warn("Aviso requests:", err);
      });

      return () => unsubscribeRequests();
    } catch (e) {
      console.warn("Firestore requests listener fallback", e);
    }
  }, []);

  // 3. Sincronización de Alertas
  useEffect(() => {
    try {
      const unsubscribeAlerts = onSnapshot(collection(db, "alerts"), (snapshot) => {
        const seenAlertIds = new Set<string>();
        const firestoreAlerts: WhatsAppNotification[] = [];

        for (const d of snapshot.docs) {
          const data = d.data() as any;
          let uniqueId = data.id || d.id;
          if (seenAlertIds.has(uniqueId)) {
            uniqueId = `${uniqueId}-${d.id}`;
          }
          seenAlertIds.add(uniqueId);

          firestoreAlerts.push({
            title: data.title || 'Alerta barrial',
            distance: data.distance || 'En tu zona',
            description: data.description || '',
            time: data.time || 'Ahora',
            zone: data.zone || 'Villa Urquiza',
            category: data.category || 'todos',
            responded: data.responded ?? false,
            userProposalSent: data.userProposalSent,
            ...data,
            id: uniqueId,
          });
        }

        const samplesNotOverridden = INITIAL_WHATSAPP_ALERTS.filter(
          (ia) => !seenAlertIds.has(ia.id)
        );
        setAlerts([...firestoreAlerts, ...samplesNotOverridden]);
      }, (err) => {
        console.warn("Aviso alerts:", err);
      });

      return () => unsubscribeAlerts();
    } catch (e) {
      console.warn("Firestore alerts listener fallback", e);
    }
  }, []);

  const handleAddWorker = async (newWorker: TradeWorker) => {
    setWorkers((prev) => [newWorker, ...prev.filter((w) => w.id !== newWorker.id)]);

    if (newWorker.zone || newWorker.municipio || newWorker.localidad) {
      const dynamicZones = extractNeighborhoodsFromWorkers([newWorker, ...workers]);
      const targetZone = dynamicZones.find(
        (z) =>
          z.name.toLowerCase() === newWorker.zone?.toLowerCase() ||
          (newWorker.localidad && z.name.toLowerCase().includes(newWorker.localidad.toLowerCase())) ||
          (newWorker.municipio && z.name.toLowerCase().includes(newWorker.municipio.toLowerCase()))
      );
      if (targetZone) {
        setSelectedNeighborhood(targetZone);
      }
    }

    try {
      const workerPayload = sanitizeForFirestore({
        name: newWorker.name,
        tradeTitle: newWorker.tradeTitle || 'Oficio General',
        category: newWorker.category,
        verified: newWorker.verified ?? true,
        urgent24h: newWorker.urgent24h ?? false,
        rating: newWorker.rating ?? 5.0,
        reviewsCount: newWorker.reviewsCount ?? 1,
        distanceMeters: newWorker.distanceMeters ?? 450,
        distanceKm: newWorker.distanceKm ?? 0.45,
        municipio: newWorker.municipio || '',
        localidad: newWorker.localidad || '',
        zone: newWorker.zone || newWorker.location || 'Pilar',
        location: newWorker.location || newWorker.zone || 'Pilar',
        address: newWorker.address || newWorker.location || 'Pilar',
        bio: newWorker.bio || 'Prestador de confianza en el barrio.',
        conditionOfWork: newWorker.conditionOfWork || 'Presupuesto sin cargo',
        whatsappNumber: newWorker.whatsappNumber || '+5491158421904',
        avatarUrl: newWorker.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        avatarAlt: newWorker.avatarAlt || newWorker.name || 'Foto de prestador',
        mapCoords: {
          x: newWorker.mapCoords?.x ?? 350,
          y: newWorker.mapCoords?.y ?? 300,
          lat: newWorker.mapCoords?.lat ?? -34.4586,
          lng: newWorker.mapCoords?.lng ?? -58.9142,
          walkingTime: newWorker.mapCoords?.walkingTime || 'A 5 min caminando',
        },
        specialties: newWorker.specialties || [],
        reviews: newWorker.reviews || [],
        sampleWorks: newWorker.sampleWorks || [],
        createdAt: new Date().toISOString(),
      });

      const docRef = await addDoc(collection(db, "workers"), workerPayload);
      setWorkers((prev) =>
        prev.map((w) => (w.id === newWorker.id ? { ...w, id: docRef.id } : w))
      );
      showToast(`¡Prestador guardado permanentemente en Firestore!`);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      showToast(`¡Se sumó ${newWorker.name} a la Red de Oficios!`);
    }
  };

  const handleAddRequest = async (newRequest: ServiceRequest) => {
    setRequests((prev) => (prev.some((r) => r.id === newRequest.id) ? prev : [newRequest, ...prev]));

    const newAlert: WhatsAppNotification = {
      id: 'alert-' + Date.now(),
      title: `¡Nuevo pedido de ${newRequest.category} en ${newRequest.location}!`,
      distance: `En ${newRequest.location}`,
      description: `"${newRequest.title}: ${newRequest.description.slice(0, 100)}..."`,
      time: 'Ahora',
      zone: newRequest.location,
      category: newRequest.category,
      responded: false,
    };
    setAlerts((prev) => (prev.some((a) => a.id === newAlert.id) ? prev : [newAlert, ...prev]));

    try {
      await addDoc(collection(db, "requests"), sanitizeForFirestore({ ...newRequest, createdAt: new Date().toISOString() }));
      await addDoc(collection(db, "alerts"), sanitizeForFirestore({ ...newAlert, createdAt: new Date().toISOString() }));
      showToast('¡Tu pedido barrial fue publicado!');
    } catch (e) {
      showToast('¡Tu pedido barrial fue publicado!');
    }
  };

  const handlePostulationProposal = async (alertId: string, proposal: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, responded: true, userProposalSent: proposal } : a))
    );

    try {
      await addDoc(collection(db, "postulations"), sanitizeForFirestore({ alertId, proposal, createdAt: new Date().toISOString() }));
      await setDoc(doc(db, "alerts", alertId), { id: alertId, responded: true, userProposalSent: proposal, updatedAt: new Date().toISOString() }, { merge: true });
      showToast('¡Tu postulación fue enviada y guardada!');
    } catch (e) {
      showToast('¡Tu postulación fue enviada!');
    }
  };

  const handleAddAlert = async (newAlert: WhatsAppNotification) => {
    setAlerts((prev) => (prev.some((a) => a.id === newAlert.id) ? prev : [newAlert, ...prev]));
    try {
      await addDoc(collection(db, "alerts"), sanitizeForFirestore({ ...newAlert, createdAt: new Date().toISOString() }));
    } catch (e) {}
  };

  const handleSeedSampleWorkers = async () => {
    try {
      showToast('Guardando prestadores de muestra en Firestore...');
      let count = 0;
      for (const worker of INITIAL_WORKERS) {
        await addDoc(collection(db, "workers"), sanitizeForFirestore({ ...worker, createdAt: new Date().toISOString() }));
        count++;
      }
      showToast(`¡Se subieron ${count} prestadores a Firestore!`);
    } catch (error) {
      showToast("Error al conectar con Firestore.");
    }
  };

  const handleMessageSentToWorker = (workerName: string) => {
    showToast(`Mensaje enviado a ${workerName} vía WhatsApp`);
  };

  // --- CONTROL DE ACCESO (AUTENTICACIÓN REQUERIDA) ---

  // 1. Pantalla de carga mientras Firebase verifica sesión
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-['Nunito_Sans',sans-serif]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2A5C8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2C3E50] font-medium text-sm">Cargando Red de Oficios...</p>
        </div>
      </div>
    );
  }

  // 2. Si NO hay usuario autenticado, bloqueamos la app y mostramos solo el Login
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center font-['Nunito_Sans',sans-serif]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center">
          
          <div className="w-20 h-20 bg-[#2A5C8A]/10 rounded-2xl flex items-center justify-center text-4xl mb-6">
            🏘️
          </div>

          <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">
            Red de Oficios
          </h1>
          <p className="text-sm text-[#6C7A89] mb-8">
            La plataforma comunitaria para conectar vecinos con prestadores de servicios de cercanía.
          </p>

          <button
            onClick={() => setIsLoginOpen(true)}
            className="w-full py-4 bg-[#2A5C8A] text-white font-bold rounded-2xl shadow-lg hover:bg-[#2A5C8A]/90 transition-all active:scale-95 text-base"
          >
            Iniciar Sesión con Google
          </button>
        </div>

        {/* Modal de selección de rol y Login */}
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    );
  }

  // 3. Si SÍ está autenticado, se muestra toda la aplicación normal
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Nunito_Sans',sans-serif] text-[#2C3E50]">
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onOpenProfile={() => setAccountModalOpen(true)}
        selectedNeighborhood={selectedNeighborhood}
        onSelectNeighborhood={(neighborhood) => {
          setSelectedNeighborhood(neighborhood);
          setCurrentTab('explorar');
          showToast(`Zona cambiada a ${neighborhood.name}`);
        }}
        neighborhoods={availableNeighborhoods}
      />

      <main className="flex-1 pt-24">
        {currentTab === 'explorar' && (
          <ExploreView
            workers={workers}
            searchQuery={searchQuery}
            selectedNeighborhood={selectedNeighborhood}
            onContactWorker={(worker) => setContactingWorker(worker)}
            onViewWorkerDetails={(worker) => setViewingWorker(worker)}
            onNavigateToPublish={() => setCurrentTab('publicar')}
          />
        )}

        {currentTab === 'alertas' && (
          <WhatsAppAlertsView
            alerts={alerts}
            onExploreMapForAlert={() => setCurrentTab('explorar')}
            onPostulateAlert={(alert) => setPostulatingAlert(alert)}
            onAddAlert={handleAddAlert}
          />
        )}

        {currentTab === 'publicar' && (
          <PublishView
            onAddWorker={handleAddWorker}
            onAddRequest={handleAddRequest}
            onNavigateToExplore={() => setCurrentTab('explorar')}
            onNavigateToAlerts={() => setCurrentTab('alertas')}
            selectedNeighborhood={selectedNeighborhood}
            onSeedSampleWorkers={handleSeedSampleWorkers}
          />
        )}
      </main>

      <Footer />

      <ProfileModal
        worker={viewingWorker}
        onClose={() => setViewingWorker(null)}
        onContact={(worker) => {
          setViewingWorker(null);
          setContactingWorker(worker);
        }}
      />

      <WhatsAppContactModal
        worker={contactingWorker}
        onClose={() => setContactingWorker(null)}
        onMessageSent={handleMessageSentToWorker}
      />

      <PostulationModal
        alert={postulatingAlert}
        onClose={() => setPostulatingAlert(null)}
        onSubmitProposal={handlePostulationProposal}
      />

      <UserAccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onSwitchToWorker={() => {
          showToast('Modo Prestador activado');
          setCurrentTab('alertas');
        }}
        onSwitchToVecino={() => {
          showToast('Modo Vecino activado');
          setCurrentTab('explorar');
        }}
        onSeedSampleWorkers={handleSeedSampleWorkers}
      />

      {appToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2C3E50] text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#FFC067] text-[20px]">info</span>
          <span>{appToast}</span>
        </div>
      )}
    </div>
  );
}
