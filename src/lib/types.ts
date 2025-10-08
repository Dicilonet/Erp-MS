
'use client';

import type { FC, ReactNode } from 'react';
import type { Timestamp } from 'firebase/firestore';


// --- Tipos para Navegación ---
export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

// --- Tipos para Artículos (Productos y Servicios) ---
export interface Article {
  articleId: string;
  articleNumber: string;
  name: string;
  description?: string;
  type: 'product' | 'service';
  unit: string;
  priceNet: number;
  taxRate: number; // Stored as a percentage, e.g., 19 for 19%
  priceGross: number; // Calculated: priceNet * (1 + taxRate / 100)
  createdAt: string; // ISO String
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}


// --- Tipos para To-Do List ---
export interface Todo {
  id: string;
  title?: string;
  text: string;
  priority: 'importante' | 'media' | 'idea';
  completed: boolean;
  createdAt: any; // Firestore Timestamp
}

// --- Tipos para Gestión de Clientes ---

export type CustomerPlanId =
  | 'plan_privatkunde'
  | 'plan_spender'
  | 'plan_einzelhandler'
  | 'plan_premium';
export type CustomerStatus = 'activo' | 'inactivo' | 'pendiente' | 'prospecto' | 'sin interés';
export type PaymentCycle = 'mensual' | 'semestral' | 'anual';
export type CountryCode = 'ES' | 'DE' | 'GB' | 'US' | 'OTHER';

export interface Customer {
  customerId: string;
  // --- Info Principal (Existente + Nuevo) ---
  name: string;
  contactEmail: string;
  category: string;
  description: string;

  // --- Plan y Facturación (Existente) ---
  planId: CustomerPlanId;
  paymentCycle: PaymentCycle;
  hasPromoPrice: boolean;
  country: CountryCode;

  // --- Ubicación (Nuevo) ---
  location: string;
  fullAddress: string;
  coordinates: { latitude: number; longitude: number };

  // --- Contacto y Enlaces (Nuevo) ---
  phone: string;
  website: string;
  currentOfferUrl: string;
  logoUrl: string;

  // --- Metadatos (Existente + Nuevo) ---
  diciloSearchId?: string; // Opcional
  imageHint: string;
  rating: number;
  status: CustomerStatus;
  registrationDate: string; // ISO String
  accountManager: {
    userId: string;
    userName: string;
    userEmail: string;
  };

  // --- Nuevos campos para Landing Pages ---
  assignedLandingPage?: string; // ID de la plantilla de landing page
  landingPageSubdomain?: string; // Subdominio asignado

  // --- Consumo de Servicios (Marketing) ---
  serviceUsage?: {
    [key: string]: { used: number; limit: number };
  };
}

export type ServiceStatus =
  | 'Pendiente'
  | 'En Progreso'
  | 'Completado'
  | 'Agendado'
  | 'Activo';
export type ServiceFrequency =
  | 'único'
  | 'mensual'
  | 'anual'
  | 'recurrente'
  | 'bajo demanda'
  | 'constante'
  | string;

export interface CustomerService {
  serviceId: string;
  serviceName: string;
  status: ServiceStatus;
  frequency: ServiceFrequency;
  nextDueDate?: string | null; // ISO String
  details: {
    notes?: string;
    limit?: number;
    registeredCount?: number;
    categoryLimit?: number;
    categoriesUsed?: number;
    postsCount?: number;
    postsThisMonth?: number;
    channelLimit?: number;
    channels?: string[];
    type?: string;
    url?: string;
    schedule?: { date: string; status: ServiceStatus }[];
  };
}

// --- Tipos para Programas / Herramientas / Catálogo de Servicios ---
export interface Program {
  programId: string;
  name: string;
  description: string;
  url: string;
  logo: string;
  category: string;
  apiKey?: string;
}

// --- Tipos para Conexiones ---
export type ConnectionStatus = 'Conectado' | 'Desconectado' | 'Error';
export type ConnectionType = 'Google Drive' | 'Airtable' | 'IMAP' | 'Otro';

export interface Connection {
  connectionId: string;
  name: ConnectionType;
  description: string;
  user: string;
  status: ConnectionStatus;
}

// --- Tipos para Interacciones con Cliente ---
export type InteractionType = 'Llamada' | 'Email' | 'Reunión' | 'Otro' | 'Oferta';

export interface Interaction {
  interactionId: string;
  customerId: string;
  date: string; // ISO String
  type: InteractionType;
  summary: string;
  fullText?: string; // El texto completo antes de resumir
  createdBy: string; // User ID
}

// --- Tipos para Email ---
export interface Email {
  uid: number;
  subject: string;
  from: string;
  date: string; // ISO String
  body: string;
  isRead: boolean;
}

// --- Tipos para Sistema de Tickets ---
export type TicketStatus = 'Abierto' | 'En Progreso' | 'Resuelto' | 'Cerrado';
export type TicketPriority = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export interface Ticket {
  ticketId: string;
  customerId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo: string; // Puede ser un ID de usuario o un nombre de equipo
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  audioUrl?: string; // URL al audio en Firebase Storage
  history: TicketHistoryEntry[];
}

