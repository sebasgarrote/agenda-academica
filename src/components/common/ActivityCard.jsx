import React from 'react';
import { Check, RotateCcw, Edit2, Trash2, Clock, Calendar, FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDateSpanish } from '../../utils/dateUtils';

const ActivityCard = ({ activity, onToggleComplete, onEdit, onDelete, isHighlighted }) => {
  const isCompleted = activity.status === 'Finalizada';
  const { subject, urgency } = activity;

  return (
    <div
      data-activity-id={activity.id}
      className={`activity-card glass-card ${isCompleted ? 'is-completed' : ''} ${isHighlighted ? 'is-highlighted' : ''}`}
      style={{
        borderLeftColor: subject.color || '#3B82F6'
      }}
    >
      <div className="card-header">
        <div className="tags-row">
          <span
            className="subject-chip"
            style={{
              backgroundColor: `${subject.color}20`,
              color: subject.color,
              borderColor: `${subject.color}50`
            }}
          >
            {subject.short_name || subject.name}
          </span>
          <span className="type-chip">{activity.type}</span>
          <StatusBadge urgency={urgency} />
        </div>

        <div className="card-actions-menu">
          <button
            className="icon-btn edit-btn"
            onClick={() => onEdit(activity)}
            title="Editar actividad"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-btn delete-btn"
            onClick={() => onDelete(activity.id)}
            title="Eliminar actividad"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className={`activity-title ${isCompleted ? 'line-through' : ''}`}>
        {activity.title}
      </h3>

      {activity.description && (
        <p className="activity-desc">
          <FileText size={14} className="inline-icon" /> {activity.description}
        </p>
      )}

      <div className="card-footer">
        <div className="date-info">
          <span className="date-item" title="Fecha límite">
            <Calendar size={14} />
            {formatDateSpanish(activity.due_date, { short: true })}
          </span>
          {activity.due_time && (
            <span className="time-item" title="Hora límite">
              <Clock size={14} />
              {activity.due_time} hs
            </span>
          )}
          {isCompleted && activity.completed_at && (
            <span className="completed-timestamp">
              ✓ Hecha el {new Date(activity.completed_at).toLocaleDateString('es-AR')}
            </span>
          )}
        </div>

        <div className="toggle-btn-wrapper">
          {isCompleted ? (
            <button
              className="quick-toggle-btn revert-btn"
              onClick={() => onToggleComplete(activity.id)}
              title="Marcar nuevamente como pendiente"
            >
              <RotateCcw size={15} />
              <span>↶ Marcar pendiente</span>
            </button>
          ) : (
            <button
              className="quick-toggle-btn complete-btn"
              onClick={() => onToggleComplete(activity.id)}
              title="Marcar actividad como hecha"
            >
              <Check size={16} />
              <span>✓ Marcar hecha</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
