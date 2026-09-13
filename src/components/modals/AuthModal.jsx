import React, { useState } from 'react';
import { X, Mail, Lock, Sparkles, Cloud, Settings, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveCustomSupabaseConfig, clearCustomSupabaseConfig, getCloudSyncStatus } from '../../services/supabaseClient';

const AuthModal = ({ isOpen, onClose }) => {
  const { signIn, signUp, signInWithMagicLink, authError } = useAuth();
  const cloudStatus = getCloudSyncStatus();

  const [activeTab, setActiveTab] = useState('signin'); // signin | signup | magiclink | config
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customUrl, setCustomUrl] = useState(cloudStatus.url || '');
  const [customKey, setCustomKey] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await signIn(email, password);
      onClose();
    } catch (err) {
      setMsg(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await signUp(email, password);
      setMsg('¡Cuenta creada! Revisá tu correo para confirmar la cuenta o iniciá sesión.');
    } catch (err) {
      setMsg(err.message || 'Error al registrar usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await signInWithMagicLink(email);
      setMsg('¡Magic Link enviado! Revisá tu casilla de correo.');
    } catch (err) {
      setMsg(err.message || 'Error al enviar Magic Link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!customUrl || !customKey) {
      setMsg('Ingresá una URL de Supabase y la Anon Key.');
      return;
    }
    saveCustomSupabaseConfig(customUrl, customKey);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Sincronización Cloud Supabase ☁️</h3>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs navigation inside auth modal */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Crear Cuenta
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'magiclink' ? 'active' : ''}`}
            onClick={() => setActiveTab('magiclink')}
          >
            Magic Link
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <Settings size={14} /> Config
          </button>
        </div>

        {(msg || authError) && (
          <div className="auth-message-banner">
            <AlertCircle size={16} />
            <span>{msg || authError}</span>
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="modal-form">
            <div className="form-group">
              <label className="form-label">
                <Mail size={15} /> Correo Electrónico
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="tu.email@universidad.edu.ar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={15} /> Contraseña
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="modal-form">
            <div className="form-group">
              <label className="form-label">
                <Mail size={15} /> Correo Electrónico
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="tu.email@universidad.edu.ar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={15} /> Contraseña
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Crea una contraseña segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear Cuenta Personal'}
            </button>
          </form>
        )}

        {/* Magic Link Form */}
        {activeTab === 'magiclink' && (
          <form onSubmit={handleMagicLink} className="modal-form">
            <p className="auth-hint">
              Recibirás un enlace seguro en tu casilla de correo para ingresar sin contraseña.
            </p>
            <div className="form-group">
              <label className="form-label">
                <Mail size={15} /> Correo Electrónico
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="tu.email@universidad.edu.ar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary full-width" disabled={loading}>
              <Sparkles size={16} />
              <span>{loading ? 'Enviando...' : 'Enviar Magic Link'}</span>
            </button>
          </form>
        )}

        {/* Supabase Custom Config */}
        {activeTab === 'config' && (
          <form onSubmit={handleSaveConfig} className="modal-form">
            <p className="auth-hint">
              Configurá tus credenciales de proyecto Supabase Cloud para habilitar sincronización 100% online en tiempo real entre tu PC y Celular.
            </p>

            <div className="form-group">
              <label className="form-label">Supabase URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://xyzxyzxyz.supabase.co"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Supabase Anon Key</label>
              <input
                type="password"
                className="form-input"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                required
              />
            </div>

            <div className="form-actions-row">
              {cloudStatus.isConfigured && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={clearCustomSupabaseConfig}
                >
                  Restablecer a Modo Local
                </button>
              )}
              <button type="submit" className="btn-primary">
                Guardar Credenciales Cloud
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
