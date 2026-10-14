import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  // Height presets matching the exact vertical logo badge from logo_red_de_oficios (1).png
  const heightClasses = {
    sm: showText ? 'h-12' : 'h-8',
    md: showText ? 'h-[64px] md:h-[70px]' : 'h-10',
    lg: showText ? 'h-24 md:h-28' : 'h-16',
  }[size];

  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* 
        Exact Logo from logo_red_de_oficios (1).png:
        - Top: Heart Emblem (Map Pin + Open Wrench + Interlocking Handshake)
        - Bottom: "Red de" and "Oficios" stacked vertically
      */}
      <svg
        viewBox={showText ? "0 0 360 460" : "0 0 360 270"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClasses} w-auto object-contain transition-transform duration-200 hover:scale-105`}
        aria-label="Red de Oficios"
      >
        {/* Heart Emblem */}
        <g id="emblem">
          {/* 1. Left Pin: Navy Blue Outer Teardrop Contour */}
          <path
            d="M136 150 C108 135 74 110 74 76 C74 42 98 22 130 22 C162 22 184 44 184 76 C184 98 168 122 148 142 L136 154"
            stroke="#23496D"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 2. Inside Location Pin: Amber Drop with White Center Hole */}
          <path
            d="M128 48 C138 48 146 56 146 66 C146 78 128 98 128 98 C128 98 110 78 110 66 C110 56 118 48 128 48 Z"
            fill="#F5A838"
          />
          <circle cx="128" cy="66" r="6.5" fill="#FFFFFF" />

          {/* 3. Right: Open Wrench in Amber (#F5A838) */}
          <path
            d="M192 36 C202 24 218 18 232 26 C240 30 248 40 250 49 L232 58 C227 54 221 54 216 58 L230 78 C235 77 241 78 244 82 L258 71 C257 86 248 98 236 104 L212 128"
            stroke="#F5A838"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#F5A838"
            fillOpacity="0.1"
          />

          {/* 4. Wrench Handle curving into Right Arm */}
          <path
            d="M212 128 C228 148 232 172 208 202"
            stroke="#F5A838"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* 5. Bottom of Heart: Blue Sleeve & Base Arc */}
          <path
            d="M86 162 C74 178 78 204 100 220 C118 234 144 240 166 235"
            stroke="#23496D"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M166 235 C192 230 216 210 222 186"
            stroke="#23496D"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* 6. Handshake Fingers in Amber (#F5A838) */}
          <path
            d="M208 202 C198 212 184 228 168 238"
            stroke="#F5A838"
            strokeWidth="13"
            strokeLinecap="round"
          />

          {/* Thumb curve */}
          <path
            d="M192 196 C178 190 162 194 150 204"
            stroke="#F5A838"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* 4 Clasping Fingers */}
          <path d="M96 172 C86 179 90 192 102 197" stroke="#F5A838" strokeWidth="11" strokeLinecap="round" />
          <path d="M110 185 C100 192 104 205 116 210" stroke="#F5A838" strokeWidth="11" strokeLinecap="round" />
          <path d="M124 198 C114 205 118 218 130 223" stroke="#F5A838" strokeWidth="11" strokeLinecap="round" />
          <path d="M138 211 C128 218 132 231 144 236" stroke="#F5A838" strokeWidth="11" strokeLinecap="round" />

          {/* 3 Interlocking Fingers */}
          <path d="M164 194 C174 200 180 212 174 222" stroke="#F5A838" strokeWidth="10" strokeLinecap="round" />
          <path d="M178 206 C188 212 194 224 188 234" stroke="#F5A838" strokeWidth="10" strokeLinecap="round" />
          <path d="M192 218 C202 224 208 236 202 246" stroke="#F5A838" strokeWidth="10" strokeLinecap="round" />
        </g>

        {/* Bottom: Typography matching logo_red_de_oficios (1).png */}
        {showText && (
          <g id="typography">
            <text
              x="180"
              y="342"
              textAnchor="middle"
              fontFamily="'Nunito Sans', 'Segoe UI', system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="68"
              letterSpacing="-1"
            >
              <tspan fill="#F5A838">Red </tspan>
              <tspan fill="#23496D">de</tspan>
            </text>

            <text
              x="180"
              y="420"
              textAnchor="middle"
              fontFamily="'Nunito Sans', 'Segoe UI', system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="76"
              letterSpacing="-1.5"
              fill="#23496D"
            >
              Oficios
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
