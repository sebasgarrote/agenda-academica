import React from 'react';
import { AlertCircle, Clock, Calendar, CheckCircle2 } from 'lucide-react';

const StatusBadge = ({ urgency }) => {
  if (!urgency) return null;

  const renderIcon = () => {
    switch (urgency.id) {
      case 'COMPLETADA':
        return <CheckCircle2 size={13} />;
      case 'VENCIDA':
        return <AlertCircle size={13} />;
      case 'URGENTE':
        return <Clock size={13} />;
      case 'PRÓXIMA':
        return <Calendar size={13} />;
      default:
        return <Calendar size={13} />;
    }
  };

  return (
    <span
      className={`status-badge status-${urgency.id.toLowerCase()}`}
      style={{
        backgroundColor: urgency.bg,
        color: urgency.color,
        borderColor: `${urgency.color}40`
      }}
    >
      {renderIcon()}
      <span>{urgency.badgeText}</span>
    </span>
  );
};

export default StatusBadge;
