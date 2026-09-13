import React, { useState, useEffect } from 'react';
import { X, BookOpen, Palette, Check } from 'lucide-react';
import { PRESET_COLORS, SEMESTERS, SUBJECT_STATUSES } from '../../utils/constants';

const SubjectModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [color, setColor] = useState('#10B981');
  const [year, setYear] = useState(2026);
  const [semester, setSemester] = useState('Segundo');
  const [status, setStatus] = useState('activa');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setShortName(initialData.short_name || '');
      setColor(initialData.color || '#10B981');
      setYear(initialData.year || 2026);
      setSemester(initialData.semester || 'Segundo');
      setStatus(initialData.status || 'activa');
    } else {
      setName('');
      setShortName('');
      setColor('#10B981');
      setYear(2026);
      setSemester('Segundo');
      setStatus('activa');
    }
    setErrorMsg('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresá el nombre completo de la materia.');
      return;
    }
    if (!shortName.trim()) {
      setErrorMsg('Por favor ingresá un nombre corto / sigla.');
      return;
    }

    onSave({
      id: initialData?.id,
      name: name.trim(),
      short_name: shortName.trim().toUpperCase(),
      color,
      year: Number(year),
      semester,
      status
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? 'Editar Materia' : 'Nueva Materia'}</h3>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && <div className="error-banner">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              <BookOpen size={15} /> Nombre Completo de la Materia *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Gestión de Recursos Humanos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Nombre Corto / Sigla *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: RRHH"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Año *</label>
              <input
                type="number"
                className="form-input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min={2020}
                max={2030}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Cuatrimestre / Período</label>
              <select
                className="form-select"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem} Cuatrimestre
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estado de la Materia</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value={SUBJECT_STATUSES.ACTIVE}>Activa</option>
                <option value={SUBJECT_STATUSES.FINISHED}>Finalizada</option>
              </select>
            </div>
          </div>

          {/* Color Picker Swatches */}
          <div className="form-group">
            <label className="form-label">
              <Palette size={15} /> Color Identificatorio
            </label>
            <div className="color-swatches-grid">
              {PRESET_COLORS.map((c) => {
                const isSelected = color.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    className={`color-swatch-btn ${isSelected ? 'selected' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setColor(c.hex)}
                    title={c.name}
                  >
                    {isSelected && <Check size={16} style={{ color: '#FFF' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? 'Guardar Cambios' : 'Crear Materia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;
