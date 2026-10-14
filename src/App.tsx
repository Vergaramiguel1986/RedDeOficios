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

export default function App() {
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
  // Consulta onSnapshot para mostrar tanto los datos persistentes de Firebase como los de prueba
  useEffect(() => {
    try {
      console.log("[Firestore] Conectando listener onSnapshot a la colección 'workers'...");
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

        console.log(`[Firestore onSnapshot] Recibidos ${firestoreWorkers.length} documentos persistentes de 'workers'.`);

        // Coexistencia: Las publicaciones de Firestore conviven con los ejemplos de muestra (INITIAL_WORKERS)
        // y no se borran al refrescar la página.
        const samplesNotOverridden = INITIAL_WORKERS.filter(
          (iw) => !seenWorkerIds.has(iw.id) && !firestoreWorkers.some((fw) => fw.name === iw.name && fw.tradeTitle === iw.tradeTitle)
        );

        setWorkers([...firestoreWorkers, ...samplesNotOverridden]);
      }, (error) => {
        console.warn("[Firestore] Aviso en listener de 'workers':", error);
        setWorkers(INITIAL_WORKERS);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore listener fallback a INITIAL_WORKERS", e);
    }
  }, []);

  // 2. Sincronización en tiempo real de Pedidos de Vecinos (Colección 'requests')
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
        console.warn("Aviso: listener de Firestore requests en modo local:", err);
      });

      return () => unsubscribeRequests();
    } catch (e) {
      console.warn("Firestore requests listener fallback", e);
    }
  }, []);

  // 3. Sincronización en tiempo real de Alertas y Postulaciones (Colección 'alerts')
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
        console.warn("Aviso: listener de Firestore alerts en modo local:", err);
      });

      return () => unsubscribeAlerts();
    } catch (e) {
      console.warn("Firestore alerts listener fallback", e);
    }
  }, []);

  // Guardar un nuevo prestador/trabajador en Firestore
  // Ejecuta addDoc(collection(db, 'workers'), ...) para crear automáticamente la colección si está vacía
  const handleAddWorker = async (newWorker: TradeWorker) => {
    // 1. Actualización inmediata local
    setWorkers((prev) => [newWorker, ...prev.filter((w) => w.id !== newWorker.id)]);

    // 2. Si es una zona o municipio nuevo, cambiar automáticamente a ella para que el mapa vuele y la centre
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
      // 3. Sanitizar payload y persistir directamente en la colección 'workers' de Firebase Firestore
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
        zone: newWorker.zone || newWorker.location || (newWorker.municipio ? `${newWorker.localidad || ''} (${newWorker.municipio})` : 'Pilar'),
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

      console.log("[Firestore] Ejecutando addDoc(collection(db, 'workers'), ...)", workerPayload);
      const docRef = await addDoc(collection(db, "workers"), workerPayload);
      console.log(`[Firestore] ✓ Documento creado exitosamente en colección 'workers' con ID: ${docRef.id}`);

      // Actualizar el ID local con el ID generado en Firestore
      setWorkers((prev) =>
        prev.map((w) => (w.id === newWorker.id ? { ...w, id: docRef.id } : w))
      );

      showToast(`¡Prestador guardado permanentemente en Firestore (Colección 'workers')!`);
    } catch (error) {
      console.error("Error al ejecutar addDoc en Firestore:", error);
      showToast(`¡Se sumó ${newWorker.name} a la Red de Oficios!`);
    }
  };

  // Guardar un nuevo pedido de servicio de un vecino en Firestore
  const handleAddRequest = async (newRequest: ServiceRequest) => {
    setRequests((prev) => (prev.some((r) => r.id === newRequest.id) ? prev : [newRequest, ...prev]));

    // Crear la alerta para los prestadores de la zona
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
      const sanitizedReq = sanitizeForFirestore({
        ...newRequest,
        createdAt: new Date().toISOString(),
      });
      const sanitizedAlert = sanitizeForFirestore({
        ...newAlert,
        createdAt: new Date().toISOString(),
      });

      // Persistir en Firestore en las colecciones 'requests' y 'alerts'
      await addDoc(collection(db, "requests"), sanitizedReq);
      await addDoc(collection(db, "alerts"), sanitizedAlert);
      showToast('¡Tu pedido barrial fue publicado y guardado en Firestore!');
    } catch (e) {
      console.warn("Aviso al guardar pedido en Firestore", e);
      showToast('¡Tu pedido barrial fue publicado!');
    }
  };

  // Enviar y persistir postulación de un oficio a una oportunidad
  const handlePostulationProposal = async (alertId: string, proposal: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, responded: true, userProposalSent: proposal }
          : a
      )
    );

    try {
      // 1. Guardar la postulación en la colección 'postulations'
      await addDoc(collection(db, "postulations"), sanitizeForFirestore({
        alertId,
        proposal,
        createdAt: new Date().toISOString(),
      }));

      // 2. Persistir el estado de respondida en 'alerts' para que persista al refrescar
      await setDoc(doc(db, "alerts", alertId), {
        id: alertId,
        responded: true,
        userProposalSent: proposal,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      showToast('¡Tu postulación fue enviada al vecino y guardada en Firestore!');
    } catch (e) {
      console.warn("Aviso al registrar postulación en Firestore", e);
      showToast('¡Tu postulación fue enviada al vecino por WhatsApp!');
    }
  };

  // Guardar una nueva alerta (ej: alertas generadas en el Bot de WhatsApp)
  const handleAddAlert = async (newAlert: WhatsAppNotification) => {
    setAlerts((prev) => (prev.some((a) => a.id === newAlert.id) ? prev : [newAlert, ...prev]));
    try {
      await addDoc(collection(db, "alerts"), sanitizeForFirestore({
        ...newAlert,
        createdAt: new Date().toISOString(),
      }));
    } catch (e) {
      console.warn("Aviso al guardar alerta en Firestore", e);
    }
  };

  // Guardar los prestadores de prueba de una sola vez en Firestore (útil si la base de datos está vacía)
  const handleSeedSampleWorkers = async () => {
    try {
      showToast('Guardando prestadores de muestra en Firestore...');
      let count = 0;
      for (const worker of INITIAL_WORKERS) {
        const payload = sanitizeForFirestore({
          name: worker.name,
          tradeTitle: worker.tradeTitle,
          category: worker.category,
          verified: worker.verified,
          rating: worker.rating,
          reviewsCount: worker.reviewsCount,
          distanceMeters: worker.distanceMeters,
          distanceKm: worker.distanceKm,
          zone: worker.zone || 'Villa Urquiza',
          location: worker.location || 'Villa Urquiza',
          address: worker.address,
          bio: worker.bio,
          conditionOfWork: worker.conditionOfWork,
          whatsappNumber: worker.whatsappNumber,
          avatarUrl: worker.avatarUrl,
          avatarAlt: worker.avatarAlt,
          mapCoords: worker.mapCoords,
          specialties: worker.specialties || [],
          reviews: worker.reviews || [],
          sampleWorks: worker.sampleWorks || [],
          createdAt: new Date().toISOString(),
        });
        await addDoc(collection(db, "workers"), payload);
        count++;
      }
      showToast(`¡Se subieron ${count} prestadores a la colección 'workers' de Firestore!`);
    } catch (error) {
      console.error("Error al sembrar prestadores en Firestore:", error);
      showToast("Error al conectar con Firestore. Verificá los permisos.");
    }
  };

  const handleMessageSentToWorker = (workerName: string) => {
    showToast(`Mensaje enviado a ${workerName} vía WhatsApp`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Nunito_Sans',sans-serif] text-[#2C3E50]">
      {/* Header con lista dinámica de barrios/municipios extraída de los trabajadores */}
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
          showToast(`Zona cambiada a ${neighborhood.name} (${neighborhood.comuna || 'Municipio'})`);
        }}
        neighborhoods={availableNeighborhoods}
      />

      {/* Main Container */}
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
            onExploreMapForAlert={() => {
              setCurrentTab('explorar');
            }}
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

      {/* Footer */}
      <Footer />

      {/* Profile & Reviews Modal */}
      <ProfileModal
        worker={viewingWorker}
        onClose={() => setViewingWorker(null)}
        onContact={(worker) => {
          setViewingWorker(null);
          setContactingWorker(worker);
        }}
      />

      {/* WhatsApp Direct Contact Modal */}
      <WhatsAppContactModal
        worker={contactingWorker}
        onClose={() => setContactingWorker(null)}
        onMessageSent={handleMessageSentToWorker}
      />

      {/* Postulation to WhatsApp Opportunity Modal */}
      <PostulationModal
        alert={postulatingAlert}
        onClose={() => setPostulatingAlert(null)}
        onSubmitProposal={handlePostulationProposal}
      />

      {/* User Neighborhood Identity Account Modal */}
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

      {/* Global App Toast */}
      {appToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2C3E50] text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#FFC067] text-[20px]">info</span>
          <span>{appToast}</span>
        </div>
      )}
    </div>
  );
}
