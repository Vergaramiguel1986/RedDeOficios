import { TradeWorker, Neighborhood } from '../types';
import { NEIGHBORHOODS } from '../data/mockData';

export interface LocalidadInfo {
  nombre: string;
  coords: [number, number];
}

export interface MunicipioData {
  nombre: string;
  region: string;
  comuna: string;
  coords: [number, number];
  localidades: LocalidadInfo[];
}

export interface RegionData {
  region: string;
  partidos: MunicipioData[];
}

// Catálogo exhaustivo y completo de todos los municipios y localidades de la Provincia de Buenos Aires y CABA
export const MUNICIPIOS_DATA: MunicipioData[] = [
  // =========================================================================
  // 1. CIUDAD AUTÓNOMA DE BUENOS AIRES (CABA)
  // =========================================================================
  {
    nombre: 'CABA',
    region: 'Ciudad Autónoma de Buenos Aires (CABA)',
    comuna: 'Ciudad Autónoma de Buenos Aires',
    coords: [-34.6037, -58.3816],
    localidades: [
      { nombre: 'Villa Urquiza', coords: [-34.5735, -58.4878] },
      { nombre: 'Belgrano', coords: [-34.5627, -58.4563] },
      { nombre: 'Belgrano R', coords: [-34.5670, -58.4680] },
      { nombre: 'Colegiales', coords: [-34.5775, -58.4520] },
      { nombre: 'Núñez', coords: [-34.5458, -58.4611] },
      { nombre: 'Saavedra', coords: [-34.5510, -58.4840] },
      { nombre: 'Coghlan', coords: [-34.5620, -58.4735] },
      { nombre: 'Villa Pueyrredón', coords: [-34.5820, -58.5030] },
      { nombre: 'Palermo', coords: [-34.5889, -58.4306] },
      { nombre: 'Recoleta', coords: [-34.5885, -58.3926] },
      { nombre: 'Caballito', coords: [-34.6186, -58.4438] },
      { nombre: 'Almagro', coords: [-34.6097, -58.4214] },
      { nombre: 'Flores', coords: [-34.6288, -58.4638] },
      { nombre: 'Floresta', coords: [-34.6320, -58.4820] },
      { nombre: 'Villa Devoto', coords: [-34.6000, -58.5150] },
      { nombre: 'Villa del Parque', coords: [-34.6050, -58.4900] },
      { nombre: 'Villa Crespo', coords: [-34.5980, -58.4450] },
      { nombre: 'Chacarita', coords: [-34.5870, -58.4550] },
      { nombre: 'San Telmo', coords: [-34.6210, -58.3730] },
      { nombre: 'Monserrat', coords: [-34.6130, -58.3810] },
      { nombre: 'San Nicolás (Centro)', coords: [-34.6050, -58.3780] },
      { nombre: 'Retiro', coords: [-34.5925, -58.3750] },
      { nombre: 'Puerto Madero', coords: [-34.6110, -58.3620] },
      { nombre: 'Balvanera (Once)', coords: [-34.6100, -58.4050] },
      { nombre: 'San Cristóbal', coords: [-34.6240, -58.4010] },
      { nombre: 'Barracas', coords: [-34.6400, -58.3750] },
      { nombre: 'La Boca', coords: [-34.6350, -58.3600] },
      { nombre: 'Boedo', coords: [-34.6300, -58.4150] },
      { nombre: 'Parque Patricios', coords: [-34.6350, -58.4050] },
      { nombre: 'Parque Chacabuco', coords: [-34.6320, -58.4380] },
      { nombre: 'Mataderos', coords: [-34.6550, -58.4980] },
      { nombre: 'Liniers', coords: [-34.6450, -58.5180] },
      { nombre: 'Villa Luro', coords: [-34.6400, -58.4980] },
      { nombre: 'Monte Castro', coords: [-34.6200, -58.5050] },
      { nombre: 'Versalles', coords: [-34.6280, -58.5250] },
      { nombre: 'Villa Real', coords: [-34.6180, -58.5280] },
      { nombre: 'Vélez Sársfield', coords: [-34.6340, -58.4890] },
      { nombre: 'Villa Santa Rita', coords: [-34.6140, -58.4810] },
      { nombre: 'Villa General Mitre', coords: [-34.6080, -58.4680] },
      { nombre: 'La Paternal', coords: [-34.5980, -58.4700] },
      { nombre: 'Agronomía', coords: [-34.5900, -58.4850] },
      { nombre: 'Villa Ortúzar', coords: [-34.5800, -58.4700] },
      { nombre: 'Parque Chas', coords: [-34.5850, -58.4790] },
      { nombre: 'Parque Avellaneda', coords: [-34.6480, -58.4750] },
      { nombre: 'Nueva Pompeya', coords: [-34.6500, -58.4200] },
      { nombre: 'Villa Lugano', coords: [-34.6750, -58.4680] },
      { nombre: 'Villa Soldati', coords: [-34.6650, -58.4450] },
      { nombre: 'Villa Riachuelo', coords: [-34.6900, -58.4650] },
      { nombre: 'Constitución', coords: [-34.6270, -58.3830] },
    ],
  },

  // =========================================================================
  // 2. CONURBANO NORTE (GRAN BUENOS AIRES NORTE)
  // =========================================================================
  {
    nombre: 'Pilar',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de Pilar',
    coords: [-34.4586, -58.9142],
    localidades: [
      { nombre: 'Pilar Centro', coords: [-34.4586, -58.9142] },
      { nombre: 'Del Viso', coords: [-34.4447, -58.7997] },
      { nombre: 'Presidente Derqui', coords: [-34.4922, -58.8358] },
      { nombre: 'Manuel Alberti', coords: [-34.4601, -58.7694] },
      { nombre: 'Villa Rosa', coords: [-34.4167, -58.8667] },
      { nombre: 'Fátima', coords: [-34.4833, -58.9833] },
      { nombre: 'Manzanares', coords: [-34.4333, -59.0333] },
      { nombre: 'La Lonja', coords: [-34.4667, -58.8333] },
      { nombre: 'Zelaya', coords: [-34.3667, -58.8833] },
      { nombre: 'Villa Astolfi', coords: [-34.4750, -58.8600] },
      { nombre: 'Champagnat', coords: [-34.4480, -58.9050] },
    ],
  },
  {
    nombre: 'Malvinas Argentinas',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de Malvinas Argentinas',
    coords: [-34.5028, -58.6983],
    localidades: [
      { nombre: 'Los Polvorines', coords: [-34.5072, -58.6922] },
      { nombre: 'Grand Bourg', coords: [-34.4842, -58.7231] },
      { nombre: 'Tortuguitas', coords: [-34.4719, -58.7569] },
      { nombre: 'Villa de Mayo', coords: [-34.5208, -58.6750] },
      { nombre: 'Ingeniero Pablo Nogués', coords: [-34.4950, -58.7050] },
      { nombre: 'Tierras Altas', coords: [-34.4789, -58.7389] },
      { nombre: 'Área de Promoción El Triángulo', coords: [-34.4700, -58.7200] },
    ],
  },
  {
    nombre: 'Tigre',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de Tigre',
    coords: [-34.4260, -58.5796],
    localidades: [
      { nombre: 'Tigre Centro', coords: [-34.4260, -58.5796] },
      { nombre: 'Don Torcuato', coords: [-34.4900, -58.6200] },
      { nombre: 'General Pacheco', coords: [-34.4550, -58.6360] },
      { nombre: 'Benavídez', coords: [-34.3980, -58.6850] },
      { nombre: 'Rincón de Milberg', coords: [-34.4100, -58.5600] },
      { nombre: 'El Talar', coords: [-34.4650, -58.6050] },
      { nombre: 'Nordelta', coords: [-34.4150, -58.6500] },
      { nombre: 'Dique Luján', coords: [-34.3700, -58.7100] },
      { nombre: 'Ricardo Rojas', coords: [-34.4450, -58.6550] },
    ],
  },
  {
    nombre: 'San Isidro',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de San Isidro',
    coords: [-34.4719, -58.5292],
    localidades: [
      { nombre: 'San Isidro Centro', coords: [-34.4719, -58.5292] },
      { nombre: 'Martínez', coords: [-34.4950, -58.5100] },
      { nombre: 'Acassuso', coords: [-34.4800, -58.5150] },
      { nombre: 'Beccar', coords: [-34.4550, -58.5400] },
      { nombre: 'Boulogne Sur Mer', coords: [-34.5050, -58.5600] },
      { nombre: 'Villa Adelina', coords: [-34.5200, -58.5450] },
      { nombre: 'La Horqueta', coords: [-34.4680, -58.5550] },
    ],
  },
  {
    nombre: 'Vicente López',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de Vicente López',
    coords: [-34.5268, -58.4839],
    localidades: [
      { nombre: 'Vicente López', coords: [-34.5268, -58.4839] },
      { nombre: 'Olivos', coords: [-34.5100, -58.4900] },
      { nombre: 'Florida Este', coords: [-34.5350, -58.4950] },
      { nombre: 'Florida Oeste', coords: [-34.5380, -58.5150] },
      { nombre: 'La Lucila', coords: [-34.5000, -58.4900] },
      { nombre: 'Munro', coords: [-34.5300, -58.5250] },
      { nombre: 'Villa Martelli', coords: [-34.5500, -58.5100] },
      { nombre: 'Carapachay', coords: [-34.5250, -58.5400] },
    ],
  },
  {
    nombre: 'San Fernando',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de San Fernando',
    coords: [-34.4444, -58.5583],
    localidades: [
      { nombre: 'San Fernando Centro', coords: [-34.4444, -58.5583] },
      { nombre: 'Victoria', coords: [-34.4600, -58.5450] },
      { nombre: 'Virreyes', coords: [-34.4500, -58.5750] },
      { nombre: 'Islas del Delta San Fernando', coords: [-34.3000, -58.5500] },
    ],
  },
  {
    nombre: 'San Martín',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de Gral. San Martín',
    coords: [-34.5778, -58.5367],
    localidades: [
      { nombre: 'San Martín Centro', coords: [-34.5778, -58.5367] },
      { nombre: 'Villa Ballester', coords: [-34.5500, -58.5550] },
      { nombre: 'San Andrés', coords: [-34.5650, -58.5400] },
      { nombre: 'Villa Lynch', coords: [-34.5900, -58.5250] },
      { nombre: 'Villa Maipú', coords: [-34.5800, -58.5150] },
      { nombre: 'Billinghurst', coords: [-34.5800, -58.5700] },
      { nombre: 'José León Suárez', coords: [-34.5300, -58.5700] },
      { nombre: 'Chilavert', coords: [-34.5420, -58.5620] },
    ],
  },
  {
    nombre: 'San Miguel',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de San Miguel',
    coords: [-34.5414, -58.7128],
    localidades: [
      { nombre: 'San Miguel Centro', coords: [-34.5414, -58.7128] },
      { nombre: 'Bella Vista', coords: [-34.5650, -58.6900] },
      { nombre: 'Muñiz', coords: [-34.5450, -58.7000] },
      { nombre: 'Santa María', coords: [-34.5250, -58.7400] },
      { nombre: 'Campo de Mayo', coords: [-34.5350, -58.6650] },
    ],
  },
  {
    nombre: 'José C. Paz',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de José C. Paz',
    coords: [-34.5167, -58.7667],
    localidades: [
      { nombre: 'José C. Paz Centro', coords: [-34.5167, -58.7667] },
      { nombre: 'Del Viso Sur', coords: [-34.4600, -58.7900] },
      { nombre: 'Tortuguitas Sur', coords: [-34.4850, -58.7700] },
      { nombre: 'Frino', coords: [-34.5300, -58.7800] },
    ],
  },
  {
    nombre: 'Escobar',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de Escobar',
    coords: [-34.3489, -58.7944],
    localidades: [
      { nombre: 'Belén de Escobar', coords: [-34.3489, -58.7944] },
      { nombre: 'Garín', coords: [-34.4250, -58.7500] },
      { nombre: 'Ingeniero Maschwitz', coords: [-34.3850, -58.7400] },
      { nombre: 'Matheu', coords: [-34.3800, -58.8300] },
      { nombre: 'Maquinista Savio', coords: [-34.4100, -58.7800] },
      { nombre: 'Loma Verde', coords: [-34.3200, -58.8400] },
    ],
  },
  {
    nombre: 'Campana',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de Campana',
    coords: [-34.1687, -58.9591],
    localidades: [
      { nombre: 'Campana Centro', coords: [-34.1687, -58.9591] },
      { nombre: 'Los Cardales Campana', coords: [-34.3250, -58.9850] },
      { nombre: 'Otamendi', coords: [-34.2250, -58.9050] },
    ],
  },
  {
    nombre: 'Zárate',
    region: 'Gran Buenos Aires Norte',
    comuna: 'Partido de Zárate',
    coords: [-34.0955, -59.0287],
    localidades: [
      { nombre: 'Zárate Centro', coords: [-34.0955, -59.0287] },
      { nombre: 'Lima', coords: [-33.9800, -59.1900] },
      { nombre: 'Escalada', coords: [-34.1400, -59.0900] },
    ],
  },

  // =========================================================================
  // 3. CONURBANO OESTE (GRAN BUENOS AIRES OESTE)
  // =========================================================================
  {
    nombre: 'La Matanza',
    region: 'Gran Buenos Aires Oeste',
    comuna: 'Partido de La Matanza',
    coords: [-34.6750, -58.5600],
    localidades: [
      { nombre: 'San Justo', coords: [-34.6750, -58.5600] },
      { nombre: 'Ramos Mejía', coords: [-34.6548, -58.5639] },
      { nombre: 'Lomas del Mirador', coords: [-34.6650, -58.5350] },
      { nombre: 'Ciudad Evita', coords: [-34.7200, -58.5300] },
      { nombre: 'Isidro Casanova', coords: [-34.7100, -58.5800] },
      { nombre: 'Gregorio de Laferrere', coords: [-34.7500, -58.5850] },
      { nombre: 'González Catán', coords: [-34.7700, -58.6200] },
      { nombre: 'Virrey del Pino', coords: [-34.8500, -58.6800] },
      { nombre: 'Villa Luzuriaga', coords: [-34.6750, -58.5950] },
      { nombre: 'Tapiales', coords: [-34.7100, -58.5050] },
      { nombre: 'Aldo Bonzi', coords: [-34.7250, -58.5150] },
      { nombre: 'Villa Madero', coords: [-34.6950, -58.4900] },
      { nombre: 'Rafael Castillo', coords: [-34.7050, -58.6200] },
    ],
  },
  {
    nombre: 'Morón',
    region: 'Gran Buenos Aires Oeste',
    comuna: 'Partido de Morón',
    coords: [-34.6534, -58.6198],
    localidades: [
      { nombre: 'Morón Centro', coords: [-34.6534, -58.6198] },
      { nombre: 'Castelar', coords: [-34.6500, -58.6450] },
      { nombre: 'Haedo', coords: [-34.6450, -58.5950] },
      { nombre: 'El Palomar', coords: [-34.5950, -58.5900] },
      { nombre: 'Villa Sarmiento', coords: [-34.6350, -58.5750] },
    ],
  },
  {
    nombre: 'Tres de Febrero',
    region: 'Gran Buenos Aires Oeste',
    comuna: 'Partido de Tres de Febrero',
    coords: [-34.6033, -58.5667],
    localidades: [
      { nombre: 'Caseros', coords: [-34.6033, -58.5667] },
      { nombre: 'Ciudad Jardín', coords: [-34.5950, -58.5900] },
      { nombre: 'Santos Lugares', coords: [-34.6000, -58.5450] },
      { nombre: 'Sáenz Peña', coords: [-34.6050, -58.5350] },
      { nombre: 'Martín Coronado', coords: [-34.5850, -58.5750] },
      { nombre: 'Ciudadela', coords: [-34.6350, -58.5350] },
      { nombre: 'Villa Bosch', coords: [-34.5800, -58.5600] },
      { nombre: 'Loma Hermosa', coords: [-34.5650, -58.5950] },
      { nombre: 'José Ingenieros', coords: [-34.6200, -58.5280] },
    ],
  },
  {
    nombre: 'Hurlingham',
    region: 'Gran Buenos Aires Oeste',
    comuna: 'Partido de Hurlingham',
    coords: [-34.5889, -58.6361],
    localidades: [
      { nombre: 'Hurlingham Centro', coords: [-34.5889, -58.6361] },
      { nombre: 'Villa Tesei', coords: [-34.6150, -58.6400] },
      { nombre: 'William C. Morris', coords: [-34.5750, -58.6500] },
    ],
  },
  {
    nombre: 'Ituzaingó',
    region: 'Gran Buenos Aires Oeste',
    comuna: 'Partido de Ituzaingó',
    coords: [-34.6586, -58.6694],
    localidades: [
      { nombre: 'Ituzaingó Centro', coords: [-34.6586, -58.6694] },
      { nombre: 'Parque Leloir', coords: [-34.6300, -58.6850] },
      { nombre: 'Villa Udaondo', coords: [-34.6200, -58.6700] },
      { nombre: 'San Alberto', coords: [-34.6750, -58.6800] },
    ],
  },
  {
    nombre: 'Moreno',
    region: 'Gran Buenos Aires Oeste',
    comuna: 'Partido de Moreno',
    coords: [-34.6508, -58.7909],
    localidades: [
      { nombre: 'Moreno Centro', coords: [-34.6508, -58.7909] },
      { nombre: 'Paso del Rey', coords: [-34.6450, -58.7500] },
      { nombre: 'Trujui', coords: [-34.5950, -58.7650] },
      { nombre: 'Francisco Álvarez', coords: [-34.6250, -58.8750] },
      { nombre: 'La Reja', coords: [-34.6400, -58.8350] },
      { nombre: 'Cuartel V', coords: [-34.5600, -58.8300] },
    ],
  },
  {
    nombre: 'Merlo',
    region: 'Gran Buenos Aires Oeste',
    comuna: 'Partido de Merlo',
    coords: [-34.6653, -58.7289],
    localidades: [
      { nombre: 'Merlo Centro', coords: [-34.6653, -58.7289] },
      { nombre: 'San Antonio de Padua', coords: [-34.6650, -58.6950] },
      { nombre: 'Parque San Martín', coords: [-34.6900, -58.7450] },
      { nombre: 'Libertad', coords: [-34.6950, -58.6800] },
      { nombre: 'Mariano Acosta', coords: [-34.7200, -58.7900] },
      { nombre: 'Pontevedra', coords: [-34.7450, -58.6900] },
    ],
  },
  {
    nombre: 'General Rodríguez',
    region: 'Gran Buenos Aires Oeste',
    comuna: 'Partido de Gral. Rodríguez',
    coords: [-34.6061, -58.9558],
    localidades: [
      { nombre: 'General Rodríguez Centro', coords: [-34.6061, -58.9558] },
      { nombre: 'Las Malvinas', coords: [-34.6150, -58.9100] },
    ],
  },
  {
    nombre: 'Marcos Paz',
    region: 'Gran Buenos Aires Oeste',
    comuna: 'Partido de Marcos Paz',
    coords: [-34.7833, -58.8333],
    localidades: [
      { nombre: 'Marcos Paz Centro', coords: [-34.7833, -58.8333] },
      { nombre: 'Elías Romero', coords: [-34.8200, -58.8900] },
    ],
  },

  // =========================================================================
  // 4. CONURBANO SUR (GRAN BUENOS AIRES SUR)
  // =========================================================================
  {
    nombre: 'Quilmes',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de Quilmes',
    coords: [-34.7242, -58.2608],
    localidades: [
      { nombre: 'Quilmes Centro', coords: [-34.7242, -58.2608] },
      { nombre: 'Bernal', coords: [-34.7078, -58.2817] },
      { nombre: 'Don Bosco', coords: [-34.7001, -58.2981] },
      { nombre: 'Ezpeleta', coords: [-34.7505, -58.2439] },
      { nombre: 'San Francisco Solano', coords: [-34.7761, -58.3189] },
      { nombre: 'Quilmes Oeste', coords: [-34.7350, -58.2850] },
      { nombre: 'Villa La Florida', coords: [-34.7650, -58.2950] },
    ],
  },
  {
    nombre: 'Avellaneda',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de Avellaneda',
    coords: [-34.6611, -58.3644],
    localidades: [
      { nombre: 'Avellaneda Centro', coords: [-34.6611, -58.3644] },
      { nombre: 'Dock Sud', coords: [-34.6500, -58.3450] },
      { nombre: 'Sarandí', coords: [-34.6750, -58.3450] },
      { nombre: 'Villa Domínico', coords: [-34.6900, -58.3300] },
      { nombre: 'Wilde', coords: [-34.7050, -58.3200] },
      { nombre: 'Piñeyro', coords: [-34.6650, -58.3850] },
      { nombre: 'Gerli Este', coords: [-34.6850, -58.3750] },
    ],
  },
  {
    nombre: 'Lanús',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de Lanús',
    coords: [-34.7016, -58.3912],
    localidades: [
      { nombre: 'Lanús Este', coords: [-34.7016, -58.3850] },
      { nombre: 'Lanús Oeste', coords: [-34.7050, -58.4050] },
      { nombre: 'Gerli Oeste', coords: [-34.6900, -58.3850] },
      { nombre: 'Valentín Alsina', coords: [-34.6750, -58.4150] },
      { nombre: 'Remedios de Escalada', coords: [-34.7250, -58.3950] },
      { nombre: 'Monte Chingolo', coords: [-34.7250, -58.3650] },
    ],
  },
  {
    nombre: 'Lomas de Zamora',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de Lomas de Zamora',
    coords: [-34.7594, -58.4005],
    localidades: [
      { nombre: 'Lomas de Zamora Centro', coords: [-34.7594, -58.4005] },
      { nombre: 'Banfield', coords: [-34.7431, -58.3956] },
      { nombre: 'Temperley', coords: [-34.7750, -58.3950] },
      { nombre: 'Turdera', coords: [-34.7850, -58.4050] },
      { nombre: 'Llavallol', coords: [-34.7950, -58.4350] },
      { nombre: 'Villa Centenario', coords: [-34.7350, -58.4250] },
      { nombre: 'San José Lomas', coords: [-34.7700, -58.3650] },
    ],
  },
  {
    nombre: 'Berazategui',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de Berazategui',
    coords: [-34.7634, -58.2114],
    localidades: [
      { nombre: 'Berazategui Centro', coords: [-34.7634, -58.2114] },
      { nombre: 'Hudson', coords: [-34.7900, -58.1500] },
      { nombre: 'Ranelagh', coords: [-34.7900, -58.2050] },
      { nombre: 'Plátanos', coords: [-34.7750, -58.1800] },
      { nombre: 'El Pato', coords: [-34.9000, -58.1800] },
      { nombre: 'Sourigues', coords: [-34.7950, -58.2450] },
      { nombre: 'Pereyra', coords: [-34.8450, -58.1050] },
    ],
  },
  {
    nombre: 'Florencio Varela',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de Florencio Varela',
    coords: [-34.8021, -58.2778],
    localidades: [
      { nombre: 'Florencio Varela Centro', coords: [-34.8021, -58.2778] },
      { nombre: 'Bosques', coords: [-34.8250, -58.2350] },
      { nombre: 'Zeballos', coords: [-34.8100, -58.2600] },
      { nombre: 'Gobernador Costa', coords: [-34.7850, -58.3050] },
      { nombre: 'Villa Vatteone', coords: [-34.8150, -58.2850] },
      { nombre: 'La Capilla', coords: [-34.8900, -58.3100] },
    ],
  },
  {
    nombre: 'Almirante Brown',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de Almirante Brown',
    coords: [-34.7981, -58.3929],
    localidades: [
      { nombre: 'Adrogué', coords: [-34.7981, -58.3929] },
      { nombre: 'Burzaco', coords: [-34.8250, -58.3950] },
      { nombre: 'Longchamps', coords: [-34.8550, -58.3850] },
      { nombre: 'Glew', coords: [-34.8850, -58.3850] },
      { nombre: 'Claypole', coords: [-34.7950, -58.3450] },
      { nombre: 'Rafael Calzada', coords: [-34.7850, -58.3650] },
      { nombre: 'José Mármol', coords: [-34.7850, -58.3750] },
      { nombre: 'Ministro Rivadavia', coords: [-34.8400, -58.3450] },
      { nombre: 'San José Brown', coords: [-34.7750, -58.3550] },
    ],
  },
  {
    nombre: 'Esteban Echeverría',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de Esteban Echeverría',
    coords: [-34.8167, -58.4667],
    localidades: [
      { nombre: 'Monte Grande', coords: [-34.8167, -58.4667] },
      { nombre: 'Canning Echeverría', coords: [-34.8700, -58.5000] },
      { nombre: 'Luis Guillón', coords: [-34.7950, -58.4550] },
      { nombre: 'El Jagüel', coords: [-34.8400, -58.4900] },
      { nombre: '9 de Abril', coords: [-34.7650, -58.4850] },
    ],
  },
  {
    nombre: 'Ezeiza',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de Ezeiza',
    coords: [-34.8528, -58.5208],
    localidades: [
      { nombre: 'Ezeiza Centro', coords: [-34.8528, -58.5208] },
      { nombre: 'Tristán Suárez', coords: [-34.8900, -58.5600] },
      { nombre: 'La Unión', coords: [-34.8700, -58.5400] },
      { nombre: 'Carlos Spegazzini', coords: [-34.9250, -58.6050] },
      { nombre: 'Canning Ezeiza', coords: [-34.8650, -58.5100] },
    ],
  },
  {
    nombre: 'Presidente Perón',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de Presidente Perón',
    coords: [-34.9167, -58.3833],
    localidades: [
      { nombre: 'Guernica', coords: [-34.9167, -58.3833] },
    ],
  },
  {
    nombre: 'San Vicente',
    region: 'Gran Buenos Aires Sur',
    comuna: 'Partido de San Vicente',
    coords: [-35.0333, -58.4167],
    localidades: [
      { nombre: 'San Vicente Centro', coords: [-35.0333, -58.4167] },
      { nombre: 'Alejandro Korn', coords: [-34.9850, -58.3750] },
      { nombre: 'Domselaar', coords: [-35.1050, -58.2850] },
    ],
  },

  // =========================================================================
  // 5. LA PLATA Y REGIÓN CAPITAL
  // =========================================================================
  {
    nombre: 'La Plata',
    region: 'La Plata y Región Capital',
    comuna: 'Partido de La Plata',
    coords: [-34.9214, -57.9545],
    localidades: [
      { nombre: 'La Plata Casco Urbano', coords: [-34.9214, -57.9545] },
      { nombre: 'City Bell', coords: [-34.8650, -58.0450] },
      { nombre: 'Villa Elisa', coords: [-34.8550, -58.0750] },
      { nombre: 'Gonnet', coords: [-34.8850, -58.0250] },
      { nombre: 'Tolosa', coords: [-34.8950, -57.9750] },
      { nombre: 'Los Hornos', coords: [-34.9550, -57.9950] },
      { nombre: 'Ringuelet', coords: [-34.8850, -57.9850] },
      { nombre: 'San Carlos', coords: [-34.9350, -58.0050] },
      { nombre: 'Melchor Romero', coords: [-34.9600, -58.0650] },
      { nombre: 'El Peligro', coords: [-34.9950, -58.1550] },
      { nombre: 'Arturo Seguí', coords: [-34.8750, -58.1150] },
      { nombre: 'Villa Elvira', coords: [-34.9450, -57.9300] },
      { nombre: 'Altos de San Lorenzo', coords: [-34.9650, -57.9400] },
    ],
  },
  {
    nombre: 'Berisso',
    region: 'La Plata y Región Capital',
    comuna: 'Partido de Berisso',
    coords: [-34.8717, -57.8814],
    localidades: [
      { nombre: 'Berisso Centro', coords: [-34.8717, -57.8814] },
      { nombre: 'Villa Zula', coords: [-34.8950, -57.8650] },
      { nombre: 'Los Talas', coords: [-34.9350, -57.8050] },
    ],
  },
  {
    nombre: 'Ensenada',
    region: 'La Plata y Región Capital',
    comuna: 'Partido de Ensenada',
    coords: [-34.8617, -57.9097],
    localidades: [
      { nombre: 'Ensenada Centro', coords: [-34.8617, -57.9097] },
      { nombre: 'Punta Lara', coords: [-34.8150, -57.9750] },
      { nombre: 'El Dique', coords: [-34.8900, -57.9350] },
    ],
  },
  {
    nombre: 'Brandsen',
    region: 'La Plata y Región Capital',
    comuna: 'Partido de Brandsen',
    coords: [-35.1667, -58.2333],
    localidades: [
      { nombre: 'Coronel Brandsen Centro', coords: [-35.1667, -58.2333] },
      { nombre: 'Jeppener', coords: [-35.2600, -58.2200] },
      { nombre: 'Altamirano', coords: [-35.3500, -58.1600] },
      { nombre: 'Gómez', coords: [-35.0600, -58.3300] },
    ],
  },
  {
    nombre: 'Magdalena',
    region: 'La Plata y Región Capital',
    comuna: 'Partido de Magdalena',
    coords: [-35.0833, -57.5167],
    localidades: [
      { nombre: 'Magdalena Centro', coords: [-35.0833, -57.5167] },
      { nombre: 'Bavio (General Mansilla)', coords: [-35.0800, -57.7700] },
      { nombre: 'Atalaya', coords: [-35.0150, -57.5300] },
    ],
  },
  {
    nombre: 'Punta Indio',
    region: 'La Plata y Región Capital',
    comuna: 'Partido de Punta Indio',
    coords: [-35.2667, -57.2500],
    localidades: [
      { nombre: 'Verónica', coords: [-35.3850, -57.3400] },
      { nombre: 'Pipinas', coords: [-35.5350, -57.3200] },
      { nombre: 'Punta del Indio', coords: [-35.2667, -57.2500] },
    ],
  },

  // =========================================================================
  // 6. COSTA ATLÁNTICA BONAERENSE
  // =========================================================================
  {
    nombre: 'General Pueyrredón (Mar del Plata)',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de Gral. Pueyrredón',
    coords: [-38.0055, -57.5560],
    localidades: [
      { nombre: 'Mar del Plata Centro', coords: [-38.0055, -57.5560] },
      { nombre: 'Playa Grande / Güemes', coords: [-38.0280, -57.5350] },
      { nombre: 'La Perla', coords: [-37.9900, -57.5450] },
      { nombre: 'Punta Mogotes', coords: [-38.0650, -57.5450] },
      { nombre: 'Constitución', coords: [-37.9650, -57.5550] },
      { nombre: 'Puerto de Mar del Plata', coords: [-38.0450, -57.5450] },
      { nombre: 'Batán', coords: [-38.0050, -57.7150] },
      { nombre: 'Sierra de los Padres', coords: [-37.9450, -57.7750] },
      { nombre: 'Chapadmalal', coords: [-38.1900, -57.6500] },
    ],
  },
  {
    nombre: 'Partido de La Costa',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de La Costa',
    coords: [-36.6575, -56.6800],
    localidades: [
      { nombre: 'San Clemente del Tuyú', coords: [-36.3575, -56.7200] },
      { nombre: 'Santa Teresita', coords: [-36.5414, -56.6900] },
      { nombre: 'San Bernardo', coords: [-36.6872, -56.6775] },
      { nombre: 'Mar de Ajó', coords: [-36.7200, -56.6800] },
      { nombre: 'Las Toninas', coords: [-36.4800, -56.7000] },
      { nombre: 'Mar del Tuyú', coords: [-36.5750, -56.6900] },
      { nombre: 'La Lucila del Mar', coords: [-36.6550, -56.6800] },
      { nombre: 'Aguas Verdes', coords: [-36.6350, -56.6850] },
      { nombre: 'Costa del Este', coords: [-36.6100, -56.6850] },
      { nombre: 'Costa Azul', coords: [-36.6700, -56.6800] },
    ],
  },
  {
    nombre: 'Pinamar',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de Pinamar',
    coords: [-37.1089, -56.8617],
    localidades: [
      { nombre: 'Pinamar Centro', coords: [-37.1089, -56.8617] },
      { nombre: 'Ostende', coords: [-37.1250, -56.8650] },
      { nombre: 'Valeria del Mar', coords: [-37.1400, -56.8750] },
      { nombre: 'Cariló', coords: [-37.1650, -56.8900] },
    ],
  },
  {
    nombre: 'Villa Gesell',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de Villa Gesell',
    coords: [-37.2639, -56.9731],
    localidades: [
      { nombre: 'Villa Gesell Centro', coords: [-37.2639, -56.9731] },
      { nombre: 'Mar de las Pampas', coords: [-37.3300, -57.0150] },
      { nombre: 'Las Gaviotas', coords: [-37.3400, -57.0250] },
      { nombre: 'Mar Azul', coords: [-37.3500, -57.0350] },
    ],
  },
  {
    nombre: 'Necochea',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de Necochea',
    coords: [-38.5544, -58.7397],
    localidades: [
      { nombre: 'Necochea Centro', coords: [-38.5544, -58.7397] },
      { nombre: 'Quequén', coords: [-38.5400, -58.7050] },
      { nombre: 'La Dulce', coords: [-38.2950, -59.2000] },
      { nombre: 'Juan N. Fernández', coords: [-38.0050, -59.2600] },
    ],
  },
  {
    nombre: 'General Alvarado (Miramar)',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de Gral. Alvarado',
    coords: [-38.2717, -57.8394],
    localidades: [
      { nombre: 'Miramar Centro', coords: [-38.2717, -57.8394] },
      { nombre: 'Mar del Sud', coords: [-38.3450, -57.9900] },
      { nombre: 'Comandante Nicanor Otamendi', coords: [-38.1150, -57.9100] },
    ],
  },
  {
    nombre: 'Mar Chiquita',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de Mar Chiquita',
    coords: [-37.7333, -57.4167],
    localidades: [
      { nombre: 'Santa Clara del Mar', coords: [-37.8450, -57.5050] },
      { nombre: 'Coronel Vidal', coords: [-37.4500, -57.7300] },
      { nombre: 'Balneario Parque Mar Chiquita', coords: [-37.7400, -57.4250] },
      { nombre: 'Mar de Cobo', coords: [-37.7700, -57.4500] },
      { nombre: 'General Pirán', coords: [-37.2800, -57.7700] },
    ],
  },
  {
    nombre: 'Tres Arroyos',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de Tres Arroyos',
    coords: [-38.3742, -60.2794],
    localidades: [
      { nombre: 'Tres Arroyos Centro', coords: [-38.3742, -60.2794] },
      { nombre: 'Claromecó', coords: [-38.8550, -60.0750] },
      { nombre: 'Reta', coords: [-38.8950, -60.3450] },
      { nombre: 'Orense (Balneario)', coords: [-38.7050, -59.7850] },
      { nombre: 'Copetonas', coords: [-38.7300, -60.4600] },
    ],
  },
  {
    nombre: 'Monte Hermoso',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de Monte Hermoso',
    coords: [-38.9833, -61.2833],
    localidades: [
      { nombre: 'Monte Hermoso Centro', coords: [-38.9833, -61.2833] },
      { nombre: 'Balneario Sauce Grande', coords: [-38.9850, -61.2100] },
    ],
  },
  {
    nombre: 'Coronel Rosales',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de Coronel Rosales',
    coords: [-38.8786, -62.0739],
    localidades: [
      { nombre: 'Punta Alta', coords: [-38.8786, -62.0739] },
      { nombre: 'Pehuen Có', coords: [-38.9950, -61.5550] },
      { nombre: 'Villa del Mar', coords: [-38.8650, -62.1350] },
    ],
  },
  {
    nombre: 'San Cayetano',
    region: 'Costa Atlántica Bonaerense',
    comuna: 'Partido de San Cayetano',
    coords: [-38.3486, -59.6106],
    localidades: [
      { nombre: 'San Cayetano Centro', coords: [-38.3486, -59.6106] },
      { nombre: 'Balneario San Cayetano', coords: [-38.7350, -59.4350] },
      { nombre: 'Ochandío', coords: [-38.2500, -59.4900] },
    ],
  },

  // =========================================================================
  // 7. INTERIOR NORTE Y CUENCA DEL PARANÁ
  // =========================================================================
  {
    nombre: 'San Nicolás',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de San Nicolás',
    coords: [-33.3333, -60.2167],
    localidades: [
      { nombre: 'San Nicolás de los Arroyos', coords: [-33.3333, -60.2167] },
      { nombre: 'La Emilia', coords: [-33.3550, -60.3150] },
      { nombre: 'General Conesa', coords: [-33.5650, -60.1900] },
      { nombre: 'Campos Salles', coords: [-33.4050, -60.2100] },
      { nombre: 'Erézcano', coords: [-33.4750, -60.2900] },
    ],
  },
  {
    nombre: 'Pergamino',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de Pergamino',
    coords: [-33.8908, -60.5739],
    localidades: [
      { nombre: 'Pergamino Centro', coords: [-33.8908, -60.5739] },
      { nombre: 'Acevedo', coords: [-33.7450, -60.4050] },
      { nombre: 'Manuel Ocampo', coords: [-33.9950, -60.4200] },
      { nombre: 'Guerrico', coords: [-33.6850, -60.3100] },
      { nombre: 'Juan A. de la Peña', coords: [-33.8350, -60.4650] },
    ],
  },
  {
    nombre: 'San Pedro',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de San Pedro',
    coords: [-33.6792, -59.6672],
    localidades: [
      { nombre: 'San Pedro Centro', coords: [-33.6792, -59.6672] },
      { nombre: 'Gobernador Castro', coords: [-33.7250, -59.8350] },
      { nombre: 'Santa Lucía', coords: [-33.8950, -59.8700] },
      { nombre: 'Río Tala', coords: [-33.7450, -59.6350] },
      { nombre: 'Vuelta de Obligado', coords: [-33.5950, -59.8150] },
    ],
  },
  {
    nombre: 'Ramallo',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de Ramallo',
    coords: [-33.4833, -60.0000],
    localidades: [
      { nombre: 'Ramallo Pueblo', coords: [-33.4833, -60.0000] },
      { nombre: 'Villa Ramallo', coords: [-33.5150, -60.0350] },
      { nombre: 'Pérez Millán', coords: [-33.7850, -60.1650] },
    ],
  },
  {
    nombre: 'Baradero',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de Baradero',
    coords: [-33.8117, -59.5078],
    localidades: [
      { nombre: 'Baradero Centro', coords: [-33.8117, -59.5078] },
      { nombre: 'Villa Alsina', coords: [-33.9100, -59.3900] },
      { nombre: 'Irineo Portela', coords: [-34.0250, -59.6650] },
      { nombre: 'Santa Coloma', coords: [-34.0850, -59.5550] },
    ],
  },
  {
    nombre: 'Arrecifes',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de Arrecifes',
    coords: [-34.0628, -60.1042],
    localidades: [
      { nombre: 'Arrecifes Centro', coords: [-34.0628, -60.1042] },
      { nombre: 'Todd', coords: [-34.0050, -60.1650] },
      { nombre: 'Viña', coords: [-33.9350, -60.2200] },
    ],
  },
  {
    nombre: 'Capitán Sarmiento',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de Capitán Sarmiento',
    coords: [-34.1728, -59.7917],
    localidades: [
      { nombre: 'Capitán Sarmiento Centro', coords: [-34.1728, -59.7917] },
      { nombre: 'La Luisa', coords: [-34.1050, -59.8900] },
    ],
  },
  {
    nombre: 'Salto',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de Salto',
    coords: [-34.2925, -60.2547],
    localidades: [
      { nombre: 'Salto Centro', coords: [-34.2925, -60.2547] },
      { nombre: 'Inés Indart', coords: [-34.1950, -60.5250] },
      { nombre: 'Gahan', coords: [-34.3950, -60.1850] },
      { nombre: 'Berdier', coords: [-34.3850, -60.3350] },
    ],
  },
  {
    nombre: 'Colón',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de Colón',
    coords: [-33.8969, -61.0994],
    localidades: [
      { nombre: 'Colón Centro', coords: [-33.8969, -61.0994] },
      { nombre: 'El Arbolito', coords: [-33.8050, -61.0150] },
      { nombre: 'Pearson', coords: [-33.7250, -61.1600] },
    ],
  },
  {
    nombre: 'Rojas',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de Rojas',
    coords: [-34.1956, -60.7336],
    localidades: [
      { nombre: 'Rojas Centro', coords: [-34.1956, -60.7336] },
      { nombre: 'Carabelas', coords: [-34.0550, -60.8650] },
      { nombre: 'Rafael Obligado', coords: [-34.4050, -60.7950] },
    ],
  },
  {
    nombre: 'San Antonio de Areco',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de San Antonio de Areco',
    coords: [-34.2494, -59.4725],
    localidades: [
      { nombre: 'San Antonio de Areco Centro', coords: [-34.2494, -59.4725] },
      { nombre: 'Duggan', coords: [-34.3350, -59.6450] },
      { nombre: 'Villa Lía', coords: [-34.1650, -59.4100] },
    ],
  },
  {
    nombre: 'Carmen de Areco',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de Carmen de Areco',
    coords: [-34.3778, -59.8250],
    localidades: [
      { nombre: 'Carmen de Areco Centro', coords: [-34.3778, -59.8250] },
      { nombre: 'Gouin', coords: [-34.4650, -59.7850] },
      { nombre: 'Tres Sargentos', coords: [-34.3400, -59.9850] },
    ],
  },
  {
    nombre: 'Exaltación de la Cruz',
    region: 'Interior Norte y Cuenca del Paraná',
    comuna: 'Partido de Exaltación de la Cruz',
    coords: [-34.2931, -59.1022],
    localidades: [
      { nombre: 'Capilla del Señor', coords: [-34.2931, -59.1022] },
      { nombre: 'Los Cardales Exaltación', coords: [-34.3350, -58.9850] },
      { nombre: 'Parada Robles', coords: [-34.3850, -59.0750] },
      { nombre: 'Pavón Exaltación', coords: [-34.3150, -59.1450] },
    ],
  },

  // =========================================================================
  // 8. INTERIOR CENTRAL Y CUENCA DEL SALADO
  // =========================================================================
  {
    nombre: 'Luján',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Luján',
    coords: [-34.5703, -59.1050],
    localidades: [
      { nombre: 'Luján Centro', coords: [-34.5703, -59.1050] },
      { nombre: 'Jáuregui', coords: [-34.5850, -59.1850] },
      { nombre: 'Open Door', coords: [-34.4950, -59.0800] },
      { nombre: 'Carlos Keen', coords: [-34.4850, -59.2150] },
      { nombre: 'Cortínez', coords: [-34.5950, -59.2300] },
      { nombre: 'Olivera', coords: [-34.6250, -59.2950] },
    ],
  },
  {
    nombre: 'Mercedes',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Mercedes',
    coords: [-34.6514, -59.4308],
    localidades: [
      { nombre: 'Mercedes Centro', coords: [-34.6514, -59.4308] },
      { nombre: 'Gowland', coords: [-34.6550, -59.3450] },
      { nombre: 'Tomás Jofré', coords: [-34.6950, -59.2900] },
      { nombre: 'Goldney', coords: [-34.6150, -59.2550] },
    ],
  },
  {
    nombre: 'Cañuelas',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Cañuelas',
    coords: [-35.0500, -58.7500],
    localidades: [
      { nombre: 'Cañuelas Centro', coords: [-35.0500, -58.7500] },
      { nombre: 'Máximo Paz', coords: [-34.9650, -58.6200] },
      { nombre: 'Uribelarrea', coords: [-35.1150, -58.8950] },
      { nombre: 'Alejandro Petión', coords: [-34.9950, -58.6900] },
      { nombre: 'Vicente Casares', coords: [-34.9750, -58.6650] },
    ],
  },
  {
    nombre: 'Lobos',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Lobos',
    coords: [-35.1856, -59.0964],
    localidades: [
      { nombre: 'Lobos Centro', coords: [-35.1856, -59.0964] },
      { nombre: 'Empalme Lobos', coords: [-35.1550, -59.0650] },
      { nombre: 'Laguna de Lobos', coords: [-35.2850, -59.1300] },
      { nombre: 'Salvador María', coords: [-35.2950, -59.2300] },
    ],
  },
  {
    nombre: 'Navarro',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Navarro',
    coords: [-34.9972, -59.2789],
    localidades: [
      { nombre: 'Navarro Centro', coords: [-34.9972, -59.2789] },
      { nombre: 'Las Marianas', coords: [-35.0550, -59.4850] },
      { nombre: 'Villa Moll', coords: [-35.1450, -59.6200] },
    ],
  },
  {
    nombre: 'San Miguel del Monte',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Monte',
    coords: [-35.4389, -58.8083],
    localidades: [
      { nombre: 'Monte Centro', coords: [-35.4389, -58.8083] },
      { nombre: 'Abbott', coords: [-35.3050, -58.8150] },
      { nombre: 'Zenón Videla Dorna', coords: [-35.5350, -58.7450] },
    ],
  },
  {
    nombre: 'General Paz (Ranchos)',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de General Paz',
    coords: [-35.5167, -58.3167],
    localidades: [
      { nombre: 'Ranchos Centro', coords: [-35.5167, -58.3167] },
      { nombre: 'Loma Verde General Paz', coords: [-35.3450, -58.3850] },
      { nombre: 'Villanueva', coords: [-35.6650, -58.4200] },
    ],
  },
  {
    nombre: 'Chascomús',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Chascomús',
    coords: [-35.5761, -58.0108],
    localidades: [
      { nombre: 'Chascomús Centro', coords: [-35.5761, -58.0108] },
      { nombre: 'Gándara', coords: [-35.4850, -58.0750] },
      { nombre: 'Laguna Vitel', coords: [-35.5350, -58.0950] },
    ],
  },
  {
    nombre: 'Lezama',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Lezama',
    coords: [-35.9000, -57.8833],
    localidades: [
      { nombre: 'Lezama Centro', coords: [-35.9000, -57.8833] },
      { nombre: 'Monasterio', coords: [-35.7950, -57.9400] },
    ],
  },
  {
    nombre: 'Castelli',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Castelli',
    coords: [-36.0894, -57.8039],
    localidades: [
      { nombre: 'Castelli Centro', coords: [-36.0894, -57.8039] },
      { nombre: 'Centro Guerrero', coords: [-36.0150, -57.7300] },
    ],
  },
  {
    nombre: 'Dolores',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Dolores',
    coords: [-36.3131, -57.6792],
    localidades: [
      { nombre: 'Dolores Centro', coords: [-36.3131, -57.6792] },
      { nombre: 'Sevigné', coords: [-36.2150, -57.7100] },
    ],
  },
  {
    nombre: 'General Lavalle',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de General Lavalle',
    coords: [-36.5917, -56.9444],
    localidades: [
      { nombre: 'General Lavalle Centro', coords: [-36.5917, -56.9444] },
      { nombre: 'Pavón General Lavalle', coords: [-36.6850, -56.7650] },
      { nombre: 'Las Chacras', coords: [-36.5250, -56.8850] },
    ],
  },
  {
    nombre: 'Tordillo',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Tordillo',
    coords: [-36.5333, -57.4000],
    localidades: [
      { nombre: 'General Conesa Tordillo', coords: [-36.5333, -57.4000] },
    ],
  },
  {
    nombre: 'General Guido',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de General Guido',
    coords: [-36.6333, -57.8000],
    localidades: [
      { nombre: 'General Guido Centro', coords: [-36.6333, -57.8000] },
      { nombre: 'Labardén', coords: [-36.8850, -57.9400] },
    ],
  },
  {
    nombre: 'Maipú',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Maipú',
    coords: [-36.8667, -57.8833],
    localidades: [
      { nombre: 'Maipú Centro', coords: [-36.8667, -57.8833] },
      { nombre: 'Las Armas', coords: [-37.0150, -57.8400] },
      { nombre: 'Santo Domingo', coords: [-36.7050, -57.7850] },
    ],
  },
  {
    nombre: 'Las Flores',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Las Flores',
    coords: [-36.0167, -59.1000],
    localidades: [
      { nombre: 'Las Flores Centro', coords: [-36.0167, -59.1000] },
      { nombre: 'Pardo', coords: [-36.1950, -59.3400] },
      { nombre: 'El Trigo', coords: [-35.8550, -59.3650] },
    ],
  },
  {
    nombre: 'Saladillo',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Saladillo',
    coords: [-35.6333, -59.7833],
    localidades: [
      { nombre: 'Saladillo Centro', coords: [-35.6333, -59.7833] },
      { nombre: 'Del Carril', coords: [-35.5350, -59.5600] },
      { nombre: 'Cazón', coords: [-35.5950, -59.6650] },
      { nombre: 'Polvaredas', coords: [-35.4850, -59.7150] },
      { nombre: 'Álvarez de Toledo', coords: [-35.7350, -59.8450] },
    ],
  },
  {
    nombre: '25 de Mayo',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de 25 de Mayo',
    coords: [-35.4333, -60.1667],
    localidades: [
      { nombre: '25 de Mayo Centro', coords: [-35.4333, -60.1667] },
      { nombre: 'Norberto de la Riestra', coords: [-35.2850, -59.8150] },
      { nombre: 'Pedernales', coords: [-35.2650, -59.7250] },
      { nombre: 'Valdés', coords: [-35.5850, -60.3650] },
    ],
  },
  {
    nombre: 'Roque Pérez',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Roque Pérez',
    coords: [-35.4056, -59.3278],
    localidades: [
      { nombre: 'Roque Pérez Centro', coords: [-35.4056, -59.3278] },
      { nombre: 'Carlos Beguerie', coords: [-35.3350, -59.1650] },
    ],
  },
  {
    nombre: 'General Alvear',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de General Alvear',
    coords: [-36.0000, -60.0167],
    localidades: [
      { nombre: 'General Alvear Centro', coords: [-36.0000, -60.0167] },
    ],
  },
  {
    nombre: 'Tapalqué',
    region: 'Interior Central y Cuenca del Salado',
    comuna: 'Partido de Tapalqué',
    coords: [-36.3583, -60.0250],
    localidades: [
      { nombre: 'Tapalqué Centro', coords: [-36.3583, -60.0250] },
      { nombre: 'Crotto', coords: [-36.5650, -60.3200] },
      { nombre: 'Velloso', coords: [-36.1950, -59.8700] },
    ],
  },

  // =========================================================================
  // 9. INTERIOR NOROESTE BONAERENSE
  // =========================================================================
  {
    nombre: 'Junín',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Junín',
    coords: [-34.5839, -60.9433],
    localidades: [
      { nombre: 'Junín Centro', coords: [-34.5839, -60.9433] },
      { nombre: 'Agustín Roca', coords: [-34.4850, -60.8900] },
      { nombre: 'Saforcada', coords: [-34.5650, -61.0750] },
      { nombre: 'Morse', coords: [-34.7550, -60.8650] },
      { nombre: 'Fortín Tiburcio', coords: [-34.3800, -61.1200] },
      { nombre: 'Balneario Laguna de Gómez', coords: [-34.6550, -61.0250] },
    ],
  },
  {
    nombre: 'Chacabuco',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Chacabuco',
    coords: [-34.6417, -60.4722],
    localidades: [
      { nombre: 'Chacabuco Centro', coords: [-34.6417, -60.4722] },
      { nombre: 'O’Higgins', coords: [-34.5850, -60.7100] },
      { nombre: 'Rawson', coords: [-34.7350, -60.1150] },
      { nombre: 'Castilla', coords: [-34.6150, -59.9850] },
    ],
  },
  {
    nombre: 'Chivilcoy',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Chivilcoy',
    coords: [-34.8958, -60.0167],
    localidades: [
      { nombre: 'Chivilcoy Centro', coords: [-34.8958, -60.0167] },
      { nombre: 'Moquehuá', coords: [-35.0850, -59.8800] },
      { nombre: 'Gorostiaga', coords: [-34.8350, -59.8950] },
      { nombre: 'Emilio Ayarza', coords: [-34.7650, -60.1150] },
      { nombre: 'La Rica', coords: [-35.0350, -60.0350] },
    ],
  },
  {
    nombre: 'Bragado',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Bragado',
    coords: [-35.1189, -60.4900],
    localidades: [
      { nombre: 'Bragado Centro', coords: [-35.1189, -60.4900] },
      { nombre: 'Eduardo O’Brien', coords: [-34.9050, -60.7550] },
      { nombre: 'Mechita Bragado', coords: [-35.0750, -60.4050] },
      { nombre: 'Comodoro Py', coords: [-35.3850, -60.5050] },
      { nombre: 'Warnes', coords: [-34.9650, -60.4350] },
    ],
  },
  {
    nombre: 'Alberti',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Alberti',
    coords: [-35.0333, -60.2833],
    localidades: [
      { nombre: 'Alberti Centro', coords: [-35.0333, -60.2833] },
      { nombre: 'Mechita Alberti', coords: [-35.0750, -60.4000] },
      { nombre: 'Pla', coords: [-35.1950, -60.3650] },
    ],
  },
  {
    nombre: '9 de Julio',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de 9 de Julio',
    coords: [-35.4444, -60.8833],
    localidades: [
      { nombre: '9 de Julio Centro', coords: [-35.4444, -60.8833] },
      { nombre: 'Dudignac', coords: [-35.6550, -60.7050] },
      { nombre: 'Facundo Quiroga', coords: [-35.2750, -61.4050] },
      { nombre: 'Patricios', coords: [-35.5650, -60.7100] },
      { nombre: 'French', coords: [-35.5350, -60.9950] },
    ],
  },
  {
    nombre: 'Carlos Casares',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Carlos Casares',
    coords: [-35.6222, -61.3650],
    localidades: [
      { nombre: 'Carlos Casares Centro', coords: [-35.6222, -61.3650] },
      { nombre: 'Moctezuma', coords: [-35.4150, -61.5050] },
      { nombre: 'Smith', coords: [-35.3450, -61.4350] },
      { nombre: 'Bellocq', coords: [-35.9250, -61.3850] },
    ],
  },
  {
    nombre: 'Pehuajó',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Pehuajó',
    coords: [-35.8117, -61.8986],
    localidades: [
      { nombre: 'Pehuajó Centro', coords: [-35.8117, -61.8986] },
      { nombre: 'Francisco Madero', coords: [-35.8550, -62.0650] },
      { nombre: 'Mones Cazón', coords: [-36.2750, -61.9450] },
      { nombre: 'Juan José Paso', coords: [-35.8650, -62.2750] },
      { nombre: 'Chiclana', coords: [-35.7950, -61.6850] },
    ],
  },
  {
    nombre: 'Trenque Lauquen',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Trenque Lauquen',
    coords: [-35.9750, -62.7333],
    localidades: [
      { nombre: 'Trenque Lauquen Centro', coords: [-35.9750, -62.7333] },
      { nombre: 'Treinta de Agosto', coords: [-36.2750, -62.5450] },
      { nombre: 'Beruti', coords: [-35.8550, -62.5650] },
    ],
  },
  {
    nombre: 'Lincoln',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Lincoln',
    coords: [-34.8667, -61.5333],
    localidades: [
      { nombre: 'Lincoln Centro', coords: [-34.8667, -61.5333] },
      { nombre: 'Roberts', coords: [-34.8150, -62.0750] },
      { nombre: 'Pasteur', coords: [-34.8050, -62.2450] },
      { nombre: 'El Triunfo', coords: [-35.0550, -61.7350] },
      { nombre: 'Arenaza', coords: [-34.9650, -61.8850] },
    ],
  },
  {
    nombre: 'General Pinto',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de General Pinto',
    coords: [-34.7667, -61.8833],
    localidades: [
      { nombre: 'General Pinto Centro', coords: [-34.7667, -61.8833] },
      { nombre: 'Germania', coords: [-34.5650, -62.0750] },
      { nombre: 'Villa Francia', coords: [-34.7850, -62.2450] },
    ],
  },
  {
    nombre: 'General Villegas',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de General Villegas',
    coords: [-35.0333, -63.0167],
    localidades: [
      { nombre: 'General Villegas Centro', coords: [-35.0333, -63.0167] },
      { nombre: 'Piedritas', coords: [-34.7650, -62.9850] },
      { nombre: 'Banderaló', coords: [-35.0050, -63.3650] },
      { nombre: 'Emilio V. Bunge', coords: [-34.6450, -62.8350] },
      { nombre: 'Coronel Charlone', coords: [-34.5350, -63.2650] },
      { nombre: 'Santa Regina', coords: [-34.4250, -63.0750] },
    ],
  },
  {
    nombre: 'Florentino Ameghino',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de F. Ameghino',
    coords: [-34.8478, -62.4678],
    localidades: [
      { nombre: 'Ameghino Centro', coords: [-34.8478, -62.4678] },
      { nombre: 'Blaquier', coords: [-34.6150, -62.4150] },
      { nombre: 'Porvenir', coords: [-34.9950, -62.6150] },
    ],
  },
  {
    nombre: 'Leandro N. Alem (Vedia)',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Leandro N. Alem',
    coords: [-34.4983, -61.5422],
    localidades: [
      { nombre: 'Vedia Centro', coords: [-34.4983, -61.5422] },
      { nombre: 'Leandro N. Alem', coords: [-34.5250, -61.3950] },
      { nombre: 'Juan Bautista Alberdi', coords: [-34.4350, -61.8150] },
      { nombre: 'El Dorado', coords: [-34.4250, -61.6450] },
    ],
  },
  {
    nombre: 'General Arenales',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de General Arenales',
    coords: [-34.3000, -61.3000],
    localidades: [
      { nombre: 'General Arenales Centro', coords: [-34.3000, -61.3000] },
      { nombre: 'Ascensión', coords: [-34.3650, -61.4150] },
      { nombre: 'Ferré', coords: [-34.1250, -61.1350] },
      { nombre: 'Arribeños', coords: [-34.2150, -61.3850] },
    ],
  },
  {
    nombre: 'Rivadavia (América)',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Rivadavia',
    coords: [-35.4883, -62.9733],
    localidades: [
      { nombre: 'América Centro', coords: [-35.4883, -62.9733] },
      { nombre: 'Fortín Olavarría', coords: [-35.6950, -63.0250] },
      { nombre: 'González Moreno', coords: [-35.5550, -63.3850] },
    ],
  },
  {
    nombre: 'Carlos Tejedor',
    region: 'Interior Noroeste Bonaerense',
    comuna: 'Partido de Carlos Tejedor',
    coords: [-35.3900, -62.4242],
    localidades: [
      { nombre: 'Carlos Tejedor Centro', coords: [-35.3900, -62.4242] },
      { nombre: 'Tres Algarrobos', coords: [-35.2050, -62.6150] },
      { nombre: 'Curarú', coords: [-35.5950, -62.1950] },
    ],
  },

  // =========================================================================
  // 10. INTERIOR CENTRO Y SISTEMA SERRANO DE TANDILIA
  // =========================================================================
  {
    nombre: 'Tandil',
    region: 'Interior Centro y Sierras de Tandilia',
    comuna: 'Partido de Tandil',
    coords: [-37.3217, -59.1332],
    localidades: [
      { nombre: 'Tandil Centro', coords: [-37.3217, -59.1332] },
      { nombre: 'Cerro Leones', coords: [-37.3050, -59.1950] },
      { nombre: 'María Ignacia (Vela)', coords: [-37.5850, -59.5050] },
      { nombre: 'Gardey', coords: [-37.3100, -59.3900] },
      { nombre: 'De la Canal', coords: [-37.1550, -59.0850] },
    ],
  },
  {
    nombre: 'Olavarría',
    region: 'Interior Centro y Sierras de Tandilia',
    comuna: 'Partido de Olavarría',
    coords: [-36.8927, -60.3225],
    localidades: [
      { nombre: 'Olavarría Centro', coords: [-36.8927, -60.3225] },
      { nombre: 'Sierras Bayas', coords: [-36.9300, -60.1850] },
      { nombre: 'Hinojo', coords: [-36.8650, -60.1650] },
      { nombre: 'Loma Negra', coords: [-36.9950, -60.2800] },
      { nombre: 'Colonia San Miguel', coords: [-36.9750, -60.1950] },
      { nombre: 'Colonia Hinojo', coords: [-36.8850, -60.1850] },
    ],
  },
  {
    nombre: 'Azul',
    region: 'Interior Centro y Sierras de Tandilia',
    comuna: 'Partido de Azul',
    coords: [-36.7772, -59.8586],
    localidades: [
      { nombre: 'Azul Centro', coords: [-36.7772, -59.8586] },
      { nombre: 'Chillar', coords: [-37.3150, -59.9850] },
      { nombre: 'Cacharí', coords: [-36.3850, -59.5050] },
      { nombre: '16 de Julio', coords: [-37.2850, -60.1850] },
    ],
  },
  {
    nombre: 'Balcarce',
    region: 'Interior Centro y Sierras de Tandilia',
    comuna: 'Partido de Balcarce',
    coords: [-37.8467, -58.2556],
    localidades: [
      { nombre: 'Balcarce Centro', coords: [-37.8467, -58.2556] },
      { nombre: 'San Agustín Balcarce', coords: [-38.0050, -58.3450] },
      { nombre: 'Los Pinos', coords: [-37.9450, -58.3200] },
      { nombre: 'Napaleofú', coords: [-37.6250, -58.7450] },
    ],
  },
  {
    nombre: 'Ayacucho',
    region: 'Interior Centro y Sierras de Tandilia',
    comuna: 'Partido de Ayacucho',
    coords: [-37.1500, -58.4833],
    localidades: [
      { nombre: 'Ayacucho Centro', coords: [-37.1500, -58.4833] },
      { nombre: 'Udaquiola', coords: [-36.7150, -58.2850] },
      { nombre: 'Solanet', coords: [-37.0350, -58.3150] },
    ],
  },
  {
    nombre: 'Rauch',
    region: 'Interior Centro y Sierras de Tandilia',
    comuna: 'Partido de Rauch',
    coords: [-36.7750, -59.0889],
    localidades: [
      { nombre: 'Rauch Centro', coords: [-36.7750, -59.0889] },
      { nombre: 'Miranda', coords: [-36.9450, -59.1850] },
    ],
  },
  {
    nombre: 'Benito Juárez',
    region: 'Interior Centro y Sierras de Tandilia',
    comuna: 'Partido de Benito Juárez',
    coords: [-37.6750, -59.8000],
    localidades: [
      { nombre: 'Benito Juárez Centro', coords: [-37.6750, -59.8000] },
      { nombre: 'Barker', coords: [-37.6450, -59.3950] },
      { nombre: 'Villa Cacique', coords: [-37.6650, -59.4100] },
      { nombre: 'Tedín Uriburu', coords: [-37.4050, -59.9850] },
    ],
  },
  {
    nombre: 'Adolfo Gonzales Chaves',
    region: 'Interior Centro y Sierras de Tandilia',
    comuna: 'Partido de A. Gonzales Chaves',
    coords: [-38.0333, -60.1000],
    localidades: [
      { nombre: 'Gonzales Chaves Centro', coords: [-38.0333, -60.1000] },
      { nombre: 'De la Garma', coords: [-37.9150, -60.4200] },
      { nombre: 'Juan Eulogio Barra', coords: [-37.7850, -60.5900] },
    ],
  },
  {
    nombre: 'General Juan Madariaga',
    region: 'Interior Centro y Sierras de Tandilia',
    comuna: 'Partido de Gral. Madariaga',
    coords: [-37.0000, -57.1333],
    localidades: [
      { nombre: 'General Madariaga Centro', coords: [-37.0000, -57.1333] },
    ],
  },

  // =========================================================================
  // 11. INTERIOR SUDOESTE Y SISTEMA DE VENTANIA
  // =========================================================================
  {
    nombre: 'Bahía Blanca',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Bahía Blanca',
    coords: [-38.7196, -62.2724],
    localidades: [
      { nombre: 'Bahía Blanca Centro', coords: [-38.7196, -62.2724] },
      { nombre: 'Ingeniero White', coords: [-38.7850, -62.2600] },
      { nombre: 'General Daniel Cerri', coords: [-38.7200, -62.4050] },
      { nombre: 'Cabildo', coords: [-38.4850, -61.9600] },
      { nombre: 'Villa Harding Green', coords: [-38.7150, -62.2050] },
      { nombre: 'Villa Bordeu', coords: [-38.6750, -62.3150] },
    ],
  },
  {
    nombre: 'Coronel Suárez',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Coronel Suárez',
    coords: [-37.4583, -61.9333],
    localidades: [
      { nombre: 'Coronel Suárez Centro', coords: [-37.4583, -61.9333] },
      { nombre: 'Santa María', coords: [-37.5450, -61.8850] },
      { nombre: 'San José Suárez', coords: [-37.5150, -61.9100] },
      { nombre: 'Santa Trinidad', coords: [-37.4850, -61.9250] },
      { nombre: 'Huanguelén', coords: [-37.0650, -61.9400] },
      { nombre: 'Villa Arcadia', coords: [-38.1350, -61.7900] },
    ],
  },
  {
    nombre: 'Tornquist (Sierra de la Ventana)',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Tornquist',
    coords: [-38.1000, -62.2167],
    localidades: [
      { nombre: 'Tornquist Centro', coords: [-38.1000, -62.2167] },
      { nombre: 'Sierra de la Ventana', coords: [-38.1350, -61.7950] },
      { nombre: 'Villa Ventana', coords: [-38.0850, -61.9250] },
      { nombre: 'Saldungaray', coords: [-38.2050, -61.7750] },
      { nombre: 'San Andrés de la Sierra', coords: [-38.1250, -61.9750] },
    ],
  },
  {
    nombre: 'Coronel Pringles',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Coronel Pringles',
    coords: [-37.9833, -61.3500],
    localidades: [
      { nombre: 'Coronel Pringles Centro', coords: [-37.9833, -61.3500] },
      { nombre: 'Indio Rico', coords: [-38.3350, -60.8850] },
    ],
  },
  {
    nombre: 'Saavedra (Pigüé)',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Saavedra',
    coords: [-37.6000, -62.4000],
    localidades: [
      { nombre: 'Pigüé Centro', coords: [-37.6000, -62.4000] },
      { nombre: 'Saavedra Pueblo', coords: [-37.7650, -62.3450] },
      { nombre: 'Espartillar', coords: [-37.3550, -62.4450] },
      { nombre: 'Goyena', coords: [-37.7450, -62.6050] },
      { nombre: 'Dufaur', coords: [-37.9150, -62.3150] },
    ],
  },
  {
    nombre: 'Puan',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Puan',
    coords: [-37.5333, -62.7667],
    localidades: [
      { nombre: 'Puan Centro', coords: [-37.5333, -62.7667] },
      { nombre: 'Darregueira', coords: [-37.6850, -63.0150] },
      { nombre: '17 de Agosto', coords: [-37.8950, -62.9450] },
      { nombre: 'Felipe Solá', coords: [-38.0150, -62.8150] },
      { nombre: 'Bordenave', coords: [-37.7950, -63.0250] },
    ],
  },
  {
    nombre: 'Adolfo Alsina (Carhué)',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Adolfo Alsina',
    coords: [-37.1833, -62.7500],
    localidades: [
      { nombre: 'Carhué Centro (Lago Epecuén)', coords: [-37.1833, -62.7500] },
      { nombre: 'Rivera', coords: [-37.1650, -63.2450] },
      { nombre: 'San Miguel Arcángel', coords: [-37.4450, -63.1450] },
      { nombre: 'Villa Maza', coords: [-36.7950, -63.3350] },
    ],
  },
  {
    nombre: 'Guaminí',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Guaminí',
    coords: [-37.0167, -62.4167],
    localidades: [
      { nombre: 'Guaminí Centro', coords: [-37.0167, -62.4167] },
      { nombre: 'Casbas', coords: [-36.7850, -62.4950] },
      { nombre: 'Laguna Alsina (Bonifacio)', coords: [-36.8150, -62.2450] },
      { nombre: 'Garré', coords: [-36.6350, -62.6150] },
    ],
  },
  {
    nombre: 'Bolívar',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Bolívar',
    coords: [-36.2333, -61.1167],
    localidades: [
      { nombre: 'San Carlos de Bolívar', coords: [-36.2333, -61.1167] },
      { nombre: 'Urdampilleta', coords: [-36.4550, -61.4250] },
      { nombre: 'Pirovano', coords: [-36.5150, -61.5650] },
      { nombre: 'Hale', coords: [-36.0050, -60.8650] },
    ],
  },
  {
    nombre: 'Daireaux',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Daireaux',
    coords: [-36.6000, -61.7500],
    localidades: [
      { nombre: 'Daireaux Centro', coords: [-36.6000, -61.7500] },
      { nombre: 'Arboledas', coords: [-36.7950, -61.5150] },
      { nombre: 'Salazar', coords: [-36.3350, -62.1950] },
    ],
  },
  {
    nombre: 'Hipólito Yrigoyen (Henderson)',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Hipólito Yrigoyen',
    coords: [-36.2972, -61.7167],
    localidades: [
      { nombre: 'Henderson Centro', coords: [-36.2972, -61.7167] },
      { nombre: 'Herrera Vegas', coords: [-36.3850, -61.4950] },
    ],
  },
  {
    nombre: 'Pellegrini',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Pellegrini',
    coords: [-36.2667, -63.1667],
    localidades: [
      { nombre: 'Pellegrini Centro', coords: [-36.2667, -63.1667] },
      { nombre: 'Bocayuva', coords: [-36.1950, -63.0750] },
      { nombre: 'De Bary', coords: [-36.3850, -63.2950] },
    ],
  },
  {
    nombre: 'Salliqueló',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Salliqueló',
    coords: [-36.7500, -62.9667],
    localidades: [
      { nombre: 'Salliqueló Centro', coords: [-36.7500, -62.9667] },
      { nombre: 'Quenumá', coords: [-36.6550, -63.1850] },
    ],
  },
  {
    nombre: 'Tres Lomas',
    region: 'Interior Sudoeste y Ventania',
    comuna: 'Partido de Tres Lomas',
    coords: [-36.4600, -62.8600],
    localidades: [
      { nombre: 'Tres Lomas Centro', coords: [-36.4600, -62.8600] },
      { nombre: 'Ingeniero Thompson', coords: [-36.5650, -62.9150] },
    ],
  },

  // =========================================================================
  // 12. EXTREMO SUR PATAGÓNICO BONAERENSE
  // =========================================================================
  {
    nombre: 'Villarino',
    region: 'Extremo Sur Patagónico Bonaerense',
    comuna: 'Partido de Villarino',
    coords: [-38.8167, -62.6833],
    localidades: [
      { nombre: 'Médanos', coords: [-38.8167, -62.6833] },
      { nombre: 'Pedro Luro', coords: [-39.5050, -62.6850] },
      { nombre: 'Mayor Buratovich', coords: [-39.2600, -62.6150] },
      { nombre: 'Hilario Ascasubi', coords: [-39.3650, -62.6500] },
      { nombre: 'Argerich', coords: [-38.7450, -62.5950] },
      { nombre: 'Juan Cousté (Algarrobo)', coords: [-38.8950, -63.1450] },
    ],
  },
  {
    nombre: 'Patagones',
    region: 'Extremo Sur Patagónico Bonaerense',
    comuna: 'Partido de Patagones',
    coords: [-40.8000, -62.9833],
    localidades: [
      { nombre: 'Carmen de Patagones', coords: [-40.8000, -62.9833] },
      { nombre: 'Villalonga', coords: [-39.9150, -62.6150] },
      { nombre: 'Stroeder', coords: [-40.1850, -62.6200] },
      { nombre: 'Bahía San Blas', coords: [-40.5550, -62.2350] },
      { nombre: 'Pradere', coords: [-39.5850, -62.6650] },
      { nombre: 'Los Pocitos', coords: [-40.4350, -62.4200] },
    ],
  },
];

