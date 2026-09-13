import React from 'react';
import { LayoutDashboard, Calendar, Clock, BookOpen, Bell, Plus } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, alertCount, onOpenAddActivity }) => {
  const navItems = [
    { id: 'dashboard', label: 'Esta Semana', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'upcoming', label: 'Próximamente', icon: Clock },
    { id: 'subjects', label: 'Materias', icon: BookOpen },
    { id: 'alerts', label: 'Alertas', icon: Bell, badge: alertCount }
  ];

  return (
    <>
      {/* Desktop / Tablet Top Tabs Bar */}
      <nav className="desktop-navbar glass-panel">
        <div className="nav-tabs-container">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {Boolean(item.badge) && item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="icon-wrapper">
                <Icon size={20} />
                {Boolean(item.badge) && item.badge > 0 && (
                  <span className="mobile-nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="mobile-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Floating Action Button (FAB) for Mobile */}
      <button
        className="mobile-fab-btn"
        onClick={() => onOpenAddActivity()}
        title="Nueva Actividad"
        aria-label="Agregar Actividad"
      >
        <Plus size={24} />
      </button>
    </>
  );
};

export default Navbar;
