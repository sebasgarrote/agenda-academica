import React, { useRef, useState } from 'react';
import { Download, FileSpreadsheet, Upload, CheckCircle2, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { ACTIVITY_STATUSES, ACTIVITY_TYPES } from '../../utils/constants';

const HEADERS = ['Título', 'Tipo', 'Fecha de inicio', 'Fecha límite', 'Hora límite', 'Descripción', 'Estado'];

const normalizeDate = (value) => {
  const text = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!match) return null;
  return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
};

const findOption = (value, options, fallback) => {
  const text = String(value || '').trim().toLocaleLowerCase();
  return options.find((option) => option.toLocaleLowerCase() === text) || fallback;
};

const ActivitiesImportView = ({ subjects, activities, onCreateActivity, onMoveActivity }) => {
  const inputRef = useRef(null);
  const [subjectId, setSubjectId] = useState('');
  const [sourceSubjectId, setSourceSubjectId] = useState('');
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [result, setResult] = useState(null);
  const [moveResult, setMoveResult] = useState(null);

  const sourceActivities = activities.filter((activity) => activity.subject_id === sourceSubjectId);

  const downloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.aoa_to_sheet([
      HEADERS,
      ['Foro Unidad 1', 'Foro', '05-10-2026', '10-10-2026', '23:59', 'Participación en el foro de la unidad 1', 'Pendiente'],
      ['Trabajo práctico 1', 'Trabajo Práctico', '06-10-2026', '17-10-2026', '', 'Entrega individual', 'Pendiente']
    ]);
    worksheet['!cols'] = [
      { wch: 32 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 48 }, { wch: 16 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Actividades');
    XLSX.writeFile(workbook, 'plantilla-actividades-agenda.xlsx');
  };

  const processFile = async (file) => {
    if (!file) return;
    setResult(null);
    setFileName(file.name);
    try {
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: false });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false, dateNF: 'yyyy-mm-dd' });
      const parsed = [];
      const rowErrors = [];

      data.forEach((row, index) => {
        const title = String(row['Título'] || '').trim();
        const dueDate = normalizeDate(row['Fecha límite']);
        const startDate = normalizeDate(row['Fecha de inicio']) || dueDate;
        const dueTime = String(row['Hora límite'] || '').trim();
        if (!title) rowErrors.push(`Fila ${index + 2}: falta el título.`);
        if (!dueDate) rowErrors.push(`Fila ${index + 2}: la fecha límite debe tener formato DD-MM-AAAA.`);
        if (dueTime && !/^\d{2}:\d{2}$/.test(dueTime)) rowErrors.push(`Fila ${index + 2}: la hora debe tener formato HH:MM.`);
        if (title && dueDate && (!dueTime || /^\d{2}:\d{2}$/.test(dueTime))) {
          parsed.push({
            title,
            type: findOption(row.Tipo, ACTIVITY_TYPES, 'Otro'),
            start_date: startDate,
            due_date: dueDate,
            due_time: dueTime || null,
            description: String(row.Descripción || '').trim(),
            status: findOption(row.Estado, Object.values(ACTIVITY_STATUSES), ACTIVITY_STATUSES.PENDING)
          });
        }
      });
      setRows(parsed);
      setErrors(rowErrors);
    } catch (error) {
      console.error('Error reading activity spreadsheet:', error);
      setRows([]);
      setErrors(['No se pudo leer el archivo. Descargá nuevamente la plantilla y completala desde Excel.']);
    }
  };

  const handleFile = (event) => processFile(event.target.files?.[0]);

  const importRows = async () => {
    if (!subjectId || !rows.length || errors.length) return;
    setIsImporting(true);
    try {
      for (const row of rows) await onCreateActivity({ ...row, subject_id: subjectId });
      setResult({ success: true, count: rows.length, message: `Carga completada: se crearon ${rows.length} actividades.` });
      setRows([]);
      setFileName('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) {
      console.error('Error importing activities:', error);
      const isIdError = error?.message?.includes('column "id"');
      setResult({ success: false, message: isIdError ? 'No se pudo generar el identificador interno de las actividades. Intentá nuevamente.' : 'No se pudieron guardar todas las actividades. Revisá tu conexión e intentá nuevamente.' });
    } finally {
      setIsImporting(false);
    }
  };

  const moveActivities = async () => {
    if (!sourceSubjectId || !subjectId || sourceSubjectId === subjectId || !sourceActivities.length) return;
    const sourceSubject = subjects.find((subject) => subject.id === sourceSubjectId);
    const targetSubject = subjects.find((subject) => subject.id === subjectId);
    const confirmed = window.confirm(`Mover ${sourceActivities.length} actividades de ${sourceSubject?.short_name} a ${targetSubject?.short_name}?`);
    if (!confirmed) return;

    setIsMoving(true);
    setMoveResult(null);
    try {
      for (const activity of sourceActivities) await onMoveActivity(activity.id, subjectId);
      setMoveResult({ success: true, message: `Reasignación completada: se movieron ${sourceActivities.length} actividades a ${targetSubject?.short_name}.` });
      setSourceSubjectId('');
    } catch (error) {
      console.error('Error moving activities:', error);
      setMoveResult({ success: false, message: 'No se pudieron mover todas las actividades. Revisá tu conexión e intentá nuevamente.' });
    } finally {
      setIsMoving(false);
    }
  };

  return <div className="import-activities-container">
    <div className="import-header">
      <div><h2><FileSpreadsheet size={24} /> Importar actividades</h2><p>Descargá la plantilla, completala en Excel y cargá todas las actividades de una materia de una sola vez.</p></div>
      <button className="btn-secondary" onClick={downloadTemplate}><Download size={17} /> Descargar plantilla Excel</button>
    </div>
    <div className="glass-card import-card">
      <div className="form-group">
        <label className="form-label">Materia para estas actividades *</label>
        <select className="form-select" value={subjectId} onChange={(event) => setSubjectId(event.target.value)} disabled={!subjects.length}>
          <option value="">Elegí una materia</option>
          {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name} ({subject.short_name})</option>)}
        </select>
        {!subjects.length && <p className="import-hint">Primero creá una materia para poder importar sus actividades.</p>}
      </div>
      <div
        className={`upload-zone ${isDragging ? 'is-dragging' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click(); }}
        onDragEnter={(event) => { event.preventDefault(); event.stopPropagation(); setIsDragging(true); }}
        onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = 'copy'; }}
        onDragLeave={(event) => { event.preventDefault(); event.stopPropagation(); setIsDragging(false); }}
        onDrop={(event) => { event.preventDefault(); event.stopPropagation(); setIsDragging(false); processFile(event.dataTransfer.files?.[0]); }}
      >
        <Upload size={28} />
        <span>{fileName || 'Elegí o arrastrá tu archivo .xlsx'}</span>
        <small>Usá la plantilla descargada. Las columnas Título y Fecha límite son obligatorias.</small>
        <input ref={inputRef} id="activities-file" type="file" accept=".xlsx,.xls" onChange={handleFile} />
      </div>
      {errors.length > 0 && <div className="import-errors"><AlertTriangle size={18} /><div><strong>Corregí estas filas antes de importar:</strong>{errors.map((error) => <div key={error}>{error}</div>)}</div></div>}
      {rows.length > 0 && !errors.length && <div className="import-ready"><CheckCircle2 size={19} /><span>Se encontraron {rows.length} actividades listas para importar.</span></div>}
      {result && <div className={result.success ? 'import-ready' : 'import-errors'}>{result.success ? <CheckCircle2 size={19} /> : <AlertTriangle size={18} />}<span>{result.message}</span></div>}
      <div className="import-actions"><button className="btn-primary" disabled={!subjectId || !rows.length || errors.length || isImporting} onClick={importRows}>{isImporting ? 'Creando...' : `Crear ${rows.length || ''} actividades`}</button></div>
    </div>
    <div className="glass-card import-card reassign-card">
      <div className="import-section-title"><ArrowRightLeft size={20} /><div><h3>Reasignar actividades existentes</h3><p>Usalo si cargaste actividades en la materia equivocada.</p></div></div>
      <div className="form-row-2">
        <div className="form-group"><label className="form-label">Materia de origen</label><select className="form-select" value={sourceSubjectId} onChange={(event) => { setSourceSubjectId(event.target.value); setMoveResult(null); }}><option value="">Elegí la materia de origen</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name} ({subject.short_name})</option>)}</select></div>
        <div className="form-group"><label className="form-label">Materia de destino</label><select className="form-select" value={subjectId} onChange={(event) => setSubjectId(event.target.value)}><option value="">Elegí la materia de destino</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name} ({subject.short_name})</option>)}</select></div>
      </div>
      {sourceSubjectId && <p className="import-hint">Se moverán <strong>{sourceActivities.length}</strong> actividades. Las que ya pertenecen a otras materias no se modificarán.</p>}
      {moveResult && <div className={moveResult.success ? 'import-ready' : 'import-errors'}>{moveResult.success ? <CheckCircle2 size={19} /> : <AlertTriangle size={18} />}<span>{moveResult.message}</span></div>}
      <div className="import-actions"><button className="btn-secondary" disabled={!sourceSubjectId || !subjectId || sourceSubjectId === subjectId || !sourceActivities.length || isMoving} onClick={moveActivities}>{isMoving ? 'Moviendo...' : `Mover ${sourceActivities.length || ''} actividades`}</button></div>
    </div>
    <p className="import-hint">Columnas de la plantilla: Título, Tipo, Fecha de inicio, Fecha límite, Hora límite, Descripción y Estado. Las fechas se escriben como <strong>DD-MM-AAAA</strong>; si omitís la fecha de inicio, se usará la fecha límite.</p>
  </div>;
};

export default ActivitiesImportView;
