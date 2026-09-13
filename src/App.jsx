import React, { useEffect, useState } from 'react';
import { LockKeyhole, GraduationCap } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useAgendaData } from './hooks/useAgendaData';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import StatsOverview from './components/dashboard/StatsOverview';
import WeeklyView from './components/dashboard/WeeklyView';
import CalendarView from './components/calendar/CalendarView';
import UpcomingView from './components/upcoming/UpcomingView';
import SubjectManager from './components/subjects/SubjectManager';
import AlertsCenter from './components/notifications/AlertsCenter';
import ActivityModal from './components/modals/ActivityModal';
import SubjectModal from './components/modals/SubjectModal';
import AuthModal from './components/modals/AuthModal';
import './App.css';

const App = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal States
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [defaultActivityDate, setDefaultActivityDate] = useState(null);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [localBackupCounts, setLocalBackupCounts] = useState(null);

  const handleClearLocalBackup = () => {
    if (!localBackupCounts) return;
    const message = 'Eliminar la copia local de ' + localBackupCounts.subjects + ' materias y ' + localBackupCounts.activities + ' actividades? Los datos en Supabase no se modificarán.';
    if (!window.confirm(message)) return;
    localStorage.removeItem('agenda_academica_v2_subjects');
    localStorage.removeItem('agenda_academica_v2_activities');
    localStorage.removeItem('agenda_academica_v2_preferences');
    setLocalBackupCounts(null);
  };

  const {
    subjects,
    activities,
    filteredActivities,
    weeklyActivities,
    stats,
    alerts,
    preferences,
    isLoading,
    filters,
    actions
  } = useAgendaData();

  useEffect(() => {
    if (!user) return;
    try {
      const localSubjects = JSON.parse(localStorage.getItem('agenda_academica_v2_subjects') || '[]');
      const localActivities = JSON.parse(localStorage.getItem('agenda_academica_v2_activities') || '[]');
      const sameSubjects = JSON.stringify(
        localSubjects.map(({ name, short_name, color, year, semester, status }) => ({ name, short_name, color, year, semester, status })).sort((a, b) => a.short_name.localeCompare(b.short_name))
      ) === JSON.stringify(
        subjects.map(({ name, short_name, color, year, semester, status }) => ({ name, short_name, color, year, semester, status })).sort((a, b) => a.short_name.localeCompare(b.short_name))
      );
      const sameActivities = JSON.stringify(
        localActivities.map(({ title, type, description, start_date, due_date, due_time, status }) => ({ title, type, description, start_date, due_date, due_time, status })).sort((a, b) => (a.title + a.due_date).localeCompare(b.title + b.due_date))
      ) === JSON.stringify(
        activities.map(({ title, type, description, start_date, due_date, due_time, status }) => ({ title, type, description, start_date, due_date, due_time, status })).sort((a, b) => (a.title + a.due_date).localeCompare(b.title + b.due_date))
      );

      if (localSubjects.length && localActivities.length && sameSubjects && sameActivities) {
        setLocalBackupCounts({ subjects: localSubjects.length, activities: localActivities.length });
      } else {
        setLocalBackupCounts(null);
      }
    } catch {
      setLocalBackupCounts(null);
    }
  }, [user, subjects, activities]);

  // Handlers for Activity Modal
  const handleOpenAddActivity = (dateStr = null) => {
    setEditingActivity(null);
    setDefaultActivityDate(dateStr);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (activity) => {
    setEditingActivity(activity);
    setDefaultActivityDate(null);
    setIsActivityModalOpen(true);
  };

  const handleActivityClickFromCalendar = (activity) => {
    setActiveTab('dashboard');
    filters.setSubjectId('ALL');
    filters.setType('ALL');
    filters.setSearchQuery('');
    if (activity.status !== 'Finalizada') {
      filters.setStatus('PENDING');
    } else {
      filters.setStatus('ALL');
    }
    setSelectedActivityId(activity.id);
  };

  const handleSaveActivity = async (payload) => {
    if (payload.id) {
      await actions.updateActivity(payload);
    } else {
      await actions.createActivity(payload);
    }
  };

  // Handlers for Subject Modal
  const handleOpenCreateSubject = () => {
    setEditingSubject(null);
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (subject) => {
    setEditingSubject(subject);
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = async (payload) => {
    if (payload.id) {
      await actions.updateSubject(payload);
    } else {
      await actions.createSubject(payload);
    }
  };

  const handleToggleSubjectStatus = async (subject) => {
    const newStatus = subject.status === 'activa' ? 'finalizada' : 'activa';
    await actions.updateSubject({
      ...subject,
      status: newStatus
    });
  };

  if (authLoading) {
    return <div className="auth-loading-screen"><div className="spinner"></div></div>;
  }

  if (!user) {
    return (
      <div className="auth-required-screen">
        <div className="auth-required-card glass-card animate-in">
          <div className="auth-required-icon"><GraduationCap size={32} /></div>
          <h1>Agenda Académica</h1>
          <p>Iniciá sesión para acceder a tu agenda personal y sincronizada de forma segura.</p>
          <button className="btn-primary auth-required-button" onClick={() => setIsAuthModalOpen(true)}>
            <LockKeyhole size={17} /> Ingresar o crear cuenta
          </button>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Top Header */}
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAddActivity={() => handleOpenAddActivity()}
        localBackupCounts={localBackupCounts}
        onClearLocalBackup={handleClearLocalBackup}
      />

      {/* Navigation Tab Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alerts.length}
        onOpenAddActivity={() => handleOpenAddActivity()}
      />

      {/* Main App Content Viewport */}
      <main className="main-viewport animate-fade-in">
        {isLoading ? (
          <div className="app-loading-state glass-card">
            <div className="spinner"></div>
            <p>Cargando tu agenda académica...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="tab-view-container">
                <StatsOverview
                  stats={stats}
                  activeStatus={filters.status}
                  onSelectFilter={(status) => {
                    filters.setStatus(status);
                  }}
                />
                <WeeklyView
                  filteredActivities={filteredActivities}
                  subjects={subjects}
                  filters={filters}
                  onToggleComplete={actions.toggleComplete}
                  onEditActivity={handleOpenEditActivity}
                  onDeleteActivity={actions.deleteActivity}
                  onOpenAddActivity={() => handleOpenAddActivity()}
                  selectedActivityId={selectedActivityId}
                />
              </div>
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                activities={activities}
                subjects={subjects}
                onSelectDateToAdd={(dateStr) => handleOpenAddActivity(dateStr)}
                onEditActivity={handleOpenEditActivity}
                onToggleComplete={actions.toggleComplete}
                onActivityClick={handleActivityClickFromCalendar}
              />
            )}

            {activeTab === 'upcoming' && (
              <UpcomingView
                activities={activities}
                onToggleComplete={actions.toggleComplete}
                onEditActivity={handleOpenEditActivity}
                onDeleteActivity={actions.deleteActivity}
                onOpenAddActivity={() => handleOpenAddActivity()}
              />
            )}

            {activeTab === 'subjects' && (
              <SubjectManager
                subjects={subjects}
                activities={activities}
                onOpenCreateSubject={handleOpenCreateSubject}
                onEditSubject={handleOpenEditSubject}
                onDeleteSubject={actions.deleteSubject}
                onToggleStatus={handleToggleSubjectStatus}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsCenter
                alerts={alerts}
                preferences={preferences}
                onSavePreferences={actions.savePreferences}
                onToggleCompleteActivity={actions.toggleComplete}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        initialData={editingActivity}
        subjects={subjects}
        defaultDate={defaultActivityDate}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={handleSaveSubject}
        initialData={editingSubject}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default App;