// Agrupación estructurada de Partidos por Región
export const REGIONES_DATA: RegionData[] = (() => {
  const map = new Map<string, MunicipioData[]>();
  for (const m of MUNICIPIOS_DATA) {
    const list = map.get(m.region) || [];
    list.push(m);
    map.set(m.region, list);
  }
  const result: RegionData[] = [];
  for (const [region, partidos] of map.entries()) {
    result.push({ region, partidos });
  }
  return result;
})();

export function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function toTitleCase(str: string): string {
  return str
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Mapa plano rápido de todas las localidades y municipios a sus coordenadas exactas
export const EXACT_COORDS_MAP: Record<string, { coords: [number, number]; comuna: string; desc: string }> = {};

for (const m of MUNICIPIOS_DATA) {
  const normM = normalizeName(m.nombre);
  EXACT_COORDS_MAP[normM] = {
    coords: m.coords,
    comuna: m.comuna,
    desc: `${m.comuna} · Zona Central`,
  };

  for (const loc of m.localidades) {
    const normLoc = normalizeName(loc.nombre);
    EXACT_COORDS_MAP[normLoc] = {
      coords: loc.coords,
      comuna: m.comuna,
      desc: `${loc.nombre}, ${m.nombre}`,
    };
    EXACT_COORDS_MAP[`${normLoc} ${normM}`] = {
      coords: loc.coords,
      comuna: m.comuna,
      desc: `${loc.nombre}, ${m.nombre}`,
    };
    EXACT_COORDS_MAP[`${normM} ${normLoc}`] = {
      coords: loc.coords,
      comuna: m.comuna,
      desc: `${loc.nombre}, ${m.nombre}`,
    };
  }
}

// Resuelve coordenadas exactas para cualquier combinación de Municipio y Localidad
export function resolvePreciseCoords(
  municipio?: string,
  localidad?: string,
  calle?: string,
  existingWorkers?: TradeWorker[]
): [number, number] {
  const normM = municipio ? normalizeName(municipio) : '';
  const normL = localidad ? normalizeName(localidad) : '';

  // 1. Si hay localidad específica, buscar coincidencia en EXACT_COORDS_MAP
  if (normL) {
    if (normM && EXACT_COORDS_MAP[`${normL} ${normM}`]) {
      return EXACT_COORDS_MAP[`${normL} ${normM}`].coords;
    }
    if (EXACT_COORDS_MAP[normL]) {
      return EXACT_COORDS_MAP[normL].coords;
    }
  }

  // 2. Buscar por municipio en el catálogo estructurado
  if (normM) {
    const foundM = MUNICIPIOS_DATA.find((m) => {
      const nm = normalizeName(m.nombre);
      return nm === normM || normM.includes(nm) || nm.includes(normM);
    });
    if (foundM) {
      if (normL) {
        const foundLoc = foundM.localidades.find((l) => {
          const nl = normalizeName(l.nombre);
          return nl === normL || normL.includes(nl) || nl.includes(normL);
        });
        if (foundLoc) return foundLoc.coords;
      }
      return foundM.coords;
    }
  }

  // 3. Revisar si ya existe un trabajador en ese municipio o localidad
  if (existingWorkers && existingWorkers.length > 0) {
    const match = existingWorkers.find((w) => {
      const wM = normalizeName(w.municipio || '');
      const wL = normalizeName(w.localidad || w.zone || '');
      return (normM && wM.includes(normM)) || (normL && wL.includes(normL));
    });
    if (match && match.mapCoords?.lat && match.mapCoords?.lng) {
      return [match.mapCoords.lat, match.mapCoords.lng];
    }
  }

  // 4. Fallbacks territoriales por nombres clave
  if (normM.includes('pilar') || normL.includes('pilar')) {
    return [-34.4586, -58.9142];
  }
  if (normM.includes('malvina') || normL.includes('malvina')) {
    return [-34.5028, -58.6983];
  }
  if (normM.includes('quilmes') || normL.includes('quilmes')) {
    return [-34.7242, -58.2608];
  }
  if (normM.includes('la plata') || normL.includes('la plata')) {
    return [-34.9214, -57.9545];
  }
  if (normM.includes('mar del plata') || normL.includes('mar del plata') || normM.includes('pueyrredon')) {
    return [-38.0055, -57.5560];
  }
  if (normM.includes('bahia blanca') || normL.includes('bahia blanca')) {
    return [-38.7196, -62.2724];
  }
  if (normM.includes('tandil') || normL.includes('tandil')) {
    return [-37.3217, -59.1332];
  }
  if (normM.includes('matanza') || normL.includes('matanza')) {
    return [-34.6750, -58.5600];
  }

  // Fallback por defecto a Villa Urquiza / CABA
  return [-34.5735, -58.4878];
}

// Alias de conveniencia para compatibilidad con componentes que pasen un único string
export function resolveLocalityCoords(
  zoneOrName?: string,
  existingWorkers?: TradeWorker[]
): [number, number] {
  if (!zoneOrName) return [-34.5735, -58.4878];
  
  const match = zoneOrName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return resolvePreciseCoords(match[2].trim(), match[1].trim(), undefined, existingWorkers);
  }
  return resolvePreciseCoords(zoneOrName, zoneOrName, undefined, existingWorkers);
}

