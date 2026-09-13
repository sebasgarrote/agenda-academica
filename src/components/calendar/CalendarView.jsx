import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Check } from 'lucide-react';
import { getMonthGrid, getMonthName } from '../../utils/dateUtils';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const CalendarView = ({
  activities,
  subjects,
  onSelectDateToAdd,
  onEditActivity,
  onToggleComplete,
  onActivityClick
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const grid = getMonthGrid(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleResetToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Group activities by YYYY-MM-DD
  const activitiesByDate = {};
  activities.forEach((act) => {
    if (!activitiesByDate[act.due_date]) {
      activitiesByDate[act.due_date] = [];
    }
    activitiesByDate[act.due_date].push(act);
  });

  return (
    <div className="calendar-view-container">
      {/* Calendar Header Navigation */}
      <div className="calendar-header glass-panel">
        <div className="calendar-title-group">
          <h2 className="calendar-month-name">
            {getMonthName(currentMonth)} <span className="year-text">{currentYear}</span>
          </h2>
        </div>

        <div className="calendar-controls">
          <button className="btn-secondary today-btn" onClick={handleResetToToday}>
            <CalendarIcon size={14} />
            <span>Hoy</span>
          </button>
          <div className="arrow-nav-group">
            <button className="icon-btn nav-arrow" onClick={handlePrevMonth} title="Mes anterior">
              <ChevronLeft size={20} />
            </button>
            <button className="icon-btn nav-arrow" onClick={handleNextMonth} title="Mes siguiente">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="calendar-grid-wrapper glass-card">
        {/* Day headers */}
        <div className="calendar-weekdays-header">
          {WEEKDAYS.map((day) => (
            <div key={day} className="weekday-title">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="calendar-days-grid">
          {grid.map((cell, idx) => {
            const dayActivities = activitiesByDate[cell.dateStr] || [];

            return (
              <div
                key={`${cell.dateStr}-${idx}`}
                className={`calendar-day-cell ${cell.isCurrentMonth ? 'current-month' : 'other-month'} ${cell.isToday ? 'is-today' : ''}`}
                onClick={() => onSelectDateToAdd(cell.dateStr)}
              >
                <div className="cell-top-bar">
                  <span className="day-number">{cell.dayNumber}</span>
                  <button
                    className="add-day-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDateToAdd(cell.dateStr);
                    }}
                    title={`Agregar actividad el ${cell.dateStr}`}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="cell-activities-container">
                  {dayActivities.map((act) => {
                    const isDone = act.status === 'Finalizada';
                    return (
                      <div
                        key={act.id}
                        className={`calendar-event-pill ${isDone ? 'is-done' : ''}`}
                        style={{
                          borderLeftColor: act.subject.color,
                          backgroundColor: `${act.subject.color}15`
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onActivityClick) {
                            onActivityClick(act);
                          } else {
                            onEditActivity(act);
                          }
                        }}
                        title={`${act.subject.short_name}: ${act.title} (${act.type})`}
                      >
                        <button
                          className="pill-check-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(act.id);
                          }}
                          title={isDone ? 'Marcar como pendiente' : 'Marcar como hecha'}
                        >
                          <Check size={11} className={isDone ? 'check-icon' : 'uncheck-icon'} />
                        </button>
                        <span className="pill-type-dot" style={{ backgroundColor: act.subject.color }} />
                        <span className="pill-subject-code">{act.subject.short_name}:</span>
                        <span className="pill-title">{act.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
