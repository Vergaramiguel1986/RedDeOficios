export type CategoryType =
  | 'todos'
  | 'plomeria'
  | 'electricidad'
  | 'carpinteria'
  | 'pintura'
  | 'jardineria'
  | 'cerrajeria'
  | 'albanileria'
  | 'climatizacion'
  | 'electrodomesticos'
  | 'herreria'
  | 'persianas'
  | 'tapiceria'
  | 'vidrieria';

export interface Neighborhood {
  id: string;
  name: string;
  comuna: string;
  fullName: string;
  coords: [number, number];
  description: string;
  distanceLabel?: string;
  workerCount?: number;
}

export interface Review {
  id: string;
  author: string;
  neighborhood: string;
  date: string;
  rating: number;
  comment: string;
  workDone: string;
}

export interface SampleWork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  beforeImageUrl?: string;
  date?: string;
  location?: string;
  category: CategoryType;
  workerId: string;
  workerName: string;
  workerTrade: string;
  workerAvatar: string;
  whatsappNumber: string;
  rating?: number;
  reviewComment?: string;
  neighborName?: string;
}

export interface TradeWorker {
  id: string;
  name: string;
  tradeTitle: string;
  category: CategoryType;
  verified: boolean;
  urgent24h?: boolean;
  rating: number;
  reviewsCount: number;
  distanceMeters: number;
  distanceKm: number;
  address: string;
  zone?: string;
  estimatedArrival?: string;
  copimeVerified?: boolean;
  bio: string;
  conditionOfWork: string;
  whatsappNumber: string;
  avatarUrl: string;
  avatarAlt: string;
  mapCoords: {
    x: number;
    y: number;
    lat?: number;
    lng?: number;
    walkingTime?: string;
  };
  specialties: string[];
  reviews: Review[];
  sampleWorks?: SampleWork[];
  whatsapp?: string;
  location?: string;
  municipio?: string;
  localidad?: string;
  description?: string;
  avatar?: string;
  experienceYears?: number;
  featuredWorks?: any[];
}

export interface WhatsAppNotification {
  id: string;
  title: string;
  distance: string;
  description: string;
  time: string;
  zone: string;
  category: CategoryType;
  responded?: boolean;
  userProposalSent?: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  category: CategoryType;
  description: string;
  urgency: 'normal' | 'hoy' | 'urgente24h';
  location: string;
  municipio?: string;
  localidad?: string;
  budgetEstimated: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  status: 'abierto' | 'postulado' | 'resuelto';
}
