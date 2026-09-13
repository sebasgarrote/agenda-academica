import React from 'react';
import { Cloud, CloudOff, User, LogOut, Plus, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCloudSyncStatus } from '../../services/supabaseClient';

const Header = ({ onOpenAuth, onOpenAddActivity }) => {
  const { user, signOut } = useAuth();
  const cloudStatus = getCloudSyncStatus();

  return (
    <header className="app-header glass-header">
      <div className="header-brand">
        <div className="brand-logo-icon">🎓</div>
        <div>
          <h1 className="brand-title">Agenda <span className="brand-accent">Académica</span></h1>
          <p className="brand-subtitle">Seguimiento universitario 100% online</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Sync Status Badge */}
        {cloudStatus.isConfigured && user ? (
          <div className="cloud-badge online" title={`Sincronizado en Supabase con ${user.email}`}>
            <Cloud size={14} />
            <span className="badge-text">Sincronizado</span>
          </div>
        ) : (
          <button
            className="cloud-badge offline-btn"
            onClick={onOpenAuth}
            title="Hacer click para configurar Supabase o iniciar sesión"
          >
            <CloudOff size={14} />
            <span className="badge-text">Modo Demo (Local)</span>
          </button>
        )}

        {/* Campus Button */}
        <a
          href="https://tua.sied.utn.edu.ar/my/index.php"
          target="_blank"
          rel="noreferrer noopener"
          className="header-icon-btn"
          title="Abrir Campus UTN"
        >
          <ExternalLink size={18} />
          <span className="desktop-only-text">Campus</span>
        </a>

        {/* Quick Add Button desktop */}
        <button
          className="btn-primary desktop-add-btn"
          onClick={() => onOpenAddActivity()}
        >
          <Plus size={18} />
          <span>Nueva Actividad</span>
        </button>

        {/* User Account / Auth */}
        {user ? (
          <div className="user-profile-menu">
            <div className="user-avatar" title={user.email}>
              <User size={16} />
              <span className="user-email-short">{user.email.split('@')[0]}</span>
            </div>
            <button className="icon-btn logout-btn" onClick={signOut} title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button className="btn-secondary auth-btn" onClick={onOpenAuth}>
            <User size={16} />
            <span>Ingresar</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
