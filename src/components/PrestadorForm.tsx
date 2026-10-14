import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

interface PrestadorFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrestadorForm: React.FC<PrestadorFormProps> = ({ isOpen, onClose }) => {
  const { currentUser, userProfile } = useAuth();
  const [rubro, setRubro] = useState('');
  const [telefono, setTelefono] = useState('');
  const [zona, setZona] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Cargar datos previos si ya existen en Firestore
    const loadPrestadorData = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRubro(data.rubro || '');
          setTelefono(data.telefono || '');
          setZona(data.zona || '');
          setDescripcion(data.descripcion || '');
        }
      }
    };
    if (isOpen) loadPrestadorData();
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        rubro,
        telefono,
        zona,
        descripcion,
        isPublic: true, // Indica que el perfil está listo para aparecer en las búsquedas
      });

      setMensaje('¡Perfil de servicio guardado correctamente!');
      setTimeout(() => {
        setMensaje('');
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setMensaje('Error al guardar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-[#2C3E50] flex items-center gap-2">
            <span>🛠️</span> Mi Perfil de Prestador
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg px-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          
          {/* Rubro / Oficio */}
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] uppercase mb-1">
              Oficio / Especialidad
            </label>
            <select
              value={rubro}
              onChange={(e) => setRubro(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#2A5C8A] focus:outline-none text-sm bg-gray-50"
            >
              <option value="">Selecciona tu rubro...</option>
              <option value="Plomería">Plomería / Gas</option>
              <option value="Electricidad">Electricidad</option>
              <option value="Albañilería">Albañilería / Construcción</option>
              <option value="Pintura">Pintura</option>
              <option value="Carpintería">Carpintería</option>
              <option value="Resina y Mesadas">Resina Epoxi y Superficies</option>
              <option value="Jardinería">Jardinería / Mantenimiento</option>
              <option value="Refrigeración">Aire Acondicionado / Refrigeración</option>
              <option value="Otros">Otros Servicios</option>
            </select>
          </div>

          {/* Teléfono / WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] uppercase mb-1">
              Teléfono de contacto (WhatsApp)
            </label>
            <input
              type="tel"
              placeholder="Ej: 1122334455"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#2A5C8A] focus:outline-none text-sm bg-gray-50"
            />
          </div>

          {/* Zona / Cobertura */}
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] uppercase mb-1">
              Barrio / Zona de trabajo
            </label>
            <input
              type="text"
              placeholder="Ej: Tortuguitas / Malvinas Argentinas"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#2A5C8A] focus:outline-none text-sm bg-gray-50"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-[#2C3E50] uppercase mb-1">
              Descripción de tus servicios
            </label>
            <textarea
              rows={3}
              placeholder="Cuéntale a los vecinos qué trabajos realizas, tus años de experiencia, trabajos garantizados..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#2A5C8A] focus:outline-none text-sm bg-gray-50 resize-none"
            />
          </div>

          {mensaje && (
            <div className={`p-3 rounded-xl text-xs font-medium text-center ${
              mensaje.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
            }`}>
              {mensaje}
            </div>
          )}

          {/* Botones */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-3 bg-[#FFC067] text-[#2C3E50] rounded-xl font-bold hover:bg-[#FFC067]/90 transition-all text-sm shadow-sm active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Perfil'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