// Obtiene las localidades asociadas a un municipio seleccionado
export function getLocalidadesForMunicipio(municipioNombre: string): LocalidadInfo[] {
  if (!municipioNombre) return [];
  const norm = normalizeName(municipioNombre);
  const found = MUNICIPIOS_DATA.find((m) => {
    const normM = normalizeName(m.nombre);
    return normM === norm || norm.includes(normM) || normM.includes(norm);
  });
  return found ? found.localidades : [];
}

// Geocodificador inteligente
export async function geocodeLocationOrAddress(
  municipio: string,
  localidad: string,
  calle?: string
): Promise<{ coords: [number, number]; displayName?: string }> {
  const catalogCoords = resolvePreciseCoords(municipio, localidad, calle);

  if (calle && calle.trim().length > 3) {
    try {
      const cleanCalle = calle.replace(/al\s+\d+/i, '').trim();
      const query = `${cleanCalle}, ${localidad ? localidad.trim() + ', ' : ''}${municipio.trim()}, Buenos Aires, Argentina`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          signal: controller.signal,
          headers: { 'Accept-Language': 'es' },
        }
      );
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0 && data[0].lat && data[0].lon) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (lat < -33.0 && lat > -41.5 && lon < -56.0 && lon > -64.0) {
            return { coords: [lat, lon], displayName: data[0].display_name };
          }
        }
      }
    } catch {
      // Fallback a las coordenadas exactas del catálogo
    }
  }

  return { coords: catalogCoords };
}

