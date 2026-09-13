import React, { useMemo } from 'react';
import ActivityCard from '../common/ActivityCard';
import { Clock } from 'lucide-react';

const UpcomingView = ({
  activities,
  onToggleComplete,
  onEditActivity,
  onDeleteActivity,
  onOpenAddActivity
}) => {
  // Group activities by urgency proximity
  const groups = useMemo(() => {
    // Only pending activities for upcoming
    const pendingList = activities
      .filter((a) => a.status !== 'Finalizada')
      .sort((a, b) => a.urgency.daysDiff - b.urgency.daysDiff);

    const overdue = [];
    const today = [];
    const tomorrow = [];
    const nextDays = [];
    const later = [];

    pendingList.forEach((act) => {
      const diff = act.urgency.daysDiff;
      if (diff < 0) overdue.push(act);
      else if (diff === 0) today.push(act);
      else if (diff === 1) tomorrow.push(act);
      else if (diff <= 3) nextDays.push(act);
      else later.push(act);
    });

    return [
      { key: 'overdue', title: '🔴 Vencidas (Pendientes de completar)', items: overdue, urgent: true },
      { key: 'today', title: '⚡ Vencen Hoy', items: today, urgent: true },
      { key: 'tomorrow', title: '⚠️ Vencen Mañana', items: tomorrow, urgent: false },
      { key: 'nextDays', title: '📅 En los próximos 3 días', items: nextDays, urgent: false },
      { key: 'later', title: '📌 Más adelante', items: later, urgent: false }
    ].filter((g) => g.items.length > 0);
  }, [activities]);

  return (
    <div className="upcoming-view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">
            <Clock size={22} className="inline-icon" /> Próximamente
          </h2>
          <p className="view-subtitle">
            Cronograma ordenado por fecha de entrega de actividades pendientes
          </p>
        </div>

        <button className="btn-primary desktop-only" onClick={() => onOpenAddActivity()}>
          + Nueva Actividad
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-icon">✨</div>
          <h3>¡No hay actividades pendientes en el horizonte!</h3>
          <p>Has completado todas tus tareas asignadas o no tienes actividades programadas.</p>
          <button className="btn-primary margin-top" onClick={() => onOpenAddActivity()}>
            Crear Actividad
          </button>
        </div>
      ) : (
        <div className="upcoming-groups-list">
          {groups.map((group) => (
            <div key={group.key} className="upcoming-group-section">
              <h3 className={`group-section-title ${group.urgent ? 'urgent-section' : ''}`}>
                {group.title} <span className="group-count">({group.items.length})</span>
              </h3>

              <div className="activities-list">
                {group.items.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEditActivity}
                    onDelete={onDeleteActivity}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingView;
