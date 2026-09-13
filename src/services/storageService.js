import { supabase } from './supabaseClient';
import { DEMO_SUBJECTS, getInitialDemoActivities } from '../utils/constants';

const SUBJECTS_KEY = 'agenda_academica_v2_subjects';
const ACTIVITIES_KEY = 'agenda_academica_v2_activities';
const PREFS_KEY = 'agenda_academica_v2_preferences';

// Helper for LocalStorage
const getLocal = (key, defaultData) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultData;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultData;
  }
};

const setLocal = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

export const migrateLocalDataToCloud = async (user) => {
  if (!supabase || !user) throw new Error('Iniciá sesión para migrar tus datos.');

  const migrationKey = `agenda_academica_cloud_migration_${user.id}`;
  if (localStorage.getItem(migrationKey)) return { subjects: 0, activities: 0, skipped: true };
  // Se establece antes de la primera llamada async para evitar duplicados en React StrictMode.
  localStorage.setItem(migrationKey, 'in-progress');

  const subjects = getLocal(SUBJECTS_KEY, []);
  const activities = getLocal(ACTIVITIES_KEY, []);
  const preferences = getLocal(PREFS_KEY, null);
  if (!subjects.length && !activities.length) return { subjects: 0, activities: 0 };

  // El respaldo local usa IDs de texto; Supabase usa UUID. Este mapa conserva
  // correctamente la relación de cada actividad con su materia al migrar.
  const subjectIdMap = new Map(subjects.map((subject) => [subject.id, crypto.randomUUID()]));
  const subjectRows = subjects.map(({ id, user_id, ...subject }) => ({
    ...subject,
    id: subjectIdMap.get(id),
    user_id: user.id
  }));
  const activityRows = activities.map(({ id, subject_id, user_id, ...activity }) => ({
    ...activity,
    id: crypto.randomUUID(),
    subject_id: subjectIdMap.get(subject_id),
    user_id: user.id,
    updated_at: activity.updated_at || new Date().toISOString()
  }));

  if (activityRows.some((activity) => !activity.subject_id)) {
    throw new Error('Hay actividades sin una materia válida; se canceló la migración.');
  }

  const { error: subjectsError } = await supabase.from('subjects').insert(subjectRows);
  if (subjectsError) throw subjectsError;

  const { error: activitiesError } = await supabase.from('activities').insert(activityRows);
  if (activitiesError) throw activitiesError;

  if (preferences) {
    const { error: preferencesError } = await supabase.from('notification_preferences').upsert({
      ...preferences,
      user_id: user.id,
      updated_at: new Date().toISOString()
    });
    if (preferencesError) throw preferencesError;
  }

  localStorage.setItem(migrationKey, 'completed');
  return { subjects: subjectRows.length, activities: activityRows.length };
};

