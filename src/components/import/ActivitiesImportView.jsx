import React, { useRef, useState } from 'react';
import { Download, FileSpreadsheet, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
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

const ActivitiesImportView = ({ subjects, onCreateActivity }) => {
  const inputRef = useRef(null);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState(null);

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

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
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

  const importRows = async () => {
    if (!subjectId || !rows.length || errors.length) return;
    setIsImporting(true);
    try {
      for (const row of rows) await onCreateActivity({ ...row, subject_id: subjectId });
      setResult({ success: true, count: rows.length });
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

  return <div className="import-activities-container">
    <div className="import-header">
      <div><h2><FileSpreadsheet size={24} /> Importar actividades</h2><p>Descargá la plantilla, completala en Excel y cargá todas las actividades de una materia de una sola vez.</p></div>
      <button className="btn-secondary" onClick={downloadTemplate}><Download size={17} /> Descargar plantilla Excel</button>
    </div>
    <div className="glass-card import-card">
      <div className="form-group">
        <label className="form-label">Materia para estas actividades *</label>
        <select className="form-select" value={subjectId} onChange={(event) => setSubjectId(event.target.value)} disabled={!subjects.length}>
          {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name} ({subject.short_name})</option>)}
        </select>
        {!subjects.length && <p className="import-hint">Primero creá una materia para poder importar sus actividades.</p>}
      </div>
      <label className="upload-zone" htmlFor="activities-file">
        <Upload size={28} />
        <span>{fileName || 'Elegí o arrastrá tu archivo .xlsx'}</span>
        <small>Usá la plantilla descargada. Las columnas Título y Fecha límite son obligatorias.</small>
        <input ref={inputRef} id="activities-file" type="file" accept=".xlsx,.xls" onChange={handleFile} />
      </label>
      {errors.length > 0 && <div className="import-errors"><AlertTriangle size={18} /><div><strong>Corregí estas filas antes de importar:</strong>{errors.map((error) => <div key={error}>{error}</div>)}</div></div>}
      {rows.length > 0 && !errors.length && <div className="import-ready"><CheckCircle2 size={19} /><span>Se encontraron {rows.length} actividades listas para importar.</span></div>}
      {result && <div className={result.success ? 'import-ready' : 'import-errors'}>{result.success ? <CheckCircle2 size={19} /> : <AlertTriangle size={18} />}<span>{result.success ? `Se importaron ${result.count} actividades correctamente.` : result.message}</span></div>}
      <div className="import-actions"><button className="btn-primary" disabled={!subjectId || !rows.length || errors.length || isImporting} onClick={importRows}>{isImporting ? 'Importando...' : `Importar ${rows.length || ''} actividades`}</button></div>
    </div>
    <p className="import-hint">Columnas de la plantilla: Título, Tipo, Fecha de inicio, Fecha límite, Hora límite, Descripción y Estado. Las fechas se escriben como <strong>DD-MM-AAAA</strong>; si omitís la fecha de inicio, se usará la fecha límite.</p>
  </div>;
};

export default ActivitiesImportView;