// Limpia nombres para interfaz estilo Computrabajo (sin texto entre paréntesis)
export function cleanDisplayName(name: string): string {
  if (!name) return '';
  if (name.includes('(') && name.includes(')')) {
    const insideMatch = name.match(/\((.*?)\)/);
    const inside = insideMatch ? insideMatch[1].trim() : '';
    const outside = name.replace(/\s*\(.*?\)/g, '').trim();

    // Casos notorios donde el nombre común está adentro
    if (inside.toLowerCase().includes('mar del plata')) return 'Mar del Plata';
    if (inside.toLowerCase().includes('miramar')) return 'Miramar';
    if (inside.toLowerCase().includes('sierra de la ventana')) return 'Sierra de la Ventana';
    if (inside.toLowerCase().includes('carhue')) return 'Carhué';
    if (inside.toLowerCase().includes('pigue')) return 'Pigüé';
    if (inside.toLowerCase().includes('ranchos')) return 'Ranchos';
    if (inside.toLowerCase().includes('henderson')) return 'Henderson';
    if (inside.toLowerCase().includes('america')) return 'América';
    if (inside.toLowerCase().includes('vedia')) return 'Vedia';
    if (inside.toLowerCase().includes('once')) return 'Balvanera';
    if (inside.toLowerCase().includes('centro')) return outside;

    if (inside.toLowerCase().includes('partido') || inside.toLowerCase().includes('comuna')) {
      return outside;
    }

    return outside || inside;
  }
  return name.trim();
}

