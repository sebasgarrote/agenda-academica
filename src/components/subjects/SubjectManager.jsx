import React from 'react';
import { BookOpen, Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

const SubjectManager = ({
  subjects,
  activities,
  onOpenCreateSubject,
  onEditSubject,
  onDeleteSubject,
  onToggleStatus
}) => {
  // Compute total activities per subject
  const subjectActivityCounts = {};
  activities.forEach((a) => {
    if (!subjectActivityCounts[a.subject_id]) {
      subjectActivityCounts[a.subject_id] = { total: 0, pending: 0, completed: 0 };
    }
    subjectActivityCounts[a.subject_id].total++;
    if (a.status === 'Finalizada') {
      subjectActivityCounts[a.subject_id].completed++;
    } else {
      subjectActivityCounts[a.subject_id].pending++;
    }
  });

  return (
    <div className="subjects-manager-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">
            <BookOpen size={22} className="inline-icon" /> Materias Universitarias
          </h2>
          <p className="view-subtitle">
            Administrá tus materias, asigná colores e identificadores cortos
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenCreateSubject}>
          <Plus size={18} />
          <span>Nueva Materia</span>
        </button>
      </div>

      <div className="subjects-grid">
        {subjects.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-icon">📚</div>
            <h3>No tenés materias registradas</h3>
            <p>Agregá tus materias para comenzar a vincular trabajos prácticos, foros y exámenes.</p>
            <button className="btn-primary margin-top" onClick={onOpenCreateSubject}>
              Crear Materia
            </button>
          </div>
        ) : (
          subjects.map((sub) => {
            const counts = subjectActivityCounts[sub.id] || { total: 0, pending: 0, completed: 0 };
            const isActive = sub.status === 'activa';

            return (
              <div
                key={sub.id}
                className={`subject-card glass-card ${!isActive ? 'is-finished' : ''}`}
                style={{ borderTopColor: sub.color }}
              >
                <div className="subject-card-header">
                  <div className="subject-title-area">
                    <span
                      className="subject-badge-pill"
                      style={{
                        backgroundColor: sub.color,
                        color: '#FFFFFF'
                      }}
                    >
                      {sub.short_name}
                    </span>
                    <span className={`subject-status-tag ${isActive ? 'active' : 'finished'}`}>
                      {isActive ? 'Activa' : 'Finalizada'}
                    </span>
                  </div>

                  <div className="subject-actions">
                    <button
                      className="icon-btn edit-btn"
                      onClick={() => onEditSubject(sub)}
                      title="Editar materia"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => onDeleteSubject(sub.id)}
                      title="Eliminar materia"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="subject-name">{sub.name}</h3>

                <div className="subject-meta-row">
                  <span className="meta-item">Año {sub.year}</span>
                  <span className="meta-item">•</span>
                  <span className="meta-item">{sub.semester} Cuatrimestre</span>
                </div>

                <div className="subject-card-footer">
                  <div className="activity-stats-chips">
                    <span className="chip pending-chip" title="Actividades pendientes">
                      <Clock size={12} /> {counts.pending} pendientes
                    </span>
                    <span className="chip completed-chip" title="Actividades completadas">
                      <CheckCircle size={12} /> {counts.completed} completas
                    </span>
                  </div>

                  <button
                    className="toggle-subject-status-btn"
                    onClick={() => onToggleStatus(sub)}
                    title={isActive ? 'Marcar como materia finalizada' : 'Reactivar materia'}
                  >
                    {isActive ? 'Finalizar' : 'Reactivar'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubjectManager;
