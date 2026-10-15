import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginModal } from './components/LoginModal';
import { Header } from './components/Header';
import { ExploreView } from './components/ExploreView';
import { WhatsAppAlertsView } from './components/WhatsAppAlertsView';
import { PublishView } from './components/PublishView';
import { ProfileModal } from './components/ProfileModal';
import { WhatsAppContactModal } from './components/WhatsAppContactModal';
import { PostulationModal } from './components/PostulationModal';
import { UserAccountModal } from './components/UserAccountModal';
import { Footer } from './components/Footer';
import { TradeWorker, ServiceRequest, WhatsAppNotification, Neighborhood } from './types';
import { INITIAL_WORKERS, INITIAL_REQUESTS, INITIAL_WHATSAPP_ALERTS, NEIGHBORHOODS } from './data/mockData';

export default function App() {
  const { currentUser, loading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const [currentTab, setCurrentTab] = useState<'explorar' | 'publicar' | 'alertas'>('explorar');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [workers, setWorkers] = useState<TradeWorker[]>(INITIAL_WORKERS);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [alerts, setAlerts] = useState<WhatsAppNotification[]>(INITIAL_WHATSAPP_ALERTS);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood>(NEIGHBORHOODS[0]);

  const [viewingWorker, setViewingWorker] = useState<TradeWorker | null>(null);
  const [contactingWorker, setContactingWorker] = useState<TradeWorker | null>(null);
  const [postulatingAlert, setPostulatingAlert] = useState<WhatsAppNotification | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [appToast, setAppToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setAppToast(msg);
    setTimeout(() => setAppToast(null), 4000);
  };

  // 1. Pantalla de carga mientras Firebase verifica sesión
  if (loading) {
    return (
      <div className="min-h-screen bg-[#2C3E50] flex items-center justify-center text-white font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#FFC067] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium">Cargando Red de Oficios...</p>
        </div>
      </div>
    );
  }

  // 2. Si NO hay usuario, bloqueamos toda la vista y mostramos el acceso
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] to-[#1A252F] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#2A5C8A]/10 rounded-2xl flex items-center justify-center text-4xl mx-auto shadow-inner">
            🏘️
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-[#2C3E50]">Red de Oficios</h1>
            <p className="text-sm text-gray-500">
              Plataforma comunitaria para conectar vecinos y prestadores de servicios en la zona.
            </p>
          </div>

          <button
            onClick={() => setIsLoginOpen(true)}
            className="w-full py-4 bg-[#2A5C8A] hover:bg-[#2A5C8A]/90 text-white font-bold rounded-2xl shadow-lg transition-all transform active:scale-95 text-sm"
          >
            Iniciar Sesión para Ingresar
          </button>
        </div>

        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    );
  }

  // 3. Aplicación principal (Solo visible si hay sesión)
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#2C3E50]">
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
        neighborhoods={NEIGHBORHOODS}
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
            onAddAlert={(alert) => setAlerts((prev) => [alert, ...prev])}
          />
        )}

        {currentTab === 'publicar' && (
          <PublishView
            onAddWorker={(w) => setWorkers((prev) => [w, ...prev])}
            onAddRequest={(r) => setRequests((prev) => [r, ...prev])}
            onNavigateToExplore={() => setCurrentTab('explorar')}
            onNavigateToAlerts={() => setCurrentTab('alertas')}
            selectedNeighborhood={selectedNeighborhood}
            onSeedSampleWorkers={() => showToast('Prestadores listos')}
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
        onMessageSent={(name) => showToast(`Mensaje enviado a ${name}`)}
      />

      <PostulationModal
        alert={postulatingAlert}
        onClose={() => setPostulatingAlert(null)}
        onSubmitProposal={() => showToast('Postulación enviada')}
      />

      <UserAccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onSwitchToWorker={() => setCurrentTab('alertas')}
        onSwitchToVecino={() => setCurrentTab('explorar')}
        onSeedSampleWorkers={() => {}}
      />

      {appToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2C3E50] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2">
          <span className="text-[#FFC067]">ℹ️</span>
          <span>{appToast}</span>
        </div>
      )}
    </div>
  );
}