// Encuentra la localidad y municipio del catálogo más cercano a unas coordenadas GPS
export function findClosestLocality(lat: number, lng: number): {
  municipio: string;
  localidad: string;
  coords: [number, number];
  distanceKm: number;
} {
  let closest = {
    municipio: 'Pilar',
    localidad: 'Del Viso',
    coords: [-34.4447, -58.7997] as [number, number],
    distanceKm: Infinity,
  };

  for (const m of MUNICIPIOS_DATA) {
    for (const loc of m.localidades) {
      const dLat = (loc.coords[0] - lat) * (Math.PI / 180);
      const dLng = (loc.coords[1] - lng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat * (Math.PI / 180)) *
          Math.cos(loc.coords[0] * (Math.PI / 180)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = 6371 * c;

      if (dist < closest.distanceKm) {
        closest = {
          municipio: m.nombre,
          localidad: loc.nombre,
          coords: loc.coords,
          distanceKm: dist,
        };
      }
    }
  }

  return closest;
}

// Geocodificación inversa para el botón GPS
export async function reverseGeocodeGPS(lat: number, lng: number): Promise<{
  municipio: string;
  localidad: string;
  coords: [number, number];
}> {
  const closest = findClosestLocality(lat, lng);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'es' },
      }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const candidateCity =
        addr.city || addr.town || addr.municipality || addr.county || addr.state_district || '';
      const candidateLoc =
        addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter || addr.village || '';

      if (candidateCity) {
        const normCity = normalizeName(candidateCity);
        const matchedMuni = MUNICIPIOS_DATA.find((m) => {
          const nm = normalizeName(m.nombre);
          return nm === normCity || normCity.includes(nm) || nm.includes(normCity);
        });
        if (matchedMuni) {
          let matchedLoc = matchedMuni.localidades[0];
          if (candidateLoc) {
            const normLoc = normalizeName(candidateLoc);
            const foundL = matchedMuni.localidades.find((l) => {
              const nl = normalizeName(l.nombre);
              return nl === normLoc || normLoc.includes(nl) || nl.includes(normLoc);
            });
            if (foundL) matchedLoc = foundL;
          }
          return {
            municipio: matchedMuni.nombre,
            localidad: matchedLoc.nombre,
            coords: [lat, lng],
          };
        }
      }
    }
  } catch {
    // Fallback silencioso
  }

  return {
    municipio: closest.municipio,
    localidad: closest.localidad,
    coords: [lat, lng],
  };
}

