import React from 'react';
import { PartyPopper } from 'lucide-react';

const COLORS = ['#F97316', '#FACC15', '#34D399', '#60A5FA', '#C084FC', '#FB7185'];

const SubjectCompletionCelebration = ({ subject }) => {
  if (!subject) return null;

  return (
    <div className="completion-celebration" role="status" aria-live="polite">
      <div className="confetti-layer" aria-hidden="true">
        {Array.from({ length: 42 }, (_, index) => (
          <i
            key={index}
            className="confetti-piece"
            style={{
              left: `${(index * 17) % 100}%`,
              backgroundColor: COLORS[index % COLORS.length],
              animationDelay: `${(index % 9) * 0.08}s`,
              animationDuration: `${1.8 + (index % 5) * 0.18}s`
            }}
          />
        ))}
      </div>
      <div className="completion-message glass-card">
        <PartyPopper size={28} />
        <div><strong>¡Materia finalizada!</strong><span>Completaste todas las actividades de {subject.short_name}.</span></div>
      </div>
    </div>
  );
};

export default SubjectCompletionCelebration;
