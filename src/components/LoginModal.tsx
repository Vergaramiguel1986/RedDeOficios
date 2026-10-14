import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'vecino' | 'prestador'>('vecino');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle(selectedRole);
      onClose(); // Cierra el modal al iniciar sesión con éxito
    } catch (err) {
      setError('Hubo un error al iniciar sesión con Google. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-[#2C3E50]">Ingresar a Red de Oficios</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg px-2"
          >
            ✕
          </button>
        </div>

        <div className="py-4">
          <p className="text-sm text-[#6C7A89] mb-4">
            Selecciona cómo deseas participar en la red comunitaria:
          </p>

          {/* Selector de Rol */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('vecino')}
              className={`p-3 rounded-xl border-2 font-medium text-sm flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'vecino'
                  ? 'border-[#2A5C8A] bg-[#2A5C8A]/5 text-[#2A5C8A]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">🏡</span>
              Vecino / Cliente
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('prestador')}
              className={`p-3 rounded-xl border-2 font-medium text-sm flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'prestador'
                  ? 'border-[#FFC067] bg-[#FFC067]/10 text-[#2C3E50]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">🛠️</span>
              Prestador de Oficio
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Botón de Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {loading ? 'Conectando...' : 'Continuar con Google'}
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-[#6C7A89]">
          Al ingresar, aceptas conectar tu perfil de forma segura a la Red de Oficios.
        </div>

      </div>
    </div>
  );
};
