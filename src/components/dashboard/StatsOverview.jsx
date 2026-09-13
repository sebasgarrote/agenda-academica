import React from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2, Calendar, FilterX } from 'lucide-react';
import { formatDateSpanish } from '../../utils/dateUtils';

const StatsOverview = ({ stats, activeStatus = 'ALL', onSelectFilter }) => {
  const { pending, upcoming, overdue, completed, nextDueDateActivity } = stats;

  const handleCardClick = (targetStatus) => {
    if (!onSelectFilter) return;
    if (activeStatus === targetStatus) {
      onSelectFilter('ALL'); // toggle off back to ALL
    } else {
      onSelectFilter(targetStatus);
    }
  };

  return (
    <div className="stats-overview-container">
      <div className="stats-grid">
        {/* Card 1: Pendientes */}
        <div
          className={`stat-card pending-card glass-card clickable ${activeStatus === 'PENDING' ? 'active-filter' : ''}`}
          onClick={() => handleCardClick('PENDING')}
          title="Filtrar por actividades pendientes"
        >
          <div className="stat-icon">
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{pending}</span>
            <span className="stat-label">Pendientes</span>
          </div>
          {activeStatus === 'PENDING' && <span className="active-dot">✓</span>}
        </div>

        {/* Card 2: Próximas a vencer */}
        <div
          className={`stat-card upcoming-card glass-card clickable ${activeStatus === 'UPCOMING' ? 'active-filter' : ''}`}
          onClick={() => handleCardClick('UPCOMING')}
          title="Filtrar por actividades próximas a vencer (≤ 3 días)"
        >
          <div className="stat-icon">
            <AlertTriangle size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{upcoming}</span>
            <span className="stat-label">Próximas a vencer</span>
          </div>
          {activeStatus === 'UPCOMING' && <span className="active-dot">✓</span>}
        </div>

        {/* Card 3: Vencidas */}
        <div
          className={`stat-card overdue-card glass-card clickable ${activeStatus === 'OVERDUE' ? 'active-filter' : ''}`}
          onClick={() => handleCardClick('OVERDUE')}
          title="Filtrar por actividades vencidas"
        >
          <div className="stat-icon">
            <AlertCircle size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{overdue}</span>
            <span className="stat-label">Vencidas</span>
          </div>
          {activeStatus === 'OVERDUE' && <span className="active-dot">✓</span>}
        </div>

        {/* Card 4: Completadas */}
        <div
          className={`stat-card completed-card glass-card clickable ${activeStatus === 'COMPLETED' ? 'active-filter' : ''}`}
          onClick={() => handleCardClick('COMPLETED')}
          title="Filtrar por actividades completadas"
        >
          <div className="stat-icon">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{completed}</span>
            <span className="stat-label">Completadas</span>
          </div>
          {activeStatus === 'COMPLETED' && <span className="active-dot">✓</span>}
        </div>
      </div>

      {/* Active Filter Indicator Bar if filtered */}
      {activeStatus !== 'ALL' && (
        <div className="active-filter-bar glass-card">
          <span className="active-filter-text">
            Filtro activo:{' '}
            <strong>
              {activeStatus === 'PENDING' && '📌 Actividades Pendientes'}
              {activeStatus === 'UPCOMING' && '⚠️ Próximas a Vencer (≤ 3 días)'}
              {activeStatus === 'OVERDUE' && '🔴 Actividades Vencidas'}
              {activeStatus === 'COMPLETED' && '✓ Actividades Completadas'}
            </strong>
          </span>
          <button className="btn-secondary clear-filter-btn" onClick={() => onSelectFilter('ALL')}>
            <FilterX size={14} />
            <span>Mostrar todas</span>
          </button>
        </div>
      )}

      {/* High priority next due activity banner */}
      {nextDueDateActivity && activeStatus === 'ALL' && (
        <div className="next-due-banner glass-card">
          <div className="banner-badge">⚡ Próxima Fecha Límite</div>
          <div className="banner-details">
            <span
              className="banner-subject"
              style={{ color: nextDueDateActivity.subject.color }}
            >
              {nextDueDateActivity.subject.short_name}
            </span>
            <h4 className="banner-title">{nextDueDateActivity.title}</h4>
            <div className="banner-time">
              <Calendar size={14} />
              <span>
                {formatDateSpanish(nextDueDateActivity.due_date, { short: true })}
                {nextDueDateActivity.due_time ? ` a las ${nextDueDateActivity.due_time} hs` : ''}
              </span>
              <span className="banner-urgency-tag">
                {nextDueDateActivity.urgency.badgeText}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsOverview;
