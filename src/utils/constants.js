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

// Real University Subjects based on uploaded PDF cronogramas (UTN 2do Cuatrimestre 2026)
export const DEMO_SUBJECTS = [
  {
    id: 'subj-1',
    name: 'Gestión de Recursos Humanos',
    short_name: 'RRHH',
    color: '#10B981',
    year: 2026,
    semester: 'Segundo',
    status: 'activa'
  },
  {
    id: 'subj-2',
    name: 'Proyecto Final',
    short_name: 'PROYECTO',
    color: '#8B5CF6',
    year: 2026,
    semester: 'Segundo',
    status: 'activa'
  },
  {
    id: 'subj-3',
    name: 'Legislación II – Derecho Público',
    short_name: 'DERECHO II',
    color: '#F97316',
    year: 2026,
    semester: 'Segundo',
    status: 'activa'
  },
  {
    id: 'subj-4',
    name: 'Administración General II Parte B',
    short_name: 'ADMIN II-B',
    color: '#3B82F6',
    year: 2026,
    semester: 'Segundo',
    status: 'activa'
  }
];

export const getInitialDemoActivities = () => {
  return [
    // ----------------------------------------------------
    // MATERIA 1: GESTIÓN DE RECURSOS HUMANOS (RRHH)
    // ----------------------------------------------------
    {
      id: 'rrhh-1',
      subject_id: 'subj-1',
      title: 'AVS U1: Inicio y finalización del vínculo laboral',
      type: 'AVS',
      description: 'Clase sincrónica AVS 18:00 a 19:00 hs.',
      start_date: '2026-08-11',
      due_date: '2026-08-11',
      due_time: '18:00',
      status: 'Finalizada',
      completed_at: '2026-08-11T19:00:00.000Z'
    },
    {
      id: 'rrhh-2',
      subject_id: 'subj-1',
      title: 'Foro U1: Inicio y finalización del vínculo laboral',
      type: 'Foro',
      description: 'Apertura 10/08 h, Cierre 16/08 h.',
      start_date: '2026-08-10',
      due_date: '2026-08-16',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-15T20:00:00.000Z'
    },
    {
      id: 'rrhh-3',
      subject_id: 'subj-1',
      title: 'TP U1: Inicio y finalización del vínculo laboral',
      type: 'Trabajo Práctico',
      description: 'Apertura 13/08 h, Cierre 16/08 h.',
      start_date: '2026-08-13',
      due_date: '2026-08-16',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-16T18:00:00.000Z'
    },
    {
      id: 'rrhh-4',
      subject_id: 'subj-1',
      title: 'Foro U2: Estructuras organizacionales y gestión de personas',
      type: 'Foro',
      description: 'Apertura 17/08 h, Cierre 23/08 h.',
      start_date: '2026-08-17',
      due_date: '2026-08-23',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-22T21:00:00.000Z'
    },
    {
      id: 'rrhh-5',
      subject_id: 'subj-1',
      title: 'TP U2: Estructuras organizacionales y gestión de personas',
      type: 'Trabajo Práctico',
      description: 'Apertura 20/08 h, Cierre 23/08 h.',
      start_date: '2026-08-20',
      due_date: '2026-08-23',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-23T19:00:00.000Z'
    },
    {
      id: 'rrhh-6',
      subject_id: 'subj-1',
      title: 'Foro U3: Bases para una comunicación efectiva',
      type: 'Foro',
      description: 'Apertura 24/08 h, Cierre 30/08 h.',
      start_date: '2026-08-24',
      due_date: '2026-08-30',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-29T22:00:00.000Z'
    },
    {
      id: 'rrhh-7',
      subject_id: 'subj-1',
      title: 'TP U3: Bases para una comunicación efectiva',
      type: 'Trabajo Práctico',
      description: 'Apertura 27/08 h, Cierre 30/08 h.',
      start_date: '2026-08-27',
      due_date: '2026-08-30',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-30T17:00:00.000Z'
    },
    {
      id: 'rrhh-8',
      subject_id: 'subj-1',
      title: 'Foro U4: Gestión del Talento',
      type: 'Foro',
      description: 'Apertura 31/08 h, Cierre 06/09 h.',
      start_date: '2026-08-31',
      due_date: '2026-09-06',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-09-05T20:00:00.000Z'
    },
    {
      id: 'rrhh-9',
      subject_id: 'subj-1',
      title: 'TP U4: Gestión del Talento',
      type: 'Trabajo Práctico',
      description: 'Apertura 03/09 h, Cierre 06/09 h.',
      start_date: '2026-09-03',
      due_date: '2026-09-06',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-09-06T18:00:00.000Z'
    },
    {
      id: 'rrhh-10',
      subject_id: 'subj-1',
      title: 'Foro U5: Estudio del Clima Laboral',
      type: 'Foro',
      description: 'Apertura 07/09 h, Cierre 11/09 h.',
      start_date: '2026-09-07',
      due_date: '2026-09-11',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-09-11T21:00:00.000Z'
    },
    {
      id: 'rrhh-11',
      subject_id: 'subj-1',
      title: 'TP U5: Estudio del Clima Laboral',
      type: 'Trabajo Práctico',
      description: 'Apertura 10/09 h, Cierre 13/09 h.',
      start_date: '2026-09-10',
      due_date: '2026-09-13',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'rrhh-12',
      subject_id: 'subj-1',
      title: 'AVS U6: Aspectos administrativos de la gestión de RRHH',
      type: 'AVS',
      description: 'Clase sincrónica AVS 18:00 a 19:00 hs.',
      start_date: '2026-09-15',
      due_date: '2026-09-15',
      due_time: '18:00',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'rrhh-13',
      subject_id: 'subj-1',
      title: 'Foro U6: Aspectos administrativos de la gestión de RRHH',
      type: 'Foro',
      description: 'Apertura 12/09 h, Cierre 17/09 h.',
      start_date: '2026-09-12',
      due_date: '2026-09-17',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'rrhh-14',
      subject_id: 'subj-1',
      title: 'TP U6: Aspectos administrativos de la gestión de RRHH',
      type: 'Trabajo Práctico',
      description: 'Apertura 14/09 h, Cierre 17/09 h.',
      start_date: '2026-09-14',
      due_date: '2026-09-17',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'rrhh-15',
      subject_id: 'subj-1',
      title: 'Único Parcial: Recursos Humanos (Autocorregido)',
      type: 'Parcial',
      description: 'Desarrollo individual en aula virtual. Disponible 10:00 a 23:59 hs.',
      start_date: '2026-09-15',
      due_date: '2026-09-15',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'rrhh-16',
      subject_id: 'subj-1',
      title: 'Recuperatorio Parcial: Recursos Humanos',
      type: 'Recuperatorio',
      description: 'Desarrollo en aula virtual. Disponible 10:00 a 23:59 hs.',
      start_date: '2026-09-18',
      due_date: '2026-09-18',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'rrhh-17',
      subject_id: 'subj-1',
      title: 'Seminario Obligatorio: Marketing Digital',
      type: 'Seminario',
      description: 'Cursado del seminario del 03/08 al 26/09.',
      start_date: '2026-08-03',
      due_date: '2026-09-26',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },

    // ----------------------------------------------------
    // MATERIA 2: PROYECTO FINAL
    // ----------------------------------------------------
    {
      id: 'proy-1',
      subject_id: 'subj-2',
      title: 'Informe de Avance 1 - Proyecto Final',
      type: 'Avance',
      description: 'Presentación del Seminario. Cierre 16/08 23:59 hs.',
      start_date: '2026-08-10',
      due_date: '2026-08-16',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-16T22:00:00.000Z'
    },
    {
      id: 'proy-2',
      subject_id: 'subj-2',
      title: 'Informe de Avance 2 - Proyecto Final',
      type: 'Avance',
      description: 'Estructura Organizacional. Cierre 23/08 23:59 hs.',
      start_date: '2026-08-17',
      due_date: '2026-08-23',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-23T21:00:00.000Z'
    },
    {
      id: 'proy-3',
      subject_id: 'subj-2',
      title: 'Informe de Avance 3 - Análisis PESTAL',
      type: 'Avance',
      description: 'Cierre 30/08 23:59 hs.',
      start_date: '2026-08-24',
      due_date: '2026-08-30',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-30T20:00:00.000Z'
    },
    {
      id: 'proy-4',
      subject_id: 'subj-2',
      title: 'Informe de Avance 4 - Las 5 fuerzas de Porter',
      type: 'Avance',
      description: 'Cierre 06/09 23:59 hs.',
      start_date: '2026-08-31',
      due_date: '2026-09-06',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-09-06T19:00:00.000Z'
    },
    {
      id: 'proy-5',
      subject_id: 'subj-2',
      title: 'Informe de Avance 5 - Análisis FODA',
      type: 'Avance',
      description: 'Cierre 13/09 23:59 hs.',
      start_date: '2026-09-07',
      due_date: '2026-09-13',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'proy-6',
      subject_id: 'subj-2',
      title: '1er Parcial: Entrega 1ra Parte del Plan Estratégico',
      type: 'Parcial',
      description: 'Entrega del documento del Plan Estratégico. Periodo: 14/09 al 20/09.',
      start_date: '2026-09-14',
      due_date: '2026-09-20',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'proy-7',
      subject_id: 'subj-2',
      title: 'Informe de Avance 6 - Diagnóstico y Pronóstico',
      type: 'Avance',
      description: 'Inicio 14/09, Cierre 20/09 23:59 hs.',
      start_date: '2026-09-14',
      due_date: '2026-09-20',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'proy-8',
      subject_id: 'subj-2',
      title: 'Informe de Avance 7 - Formulación de objetivos estratégicos',
      type: 'Avance',
      description: 'Cierre 27/09 23:59 hs.',
      start_date: '2026-09-21',
      due_date: '2026-09-27',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'proy-9',
      subject_id: 'subj-2',
      title: 'Informe de Avance 8 - Desarrollo de estrategias',
      type: 'Avance',
      description: 'Cierre 04/10 23:59 hs.',
      start_date: '2026-09-29',
      due_date: '2026-10-04',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'proy-10',
      subject_id: 'subj-2',
      title: 'Informe de Avance 9 - Elaboración de acciones',
      type: 'Avance',
      description: 'Cierre 11/10 23:59 hs.',
      start_date: '2026-10-05',
      due_date: '2026-10-11',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'proy-11',
      subject_id: 'subj-2',
      title: 'Informe de Avance 10 - Indicadores clave de gestión',
      type: 'Avance',
      description: 'Cierre 18/10 23:59 hs.',
      start_date: '2026-10-12',
      due_date: '2026-10-18',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'proy-12',
      subject_id: 'subj-2',
      title: '2do Parcial: Entrega 2da Parte del Plan Estratégico',
      type: 'Parcial',
      description: 'Periodo: 26/10 al 01/11.',
      start_date: '2026-10-26',
      due_date: '2026-11-01',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },

    // ----------------------------------------------------
    // MATERIA 3: LEGISLACIÓN II – DERECHO PÚBLICO
    // ----------------------------------------------------
    {
      id: 'leg-1',
      subject_id: 'subj-3',
      title: 'Cuestionario U2: Concepto de Derecho Administrativo',
      type: 'Cuestionario',
      description: 'Disponible del 10/08 al 12/08.',
      start_date: '2026-08-10',
      due_date: '2026-08-12',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-12T18:00:00.000Z'
    },
    {
      id: 'leg-2',
      subject_id: 'subj-3',
      title: 'Cuestionario U3: Funciones administrativas',
      type: 'Cuestionario',
      description: 'Disponible del 17/08 al 19/08.',
      start_date: '2026-08-17',
      due_date: '2026-08-19',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-19T20:00:00.000Z'
    },
    {
      id: 'leg-3',
      subject_id: 'subj-3',
      title: 'Cuestionario U4: El Acto Administrativo',
      type: 'Cuestionario',
      description: 'Disponible del 24/08 al 26/08.',
      start_date: '2026-08-24',
      due_date: '2026-08-26',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-26T19:00:00.000Z'
    },
    {
      id: 'leg-4',
      subject_id: 'subj-3',
      title: 'Cuestionario U5: Hecho administrativo y Contrato',
      type: 'Cuestionario',
      description: 'Disponible del 30/08 al 02/09.',
      start_date: '2026-08-30',
      due_date: '2026-09-02',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-09-02T21:00:00.000Z'
    },
    {
      id: 'leg-5',
      subject_id: 'subj-3',
      title: 'Cuestionario U6: Las Competencias Estatales',
      type: 'Cuestionario',
      description: 'Disponible del 07/09 al 09/09.',
      start_date: '2026-09-07',
      due_date: '2026-09-09',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-09-09T18:00:00.000Z'
    },
    {
      id: 'leg-6',
      subject_id: 'subj-3',
      title: 'Primer y único Parcial: Legislación II (U1 a U6)',
      type: 'Parcial',
      description: 'Cuestionario Opción Múltiple / Verdadero Falso.',
      start_date: '2026-09-11',
      due_date: '2026-09-11',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-09-11T20:00:00.000Z'
    },
    {
      id: 'leg-7',
      subject_id: 'subj-3',
      title: 'Cuestionario U7: El Control de la Administración Pública',
      type: 'Cuestionario',
      description: 'Disponible del 14/09 al 16/09.',
      start_date: '2026-09-14',
      due_date: '2026-09-16',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'leg-8',
      subject_id: 'subj-3',
      title: 'Recuperatorio Parcial: Legislación II (Incluye U7)',
      type: 'Recuperatorio',
      description: 'Examen de recuperatorio.',
      start_date: '2026-09-17',
      due_date: '2026-09-17',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'leg-9',
      subject_id: 'subj-3',
      title: 'Seminario Obligatorio: Planificación y Control de la Producción',
      type: 'Seminario',
      description: 'Del 03/08 al 05/09.',
      start_date: '2026-08-03',
      due_date: '2026-09-05',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-09-05T18:00:00.000Z'
    },

    // ----------------------------------------------------
    // MATERIA 4: ADMINISTRACIÓN GENERAL II PARTE B
    // ----------------------------------------------------
    {
      id: 'adm-1',
      subject_id: 'subj-4',
      title: 'Foro U5-4: Actividad Integradora Unidades 5.1 a 5.4',
      type: 'Foro',
      description: 'Del 16/08 al 30/08 23:59 hs.',
      start_date: '2026-08-16',
      due_date: '2026-08-30',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-08-29T19:00:00.000Z'
    },
    {
      id: 'adm-2',
      subject_id: 'subj-4',
      title: 'Examen Parcial 1: Administración II (Hasta U6-2)',
      type: 'Parcial',
      description: 'Cuestionario múltiple choice con corrección automática.',
      start_date: '2026-09-09',
      due_date: '2026-09-09',
      due_time: '23:59',
      status: 'Finalizada',
      completed_at: '2026-09-09T22:00:00.000Z'
    },
    {
      id: 'adm-3',
      subject_id: 'subj-4',
      title: 'Foro U6-2: Trabajo en línea y por células. Layout',
      type: 'Foro',
      description: 'Del 31/08 al 13/09 23:59 hs.',
      start_date: '2026-08-31',
      due_date: '2026-09-13',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'adm-4',
      subject_id: 'subj-4',
      title: 'Recuperatorio 1er Parcial: Administración II',
      type: 'Recuperatorio',
      description: 'Hasta Unidad 6-3 inclusive.',
      start_date: '2026-09-16',
      due_date: '2026-09-16',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'adm-5',
      subject_id: 'subj-4',
      title: 'Foro U6-4: Carga de trabajo física y mental. Fatiga',
      type: 'Foro',
      description: 'Del 13/09 al 27/09 23:59 hs.',
      start_date: '2026-09-13',
      due_date: '2026-09-27',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'adm-6',
      subject_id: 'subj-4',
      title: 'Foro U7-2: Ingeniería de Proceso y de Planta',
      type: 'Foro',
      description: 'Del 28/09 al 11/10 23:59 hs.',
      start_date: '2026-09-28',
      due_date: '2026-10-11',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'adm-7',
      subject_id: 'subj-4',
      title: 'TP Grupal: Estructura y Liderazgo en Acción',
      type: 'Trabajo Práctico',
      description: 'Creación y Diagnóstico Organizacional. Entrega Viernes 16/10.',
      start_date: '2026-09-20',
      due_date: '2026-10-16',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    },
    {
      id: 'adm-8',
      subject_id: 'subj-4',
      title: 'Examen Parcial 2: Administración II (Hasta U8-2)',
      type: 'Parcial',
      description: 'Cuestionario múltiple choice con corrección automática.',
      start_date: '2026-11-04',
      due_date: '2026-11-04',
      due_time: '23:59',
      status: 'Pendiente',
      completed_at: null
    }
  ];
};
