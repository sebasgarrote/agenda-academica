export const ACTIVITY_TYPES = [
  'Foro',
  'Trabajo Práctico',
  'Cuestionario',
  'AVS',
  'Parcial',
  'Recuperatorio',
  'Seminario',
  'Avance',
  'Otro'
];

export const ACTIVITY_STATUSES = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Finalizada'
};

export const SUBJECT_STATUSES = {
  ACTIVE: 'activa',
  FINISHED: 'finalizada'
};

export const URGENCY_LEVELS = {
  COMPLETED: { id: 'COMPLETADA', label: 'Completada', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  OVERDUE: { id: 'VENCIDA', label: 'Vencida', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
  URGENT: { id: 'URGENTE', label: 'Urgente', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  PROXIMA: { id: 'PRÓXIMA', label: 'Próxima', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  NORMAL: { id: 'NORMAL', label: 'Normal', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)' }
};

export const PRESET_COLORS = [
  { name: 'Esmeralda', hex: '#10B981' },
  { name: 'Azul Real', hex: '#3B82F6' },
  { name: 'Violeta', hex: '#8B5CF6' },
  { name: 'Fucsia', hex: '#EC4899' },
  { name: 'Naranja Calidez', hex: '#F97316' },
  { name: 'Rojo Carmesí', hex: '#EF4444' },
  { name: 'Turquesa', hex: '#14B8A6' },
  { name: 'Índigo', hex: '#6366F1' },
  { name: 'Ámbar', hex: '#D97706' },
  { name: 'Gris Grafito', hex: '#64748B' }
];

export const SEMESTERS = ['Primer', 'Segundo', 'Anual', 'Verano'];

// No hay datos académicos preinstalados. Cada cuenta comienza vacía.
export const DEMO_SUBJECTS = [];
export const getInitialDemoActivities = () => [];
