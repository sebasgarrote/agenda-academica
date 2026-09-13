import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal States
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [defaultActivityDate, setDefaultActivityDate] = useState(null);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [selectedActivityId, setSelectedActivityId] = useState(null);

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

  return (
    <div className="app-layout">
      {/* Top Header */}
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAddActivity={() => handleOpenAddActivity()}
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