export const storageService = {
  // --- SUBJECTS ---
  async getSubjects(user = null) {
    if (supabase && user) {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getSubjects error:', error);
        throw error;
      }
      return data || [];
    }

    // No se exponen datos sin una sesión autenticada.
    return [];
  },

  async createSubject(subject, user = null) {
    const newSubject = {
      ...subject,
      id: subject.id || (supabase ? undefined : `subj-${Date.now()}`),
      user_id: user ? user.id : 'local-user',
      created_at: new Date().toISOString()
    };

    if (supabase && user) {
      const { data, error } = await supabase
        .from('subjects')
        .insert([newSubject])
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Local Fallback
    const list = getLocal(SUBJECTS_KEY, DEMO_SUBJECTS);
    const updated = [newSubject, ...list];
    setLocal(SUBJECTS_KEY, updated);
    return newSubject;
  },

  async updateSubject(subject, user = null) {
    if (supabase && user) {
      const { data, error } = await supabase
        .from('subjects')
        .update(subject)
        .eq('id', subject.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Local Fallback
    const list = getLocal(SUBJECTS_KEY, DEMO_SUBJECTS);
    const updated = list.map((s) => (s.id === subject.id ? { ...s, ...subject } : s));
    setLocal(SUBJECTS_KEY, updated);
    return subject;
  },

  async deleteSubject(subjectId, user = null) {
    if (supabase && user) {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) throw error;
      return true;
    }

    // Local Fallback
    const list = getLocal(SUBJECTS_KEY, DEMO_SUBJECTS);
    const updated = list.filter((s) => s.id !== subjectId);
    setLocal(SUBJECTS_KEY, updated);

    // Also remove associated activities locally
    const actList = getLocal(ACTIVITIES_KEY, getInitialDemoActivities());
    setLocal(ACTIVITIES_KEY, actList.filter((a) => a.subject_id !== subjectId));
    return true;
  },

  // --- ACTIVITIES ---
  async getActivities(user = null) {
    if (supabase && user) {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Supabase getActivities error:', error);
        throw error;
      }
      return data || [];
    }

    // No se exponen datos sin una sesión autenticada.
    return [];
  },

  async createActivity(activity, user = null) {
    const newActivity = {
      ...activity,
      id: activity.id || (supabase ? undefined : `act-${Date.now()}`),
      user_id: user ? user.id : 'local-user',
      status: activity.status || 'Pendiente',
      completed_at: activity.status === 'Finalizada' ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase && user) {
      const { data, error } = await supabase
        .from('activities')
        .insert([newActivity])
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Local Fallback
    const list = getLocal(ACTIVITIES_KEY, getInitialDemoActivities());
    const updated = [newActivity, ...list];
    setLocal(ACTIVITIES_KEY, updated);
    return newActivity;
  },

  async updateActivity(activity, user = null) {
    const updatedPayload = {
      ...activity,
      updated_at: new Date().toISOString()
    };

    if (supabase && user) {
      const { data, error } = await supabase
        .from('activities')
        .update(updatedPayload)
        .eq('id', activity.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Local Fallback
    const list = getLocal(ACTIVITIES_KEY, getInitialDemoActivities());
    const updated = list.map((a) => (a.id === activity.id ? { ...a, ...updatedPayload } : a));
    setLocal(ACTIVITIES_KEY, updated);
    return updatedPayload;
  },

  async toggleComplete(activityId, user = null) {
    let currentActivities = [];
    if (supabase && user) {
      const { data: current } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single();

      if (!current) return null;
      const isDone = current.status === 'Finalizada';
      const updatedStatus = isDone ? 'Pendiente' : 'Finalizada';
      const completedAt = isDone ? null : new Date().toISOString();

      const { data, error } = await supabase
        .from('activities')
        .update({
          status: updatedStatus,
          completed_at: completedAt,
          updated_at: new Date().toISOString()
        })
        .eq('id', activityId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Local Fallback
    const list = getLocal(ACTIVITIES_KEY, getInitialDemoActivities());
    let target = null;
    const updated = list.map((a) => {
      if (a.id === activityId) {
        const isDone = a.status === 'Finalizada';
        target = {
          ...a,
          status: isDone ? 'Pendiente' : 'Finalizada',
          completed_at: isDone ? null : new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return target;
      }
      return a;
    });
    setLocal(ACTIVITIES_KEY, updated);
    return target;
  },

  async deleteActivity(activityId, user = null) {
    if (supabase && user) {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;
      return true;
    }

    // Local Fallback
    const list = getLocal(ACTIVITIES_KEY, getInitialDemoActivities());
    const updated = list.filter((a) => a.id !== activityId);
    setLocal(ACTIVITIES_KEY, updated);
    return true;
  },

  // --- PREFERENCES ---
  async getPreferences(user = null) {
    const defaultPrefs = {
      days_before: [3, 1, 0],
      notifications_enabled: true,
      campus_url: 'https://tua.sied.utn.edu.ar/my/index.php'
    };

    if (supabase && user) {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) console.error('Error fetching prefs:', error);
      return data || defaultPrefs;
    }

    return getLocal(PREFS_KEY, defaultPrefs);
  },

  async savePreferences(preferences, user = null) {
    if (supabase && user) {
      const payload = {
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString()
      };
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    setLocal(PREFS_KEY, preferences);
    return preferences;
  }
};
