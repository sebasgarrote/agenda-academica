import { useState, useEffect, useCallback, useMemo } from 'react';
import { storageService, migrateLocalDataToCloud } from '../services/storageService';
import { getCloudSyncStatus } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { getUrgencyInfo, getDaysDifferenceFromToday } from '../utils/dateUtils';

export const useAgendaData = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [preferences, setPreferences] = useState({ days_before: [3, 1, 0], notifications_enabled: true });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterSubjectId, setFilterSubjectId] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, COMPLETED, OVERDUE
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all initial data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let [subData, actData, prefData] = await Promise.all([
        storageService.getSubjects(user),
        storageService.getActivities(user),
        storageService.getPreferences(user)
      ]);

      // Primera conexión: subir el respaldo local al espacio privado del usuario.
      if (user && getCloudSyncStatus().isConfigured && subData.length === 0) {
        const localSubjects = JSON.parse(localStorage.getItem('agenda_academica_v2_subjects') || '[]');
        if (localSubjects.length > 0) {
          await migrateLocalDataToCloud(user);
          [subData, actData, prefData] = await Promise.all([
            storageService.getSubjects(user),
            storageService.getActivities(user),
            storageService.getPreferences(user)
          ]);
        }
      }
      setSubjects(subData || []);
      setActivities(actData || []);
      setPreferences(prefData || { days_before: [3, 1, 0], notifications_enabled: true });
    } catch (err) {
      console.error('Error loading agenda data:', err);
      setError('No se pudieron cargar los datos de la agenda.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Subject lookup map for quick access
  const subjectMap = useMemo(() => {
    const map = {};
    subjects.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [subjects]);

  // Enrich activities with subject metadata & urgency info
  const enrichedActivities = useMemo(() => {
    return activities.map((act) => {
      const subject = subjectMap[act.subject_id] || {
        name: 'Materia Eliminada',
        short_name: '---',
        color: '#6B7280'
      };
      const urgency = getUrgencyInfo(act);
      return {
        ...act,
        subject,
        urgency
      };
    });
  }, [activities, subjectMap]);

  // Dashboard Metrics
  const stats = useMemo(() => {
    let pendingCount = 0;
    let upcomingCount = 0;
    let overdueCount = 0;
    let completedCount = 0;

    let nextDueDateActivity = null;
    let minDays = 9999;

    enrichedActivities.forEach((act) => {
      if (act.status === 'Finalizada') {
        completedCount++;
      } else {
        pendingCount++;
        const days = act.urgency.daysDiff;
        if (days < 0) {
          overdueCount++;
        } else if (days <= 3) {
          upcomingCount++;
        }

        if (days >= 0 && days < minDays) {
          minDays = days;
          nextDueDateActivity = act;
        }
      }
    });

    return {
      pending: pendingCount,
      upcoming: upcomingCount,
      overdue: overdueCount,
      completed: completedCount,
      nextDueDateActivity
    };
  }, [enrichedActivities]);

  // "Esta semana" Prioritized view logic
  const weeklyActivities = useMemo(() => {
    // Only include pending activities due in <= 7 days or overdue, plus recent items
    const pendingWeek = enrichedActivities.filter((act) => {
      if (act.status === 'Finalizada') return false;
      const days = act.urgency.daysDiff;
      return days <= 7; // includes overdue (days < 0) and next 7 days
    });

    // Priority sorting:
    // 1. Overdue (days < 0)
    // 2. Due today (days === 0)
    // 3. Due tomorrow (days === 1)
    // 4. Upcoming (days 2..3)
    // 5. Rest of week
    return pendingWeek.sort((a, b) => {
      return a.urgency.daysDiff - b.urgency.daysDiff;
    });
  }, [enrichedActivities]);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    const list = enrichedActivities.filter((act) => {
      // Subject filter
      if (filterSubjectId !== 'ALL' && act.subject_id !== filterSubjectId) {
        return false;
      }
      // Type filter
      if (filterType !== 'ALL' && act.type !== filterType) {
        return false;
      }
      // Status filter
      if (filterStatus === 'PENDING' && act.status === 'Finalizada') return false;
      if (filterStatus === 'COMPLETED' && act.status !== 'Finalizada') return false;
      if (filterStatus === 'OVERDUE' && (act.status === 'Finalizada' || act.urgency.daysDiff >= 0)) return false;
      if (filterStatus === 'UPCOMING' && (act.status === 'Finalizada' || act.urgency.daysDiff < 0 || act.urgency.daysDiff > 3)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = act.title.toLowerCase().includes(q);
        const descMatch = (act.description || '').toLowerCase().includes(q);
        const subjMatch = act.subject.name.toLowerCase().includes(q) || act.subject.short_name.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !subjMatch) return false;
      }

      return true;
    });

    // Sort chronologically by due date & urgency
    return list.sort((a, b) => a.urgency.daysDiff - b.urgency.daysDiff);
  }, [enrichedActivities, filterSubjectId, filterType, filterStatus, searchQuery]);

  // Active Alerts for In-App Notifications (Only Pending Tasks)
  const alerts = useMemo(() => {
    if (!preferences.notifications_enabled) return [];

    const notifyDays = preferences.days_before || [3, 1, 0];

    return enrichedActivities
      .filter((act) => {
        if (act.status === 'Finalizada') return false;
        const diff = act.urgency.daysDiff;
        // Overdue or matching notification threshold days
        return diff < 0 || notifyDays.includes(diff);
      })
      .sort((a, b) => a.urgency.daysDiff - b.urgency.daysDiff);
  }, [enrichedActivities, preferences]);

  // Actions
  const toggleComplete = async (activityId) => {
    try {
      const updated = await storageService.toggleComplete(activityId, user);
      if (updated) {
        setActivities((prev) =>
          prev.map((a) => (a.id === activityId ? updated : a))
        );
      }
    } catch (err) {
      console.error('Error toggling complete:', err);
    }
  };

  const handleCreateActivity = async (payload) => {
    try {
      const created = await storageService.createActivity(payload, user);
      setActivities((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Error creating activity:', err);
      throw err;
    }
  };

  const handleUpdateActivity = async (payload) => {
    try {
      const updated = await storageService.updateActivity(payload, user);
      setActivities((prev) =>
        prev.map((a) => (a.id === payload.id ? updated : a))
      );
      return updated;
    } catch (err) {
      console.error('Error updating activity:', err);
      throw err;
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await storageService.deleteActivity(activityId, user);
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  const handleCreateSubject = async (payload) => {
    try {
      const created = await storageService.createSubject(payload, user);
      setSubjects((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Error creating subject:', err);
      throw err;
    }
  };

  const handleUpdateSubject = async (payload) => {
    try {
      const updated = await storageService.updateSubject(payload, user);
      setSubjects((prev) =>
        prev.map((s) => (s.id === payload.id ? updated : s))
      );
      return updated;
    } catch (err) {
      console.error('Error updating subject:', err);
      throw err;
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      await storageService.deleteSubject(subjectId, user);
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
      setActivities((prev) => prev.filter((a) => a.subject_id !== subjectId));
    } catch (err) {
      console.error('Error deleting subject:', err);
    }
  };

  const handleSavePreferences = async (newPrefs) => {
    try {
      const saved = await storageService.savePreferences(newPrefs, user);
      setPreferences(saved);
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  };

  return {
    subjects,
    activities: enrichedActivities,
    filteredActivities,
    weeklyActivities,
    stats,
    alerts,
    preferences,
    isLoading,
    error,
    filters: {
      subjectId: filterSubjectId,
      setSubjectId: setFilterSubjectId,
      type: filterType,
      setType: setFilterType,
      status: filterStatus,
      setStatus: setFilterStatus,
      searchQuery,
      setSearchQuery
    },
    actions: {
      toggleComplete,
      createActivity: handleCreateActivity,
      updateActivity: handleUpdateActivity,
      deleteActivity: handleDeleteActivity,
      createSubject: handleCreateSubject,
      updateSubject: handleUpdateSubject,
      deleteSubject: handleDeleteSubject,
      savePreferences: handleSavePreferences,
      refresh: fetchData
    }
  };
};
