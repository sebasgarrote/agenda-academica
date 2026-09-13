import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, Tag, AlignLeft } from 'lucide-react';
import { ACTIVITY_TYPES, ACTIVITY_STATUSES } from '../../utils/constants';

const ActivityModal = ({ isOpen, onClose, onSave, initialData, subjects, defaultDate }) => {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [type, setType] = useState('Trabajo Práctico');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pendiente');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSubjectId(initialData.subject_id || (subjects[0]?.id || ''));
      setType(initialData.type || 'Trabajo Práctico');
      setStartDate(initialData.start_date || new Date().toISOString().split('T')[0]);
      setDueDate(initialData.due_date || new Date().toISOString().split('T')[0]);
      setDueTime(initialData.due_time || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'Pendiente');
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      setTitle('');
      setSubjectId(subjects[0]?.id || '');
      setType('Trabajo Práctico');
      setStartDate(todayStr);
      setDueDate(defaultDate || todayStr);
      setDueTime('');
      setDescription('');
      setStatus('Pendiente');
    }
    setErrorMsg('');
  }, [initialData, defaultDate, subjects, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Por favor ingresá un título para la actividad.');
      return;
    }
    if (!subjectId) {
      setErrorMsg('Por favor seleccioná una materia.');
      return;
    }
    if (!dueDate) {
      setErrorMsg('Por favor ingresá una fecha límite.');
      return;
    }

    onSave({
      id: initialData?.id,
      title: title.trim(),
      subject_id: subjectId,
      type,
      start_date: startDate,
      due_date: dueDate,
      due_time: dueTime || null,
      description: description.trim(),
      status
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? 'Editar Actividad' : 'Nueva Actividad Académica'}</h3>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && <div className="error-banner">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              <Tag size={15} /> Título de la Actividad *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Foro U6 - Evaluación del Desempeño"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                <BookOpen size={15} /> Materia *
              </label>
              <select
                className="form-select"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.short_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Actividad *</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={15} /> Fecha Inicio
              </label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={15} /> Fecha Límite *
              </label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={15} /> Hora Límite
              </label>
              <input
                type="time"
                className="form-input"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <AlignLeft size={15} /> Descripción / Notas adicionales
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Notas sobre consignas, integrantes de equipo, enlace al campus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estado</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={ACTIVITY_STATUSES.PENDING}>Pendiente</option>
              <option value={ACTIVITY_STATUSES.IN_PROGRESS}>En progreso</option>
              <option value={ACTIVITY_STATUSES.COMPLETED}>Finalizada</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? 'Guardar Cambios' : 'Crear Actividad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;
