import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#E2E8F0] py-8 mt-12">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <Logo size="sm" showText={false} />
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[#2A5C8A]">Red de Oficios</span>
            <span className="text-sm text-[#6C7A89] hidden sm:inline">•</span>
            <span className="text-sm text-[#6C7A89]">
              Comunidad Barrial de Ayuda y Trabajo Local
            </span>
          </div>
        </div>

        {/* Verification badge & copyright */}
        <div className="flex items-center gap-4 text-xs font-semibold text-[#6C7A89]">
          <span className="flex items-center gap-1.5 text-[#2ECC71]">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Red Territorial Verificada</span>
          </span>
          <span>© 2024 Red de Oficios. Villa Urquiza.</span>
        </div>
      </div>
    </footer>
  );
};