export interface TicketHistoryEntry {
  timestamp: string; // ISO String
  user: string; // ID o nombre del usuario/sistema que hizo el cambio
  action: string; // Descripción del cambio, ej: "Cambió estado a 'Resuelto'"
  comment?: string; // Comentario opcional
}

// --- Tipos para Gastos ---
export interface Expense {
  expenseId: string;
  customerId?: string;
  customerName?: string;
  description: string;
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  category: string;
  date: string; // ISO String
  recordedBy: string; // User ID
  receiptUrl?: string; // URL a la imagen de la factura en Firebase Storage
}

// --- Tipos para Ofertas/Presupuestos ---
export type OfferStatus =
  | 'Borrador'
  | 'Enviada'
  | 'Visto'
  | 'Aceptada'
  | 'Rechazada'
  | 'Vencida';

export interface OfferItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  unit: string;
  discount: number;
  taxRate: number;
  total: number;
}

export interface Offer {
  offerId: string;
  offerNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string; // ISO String
  expiryDate: string; // ISO String
  status: OfferStatus;
  documentTitle: string;
  introductoryText?: string;
  items: OfferItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

// --- Tipos para Usuarios Internos / Miembros del Equipo ---
export type UserRole = 'superadmin' | 'colaborador' | 'teamoffice';

export interface UserProfile {
  fullName: string;
  country: string;
  whatsapp: string;
  photoUrl?: string;
  memberSince: string; // ISO String
  preferredLanguage?: 'es' | 'en' | 'de';
}

export interface InternalUser {
  uid: string; // El ID de Firebase Authentication
  companyId: string; // Nuevo campo para multi-tenancy
  email: string;
  role: UserRole;
  profile: UserProfile;
  accessibleModules: string[];
}

// --- Tipos para Gestión de Proyectos ---
export type ProjectType = 'Pagina Web' | 'Desarrollo de Software' | 'Automatización' | 'Gestión de Clientes Dicilo' | 'Marketing Digital' | 'Otro';
export type TaskStatus = 'Pendiente' | 'En Progreso' | 'Completado' | 'Bloqueado';
export type TaskPriority = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export interface ProjectPhase {
    id: string;
    name: string;
    notes?: string;
}

export interface Project {
  projectId: string;
  projectName: string;
  projectType: ProjectType;
  clientName: string;
  customerId?: string | null;
  status: 'Planificación' | 'En Progreso' | 'Completado' | 'Pausado';
  startDate: string; // ISO String
  endDate: string; // ISO String
  budget?: number;
  assignedTeam: string[]; // Array de UIDs de colaboradores
  projectOwner: string; // UID del responsable
  phases: ProjectPhase[]; // Fases del proyecto
}

export interface Task {
  taskId: string;
  projectId: string;
  phaseId: string; // ID de la fase a la que pertenece
  taskName: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string; // UID de un colaborador
  dueDate: string; // ISO String
  createdAt: string; // ISO String
  createdBy: string; // UID
}

// --- Tipos para Marketing ---
export type AssetType = 'social_post' | 'campaign_template';

export interface ContentAsset {
  assetId: string;
  assetType: AssetType;
  name: string;
  tags: string[];
  brands: string[];
  content: {
    text: string;
    imageUrl?: string;
  };
  channels: string[];
  createdAt: string; // ISO String
  createdBy: string; // User ID
}


export interface MarketingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  customerId: string;
  assetId: string;
  projectId: string;
  status: 'programado' | 'publicado' | 'error';
  finalContent: {
      text: string;
      imageUrl?: string;
  }
}

// --- Tipos para Campañas ---
export interface Campaign {
  source: 'Dicilo' | 'Externa';
  tasks: {
    done: string[];
    todo: string[];
    nextSteps: string[];
  }
}

// --- Tipos para Chat ---
export type ConversationStatus = 'abierta' | 'en proceso' | 'cerrada';

export interface Conversation {
  id: string;
  participants: { uid: string; name: string; photoUrl?: string }[];
  participantUids: string[];
  lastMessage: {
    text: string;
    timestamp: Timestamp;
  };
  status: ConversationStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Timestamp;
}

// --- Tipos para Cupones ---
export type CouponStatus = 'active' | 'redeemed' | 'expired';

export interface Coupon {
  id: string;
  code: string;
  month_key: string;
  title: string;
  subtitle: string;
  value_text: string;
  bg_image_url?: string | null;
  terms?: string | null;
  expires_at?: string | null;
  status: CouponStatus;
  created_by: string | null;
  created_at: string;
  redeemed_at?: string | null;
  redeemer_name?: string | null;
  redeemer_contact?: string | null;
  redeemer_channel?: 'whatsapp' | 'email' | 'telegram' | null;
  isIndividual?: boolean;
  senderName?: string;
  recipientName?: string;
}
