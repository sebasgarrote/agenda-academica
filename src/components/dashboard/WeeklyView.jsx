import React, { useEffect, useRef } from 'react';
import ActivityCard from '../common/ActivityCard';
import { Calendar, Filter, Search, FilterX } from 'lucide-react';

const WeeklyView = ({
  filteredActivities,
  subjects,
  filters,
  onToggleComplete,
  onEditActivity,
  onDeleteActivity,
  onOpenAddActivity,
  selectedActivityId
}) => {
  const {
    subjectId,
    setSubjectId,
    type,
    setType,
    status,
    setStatus,
    searchQuery,
    setSearchQuery
  } = filters;

  const hasActiveFilters = status !== 'ALL' || subjectId !== 'ALL' || type !== 'ALL' || searchQuery.trim() !== '';
  const listRef = useRef(null);

  useEffect(() => {
    if (selectedActivityId && listRef.current) {
      const el = listRef.current.querySelector(`[data-activity-id="${selectedActivityId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedActivityId]);

  const getTitle = () => {
    if (status === 'PENDING') return '📌 Actividades Pendientes';
    if (status === 'UPCOMING') return '⚠️ Próximas a Vencer (≤ 3 días)';
    if (status === 'OVERDUE') return '🔴 Actividades Vencidas';
    if (status === 'COMPLETED') return '✓ Actividades Completadas';
    if (hasActiveFilters) return '🔍 Resultados Filtrados';
    return '📅 Esta Semana';
  };

  return (
    <div className="weekly-view-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">
            <Calendar size={22} className="inline-icon" /> {getTitle()}
          </h2>
          <p className="view-subtitle">
            {hasActiveFilters
              ? `Mostrando ${filteredActivities.length} actividad(es) según los filtros seleccionados`
              : 'Prioridad automática: Vencidas → Hoy → Mañana → Próximas entregas'}
          </p>
        </div>

        <button className="btn-primary desktop-only" onClick={() => onOpenAddActivity()}>
          + Agregar Actividad
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filters-bar glass-panel">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por título, materia o nota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="select-filters-group">
          {/* Status Dropdown Filter */}
          <div className="filter-item">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="UPCOMING">Próximas a vencer</option>
              <option value="OVERDUE">Vencidas</option>
              <option value="COMPLETED">Completadas</option>
            </select>
          </div>

          {/* Subject Dropdown Filter */}
          <div className="filter-item">
            <Filter size={14} className="filter-icon" />
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Todas las materias</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.short_name})
                </option>
              ))}
            </select>
          </div>

          {/* Type Dropdown Filter */}
          <div className="filter-item">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="Foro">Foro</option>
              <option value="Trabajo Práctico">Trabajo Práctico</option>
              <option value="Cuestionario">Cuestionario</option>
              <option value="AVS">AVS</option>
              <option value="Parcial">Parcial</option>
              <option value="Recuperatorio">Recuperatorio</option>
              <option value="Seminario">Seminario</option>
              <option value="Avance">Avance</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              className="btn-secondary clear-filter-btn-sm"
              onClick={() => {
                setStatus('ALL');
                setSubjectId('ALL');
                setType('ALL');
                setSearchQuery('');
              }}
              title="Limpiar todos los filtros"
            >
              <FilterX size={14} />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="activities-list" ref={listRef}>
        {filteredActivities.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-icon">🔍</div>
            <h3>No se encontraron actividades con estos filtros</h3>
            <p>Probá cambiando el estado seleccionando otra tarjeta o limpiá la búsqueda.</p>
            <button
              className="btn-secondary margin-top"
              onClick={() => {
                setStatus('ALL');
                setSubjectId('ALL');
                setType('ALL');
                setSearchQuery('');
              }}
            >
              Mostrar todas las actividades
            </button>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <ActivityCard
              key={act.id}
              data-activity-id={act.id}
              activity={act}
              onToggleComplete={onToggleComplete}
              onEdit={onEditActivity}
              onDelete={onDeleteActivity}
              isHighlighted={act.id === selectedActivityId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WeeklyView;
