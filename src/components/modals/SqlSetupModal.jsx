import React, { useState } from 'react';
import { X, Copy, Check, Terminal } from 'lucide-react';

const SQL_SCRIPT = `-- ============================================================
-- SCRIPT DE BASE DE DATOS SUPABASE PARA AGENDA ACADÉMICA
-- Copiá y pegá este código en el "SQL Editor" de tu proyecto Supabase.
-- ============================================================

-- 1. Tabla de Materias (Subjects)
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#10B981',
  year INTEGER NOT NULL DEFAULT 2026,
  semester TEXT NOT NULL DEFAULT 'Segundo',
  status TEXT NOT NULL DEFAULT 'activa',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de Actividades (Activities)
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  due_date DATE NOT NULL,
  due_time TIME,
  status TEXT NOT NULL DEFAULT 'Pendiente',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Preferencias de Notificación
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  days_before JSONB DEFAULT '[3, 1, 0]'::jsonb,
  notifications_enabled BOOLEAN DEFAULT true,
  push_subscription JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - PRIVACIDAD TOTAL POR USUARIO
-- ============================================================

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas para Subjects
CREATE POLICY "Acceso propio a materias" ON public.subjects
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para Activities
CREATE POLICY "Acceso propio a actividades" ON public.activities
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para Notification Preferences
CREATE POLICY "Acceso propio a preferencias" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id);
`;

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
