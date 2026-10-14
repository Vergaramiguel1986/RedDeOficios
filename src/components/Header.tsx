import React, { useState } from 'react';
import { Logo } from './Logo';
import { LoginModal } from './LoginModal';
import { PrestadorForm } from './PrestadorForm';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPrestadorFormOpen, setIsPrestadorFormOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
      <Logo size="md" />

      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3">
            {/* Si el usuario autenticado es prestador, mostramos su botón de perfil */}
            {userProfile?.role === 'prestador' && (
              <button
                onClick={() => setIsPrestadorFormOpen(true)}
                className="px-3 py-1.5 bg-[#FFC067]/20 text-[#2C3E50] text-xs font-bold rounded-xl hover:bg-[#FFC067]/30 transition-all border border-[#FFC067]"
              >
                🛠️ Mi Perfil
              </button>
            )}

            <div className="text-right text-xs">
              <p className="font-bold text-[#2C3E50]">{currentUser.displayName}</p>
              <span className="capitalize text-gray-500 font-medium">
                {userProfile?.role === 'prestador' ? '🛠️ Prestador' : '🏡 Vecino'}
              </span>
            </div>

            <button
              onClick={logout}
              className="text-xs text-red-500 font-medium hover:underline px-2 py-1"
            >
              Salir
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-4 py-2 bg-[#2A5C8A] text-white text-sm font-semibold rounded-xl hover:bg-[#2A5C8A]/90 transition-all shadow-sm active:scale-95"
          >
            Ingresar
          </button>
        )}
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {currentUser && (
        <PrestadorForm 
          isOpen={isPrestadorFormOpen} 
          onClose={() => setIsPrestadorFormOpen(false)} 
        />
      )}
    </header>
  );
};