// Extrae la lista de zonas/barrios únicos a partir de los trabajadores registrados
export function extractNeighborhoodsFromWorkers(
  workers: TradeWorker[],
  fallbackNeighborhoods: Neighborhood[] = NEIGHBORHOODS
): Neighborhood[] {
  const mapByName = new Map<string, {
    rawName: string;
    coords: [number, number];
    count: number;
    comuna?: string;
    desc?: string;
  }>();

  for (const worker of workers) {
    const muni = worker.municipio ? toTitleCase(worker.municipio) : '';
    const loc = worker.localidad ? toTitleCase(worker.localidad) : '';

    let displayName = '';
    if (loc && muni && loc.toLowerCase() !== muni.toLowerCase()) {
      displayName = `${loc} (${muni})`;
    } else if (loc) {
      displayName = loc;
    } else if (muni) {
      displayName = muni;
    } else if (worker.zone) {
      displayName = toTitleCase(worker.zone);
    } else {
      displayName = 'Pilar';
    }

    const normKey = normalizeName(displayName);
    const existing = mapByName.get(normKey);

    const workerLat = worker.mapCoords?.lat;
    const workerLng = worker.mapCoords?.lng;

    if (existing) {
      existing.count += 1;
      if (workerLat && workerLng && (!existing.coords || existing.coords[0] === -34.5735)) {
        existing.coords = [workerLat, workerLng];
      }
    } else {
      let coords: [number, number] = [workerLat || -34.4586, workerLng || -58.9142];
      if (!workerLat || !workerLng || (coords[0] === -34.5735 && muni.toLowerCase() !== 'caba')) {
        coords = resolvePreciseCoords(worker.municipio, worker.localidad, worker.address, workers);
      }

      const comuna = worker.municipio
        ? (worker.municipio.toLowerCase().includes('comuna') || worker.municipio.toLowerCase().includes('partido')
            ? worker.municipio
            : `Partido de ${worker.municipio}`)
        : (loc ? `Zona ${loc}` : 'Buenos Aires');

      const desc = loc && muni ? `${loc}, ${muni}` : `${displayName}`;

      mapByName.set(normKey, {
        rawName: displayName,
        coords,
        count: 1,
        comuna,
        desc,
      });
    }
  }

  // Si está vacío, cargar comunas de muestra
  if (mapByName.size === 0) {
    for (const fb of fallbackNeighborhoods) {
      const normKey = normalizeName(fb.name);
      mapByName.set(normKey, {
        rawName: fb.name,
        coords: fb.coords,
        count: 0,
        comuna: fb.comuna,
        desc: fb.description,
      });
    }
  }

  const result: Neighborhood[] = [];
  for (const [normKey, data] of mapByName.entries()) {
    const slug = normKey.replace(/\s+/g, '-').replace(/[()]/g, '');
    result.push({
      id: slug,
      name: data.rawName,
      comuna: data.comuna || 'Municipio',
      fullName: data.comuna ? `${data.rawName} · ${data.comuna}` : data.rawName,
      coords: data.coords,
      description: data.desc || `${data.count} oficios registrados`,
      workerCount: data.count,
      distanceLabel: data.count > 0 ? `${data.count} oficios` : undefined,
    });
  }

  return result.sort((a, b) => {
    const countA = a.workerCount ?? 0;
    const countB = b.workerCount ?? 0;
    if (countB !== countA) return countB - countA;
    return a.name.localeCompare(b.name);
  });
}
