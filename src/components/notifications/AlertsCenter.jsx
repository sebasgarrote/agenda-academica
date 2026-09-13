import React, { useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, Check, Settings, Smartphone, CheckCircle } from 'lucide-react';
import { formatDateSpanish } from '../../utils/dateUtils';

const AlertsCenter = ({ alerts, preferences, onSavePreferences, onToggleCompleteActivity }) => {
  const [daysBefore, setDaysBefore] = useState(preferences.days_before || [3, 1, 0]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences.notifications_enabled ?? true);
  const [pushStatus, setPushStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const toggleDayOption = (dayVal) => {
    let updated;
    if (daysBefore.includes(dayVal)) {
      updated = daysBefore.filter((d) => d !== dayVal);
    } else {
      updated = [...daysBefore, dayVal].sort((a, b) => b - a);
    }
    setDaysBefore(updated);
    onSavePreferences({
      days_before: updated,
      notifications_enabled: notificationsEnabled
    });
  };

  const handleToggleEnabled = (e) => {
    const val = e.target.checked;
    setNotificationsEnabled(val);
    onSavePreferences({
      days_before: daysBefore,
      notifications_enabled: val
    });
  };

  const requestPushPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Tu navegador no soporta Notificaciones Push.');
      return;
    }
    const res = await Notification.requestPermission();
    setPushStatus(res);
    if (res === 'granted') {
      new Notification('Agenda Académica 🎓', {
        body: 'Las alertas Push han sido activadas con éxito.',
        icon: '/favicon.ico'
      });
    }
  };

  return (
    <div className="alerts-center-container">
      <div className="view-header">
        <div>
          <h2 className="view-title">
            <Bell size={22} className="inline-icon" /> Centro de Alertas y Notificaciones
          </h2>
          <p className="view-subtitle">
            Avisos de vencimientos pendientes. Las tareas completadas no generan más alertas.
          </p>
        </div>
      </div>

      <div className="alerts-content-grid">
        {/* Active Alerts List */}
        <div className="active-alerts-section">
          <h3 className="section-subtitle">
            Notificaciones Activas <span className="alert-count-badge">{alerts.length}</span>
          </h3>

          {alerts.length === 0 ? (
            <div className="empty-state glass-card">
              <div className="empty-icon">🔔</div>
              <h3>Sin alertas pendientes</h3>
              <p>No tenés entregas urgentes próximas a vencer o ya has completado todas tus tareas.</p>
            </div>
          ) : (
            <div className="alerts-list">
              {alerts.map((act) => {
                const diff = act.urgency.daysDiff;
                const isOverdue = diff < 0;
                return (
                  <div
                    key={act.id}
                    className={`alert-item-card glass-card ${isOverdue ? 'alert-overdue' : 'alert-upcoming'}`}
                    style={{ borderLeftColor: act.subject.color }}
                  >
                    <div className="alert-icon-area">
                      {isOverdue ? (
                        <AlertCircle size={24} className="alert-icon overdue" />
                      ) : (
                        <AlertTriangle size={24} className="alert-icon upcoming" />
                      )}
                    </div>

                    <div className="alert-body">
                      <div className="alert-tags">
                        <span
                          className="subject-chip"
                          style={{
                            backgroundColor: `${act.subject.color}20`,
                            color: act.subject.color,
                            borderColor: `${act.subject.color}50`
                          }}
                        >
                          {act.subject.short_name}
                        </span>
                        <span className="type-chip">{act.type}</span>
                        <span className="urgency-tag">{act.urgency.badgeText}</span>
                      </div>

                      <h4 className="alert-title">{act.title}</h4>
                      <p className="alert-due-str">
                        Fecha límite: {formatDateSpanish(act.due_date, { short: true })}
                        {act.due_time ? ` a las ${act.due_time} hs` : ''}
                      </p>
                    </div>

                    <div className="alert-action">
                      <button
                        className="quick-toggle-btn complete-btn"
                        onClick={() => onToggleCompleteActivity(act.id)}
                        title="Marcar como hecha"
                      >
                        <Check size={16} />
                        <span>✓ Hecha</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notification Settings Panel */}
        <div className="alerts-config-section glass-card">
          <h3 className="section-subtitle">
            <Settings size={18} className="inline-icon" /> Configuración de Recordatorios
          </h3>

          <div className="config-option-row">
            <label className="switch-label">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={handleToggleEnabled}
              />
              <span className="switch-slider"></span>
              <span className="label-text">Activar sistema de alertas</span>
            </label>
          </div>

          <div className="config-group">
            <label className="config-group-title">Avisarme con anticipación:</label>
            <div className="checkbox-options-list">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={daysBefore.includes(3)}
                  onChange={() => toggleDayOption(3)}
                />
                <span>3 días antes del vencimiento</span>
              </label>

              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={daysBefore.includes(1)}
                  onChange={() => toggleDayOption(1)}
                />
                <span>1 día antes del vencimiento</span>
              </label>

              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={daysBefore.includes(0)}
                  onChange={() => toggleDayOption(0)}
                />
                <span>El mismo día del vencimiento</span>
              </label>
            </div>
          </div>

          {/* Web Push Notification Section */}
          <div className="push-notification-box">
            <h4 className="push-title">
              <Smartphone size={16} className="inline-icon" /> Notificaciones Push Cloud / PWA
            </h4>
            <p className="push-desc">
              Recibirás notificaciones directas en tu computadora y dispositivo celular incluso si tenés la app cerrada.
            </p>

            <div className="push-status-row">
              <span className="status-label">Permiso del navegador:</span>
              <span className={`status-badge-val ${pushStatus}`}>
                {pushStatus === 'granted' ? '✓ Permitido' : pushStatus === 'denied' ? '❌ Bloqueado' : '⏳ No configurado'}
              </span>
            </div>

            {pushStatus !== 'granted' && (
              <button className="btn-primary push-enable-btn" onClick={requestPushPermission}>
                Activar Notificaciones Push
              </button>
            )}
          </div>

          {/* Informational Cloud Explanation */}
          <div className="cloud-info-box">
            <CheckCircle size={16} className="inline-icon" />
            <p>
              <strong>Infraestructura Cloud:</strong> El procesamiento de alertas no depende de que tu computadora esté encendida. Supabase Cloud y el Service Worker procesan las notificaciones automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsCenter;
