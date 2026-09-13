import React, { useState } from 'react';
import { X, Copy, Check, Terminal } from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '../../services/supabaseSchema';

const SQL_SCRIPT = SUPABASE_SCHEMA_SQL;

const SqlSetupModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card animate-in modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Terminal size={18} className="inline-icon" /> Script SQL para Supabase (Tablas + RLS)
          </h3>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="auth-hint">
          Si creaste un proyecto nuevo en Supabase, abrí la sección <strong>SQL Editor</strong> en tu panel de Supabase y ejecutá el siguiente script para crear las tablas y las reglas de seguridad RLS:
        </p>

        <div className="code-box-container">
          <div className="code-box-header">
            <span>supabase_schema.sql</span>
            <button className="btn-secondary copy-btn" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? '¡Copiado!' : 'Copiar SQL'}</span>
            </button>
          </div>
          <pre className="code-content">{SQL_SCRIPT}</pre>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default SqlSetupModal;
