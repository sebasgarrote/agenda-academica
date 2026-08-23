import React, { useRef, useState } from 'react';
import useMenuStore from '../store/useMenuStore';
import * as htmlToImage from 'html-to-image';
import { Download, Check, Loader2, Share2 } from 'lucide-react';
import { THEMES } from '../data/themes';

const MenuPreview = () => {
  const previewRef = useRef(null);
  const titleRef = useRef(null);
  const { menu, config } = useMenuStore();
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);

  let currentTheme = THEMES[config.theme] || THEMES.nude_botanico || THEMES.tradicional;
  if (config.theme === 'custom' && config.customBgImage) {
    currentTheme = {
      id: 'custom',
      name: 'Fondo Personalizado',
      colors: { primary: config.textColor || '#1a1a1a', secondary: '#ffffff' },
      backgroundImage: config.customBgImage,
    };
  }

  const primaryColor = config.textColor || currentTheme.colors.primary;
  const isSquare = config.format === 'square';

  // Auto-adjust title font size if it risks overflowing/clipping on narrow screens
  React.useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const adjustTitleSize = () => {
      el.style.fontSize = ''; // reset to CSS default
      const parent = el.parentElement;
      if (!parent) return;
      const parentWidth = parent.clientWidth;
      if (parentWidth > 0 && el.scrollWidth > parentWidth) {
        const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
        const ratio = parentWidth / el.scrollWidth;
        el.style.fontSize = `${currentSize * ratio * 0.95}px`;
      }
    };

    adjustTitleSize();
    window.addEventListener('resize', adjustTitleSize);
    return () => window.removeEventListener('resize', adjustTitleSize);
  }, [config.format, config.theme, config.textColor, config.customBgImage, menu]);

  const downloadImage = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const blob = await htmlToImage.toBlob(previewRef.current, { 
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff'
      });

      if (!blob) throw new Error('Blob generation failed');

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', `Menu_Vianda_${Date.now()}.png`);
      
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('Error al generar imagen:', err);
      alert('Error técnico al crear la imagen. Por favor, usa el botón de WhatsApp!');
    } finally {
      setDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    if (!previewRef.current) return;
    setSending(true);
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, { 
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true
      });
      
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `menu-${Date.now()}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Menú de la Semana',
          text: '¡Acá está nuestro menú! 🥗✨'
        });
      } else {
        const isHTTPS = window.location.protocol === 'https:';
        if (!isHTTPS && window.location.hostname !== 'localhost') {
            alert('¡Atención! Para compartir directo por WhatsApp necesitas entrar por una conexión segura (HTTPS).');
        } else {
            alert('Tu navegador no permite compartir imágenes directamente.');
        }
      }
    } catch (err) {
      console.log('Error sharing', err);
    } finally {
      setSending(false);
    }
  };

  const days = [
    { key: 'lunes', label: 'LUNES' },
    { key: 'martes', label: 'MARTES' },
    { key: 'miercoles', label: 'MIÉRCOLES' },
    { key: 'jueves', label: 'JUEVES' },
    { key: 'viernes', label: 'VIERNES' },
  ];

  return (
    <div className="preview-container" id="menu-preview-section">
      <div className="preview-wrapper glass" ref={previewRef}>
        <div className={`menu-card ${config.format}`}>
          {currentTheme.backgroundImage && (
            <div className="bg-layer" style={{ backgroundImage: `url(${currentTheme.backgroundImage})` }} />
          )}
          <div 
            className="bg-overlay" 
            style={{ 
              backgroundColor: `rgba(255, 255, 255, ${(config.bgOpacity ?? 20) / 100})`,
              backdropFilter: `blur(${config.bgBlur ?? 0}px)`,
              WebkitBackdropFilter: `blur(${config.bgBlur ?? 0}px)`
            }} 
          />

          <div className="card-inner">
            <header className="card-header">
              <div className="header-brand-container" ref={titleRef}>
                <div className="brand-text-block">
                  <h1 className="serif" style={{ color: primaryColor }}>VIANDAS SALUDABLES</h1>
                  <p className="subtitle outfit">¿Qué comemos esta semana?</p>
                </div>
                <img src="/assets/logo.png" alt="Logo Viandas" className="brand-logo-large" />
              </div>
            </header>

            <div className="preview-days-grid">
              {days.map(day => (
                <div key={day.key} className="preview-day-card glass-card">
                  <span className="preview-day-name serif" style={{ color: primaryColor }}>{day.label}</span>
                  <p className="preview-dish-text outfit">{menu[day.key] || 'Cerrado'}</p>
                </div>
              ))}
              {isSquare && menu.notas && (
                <div className="preview-day-card glass-card info-card">
                    <p className="preview-dish-text outfit">{menu.notas}</p>
                </div>
              )}
            </div>

            {menu.notas && !isSquare && (
              <footer className="preview-card-footer glass-card">
                <p className="notas-text outfit">
                  <span className="novedad-badge serif" style={{ color: primaryColor }}>{menu.notas}</span>
                </p>
              </footer>
            )}
          </div>
        </div>
      </div>

      <div className="action-buttons-group">
        <button className="primary-btn download-btn" onClick={downloadImage} disabled={downloading}>
          {downloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
          <span>Descargar PNG</span>
        </button>
        <button className="secondary-btn share-btn" onClick={handleNativeShare} disabled={sending}>
          {sending ? <Loader2 className="animate-spin" size={20} /> : <Share2 size={20} />}
          <span>WhatsApp</span>
        </button>
      </div>

      <style jsx="true">{`
        .preview-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }
        .preview-wrapper {
          width: 100%;
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          overflow: hidden;
          background: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          container-type: inline-size;
        }
        .menu-card {
          position: relative;
          width: 100%;
          max-width: 600px;
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          padding: 6%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          container-type: inline-size;
        }
        .menu-card.square {
          aspect-ratio: 1 / 1;
          padding: 4cqw 5cqw 6cqw 5cqw;
        }
        .menu-card.story { 
          aspect-ratio: 9/16; 
          max-width: 420px; 
          padding: 4cqw 6cqw 8cqw 6cqw;
        }

        .bg-layer { position: absolute; top:0; left:0; right:0; bottom:0; background-size: cover; background-position: center; z-index: 1; }
        .bg-overlay { position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(255,255,255,0.6); backdrop-filter: blur(4px); z-index: 2; }
        
        .card-inner { position: relative; z-index: 3; display: flex; flex-direction: column; height: 100%; justify-content: space-between; }
        .card-header { text-align: center; margin-bottom: 2cqw; width: 100%; display: flex; flex-direction: column; align-items: center; }

        .header-brand-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 2.2cqw;
          max-width: 100%;
          white-space: nowrap;
          box-sizing: border-box;
          font-size: 5.0cqw;
        }
        .square .header-brand-container { font-size: 4.8cqw; }
        .story .header-brand-container { font-size: 5.0cqw; }

        .brand-text-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .brand-text-block h1 { 
          font-size: inherit; 
          margin: 0; 
          text-transform: uppercase; 
          line-height: 1.0;
          white-space: nowrap;
        }

        .brand-text-block .subtitle { 
          font-size: 0.44em; 
          color: #555; 
          text-transform: uppercase; 
          letter-spacing: 0.15cqw; 
          margin-top: 0.2cqw; 
          white-space: nowrap;
        } 

        .brand-logo-large {
          height: 2.05em;
          width: auto;
          object-fit: contain;
          vertical-align: middle;
          flex-shrink: 0;
        } 
        
        .card-header .subtitle { font-size: 2.8cqw; color: #555; text-transform: uppercase; letter-spacing: 0.2cqw; margin-top: 1cqw; }
        .story .card-header .subtitle { font-size: 3.2cqw; }
        
        .preview-day-name { font-size: 4.2cqw; font-weight: 700; border-bottom: 1px solid rgba(0,0,0,0.06); margin-bottom: 0.5cqw; }
        .story .preview-day-name { font-size: 4.8cqw; padding-bottom: 1cqw; }
        
        .preview-dish-text { font-size: 3.5cqw; line-height: 1.15; color: #222; }
        .story .preview-dish-text { font-size: 4cqw; line-height: 1.25; }
        
        .notas-text { font-size: 3.2cqw; }
        .story .notas-text { font-size: 3.8cqw; }

        .preview-days-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5cqw; flex: 1; align-content: center; }
        .square .preview-days-grid { 
          gap: 2cqw 3cqw;
          margin-bottom: 3cqw;
        }
        .story .preview-days-grid { 
          grid-template-columns: 1fr; 
          gap: 2.5cqw; 
          align-content: start; 
          margin-top: 4cqw;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.6);
          padding: 2.5cqw 3cqw;
          border-radius: 2.5cqw;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        @media (min-width: 900px) {
          .menu-card { max-width: 550px; }
          .secondary-btn, .primary-btn { padding: 16px 24px; font-size: 16px; }
        }

        .novedad-badge { font-weight: 700; margin-right: 2cqw; }
        .info-card { background: hsla(var(--p-h), var(--p-s), var(--p-l), 0.05); border-color: hsla(var(--p-h), var(--p-s), var(--p-l), 0.2); }

        .action-buttons-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
        .secondary-btn { background: white; border: 2px solid var(--primary); color: var(--primary); padding: 14px; border-radius: 50px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
        .primary-btn { background: var(--primary); color: white; border: none; padding: 14px; border-radius: 50px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
        
        @media (max-width: 600px) {
          .preview-wrapper { padding: 5px; }
          .secondary-btn, .primary-btn { padding: 12px 8px; font-size: 14px; }
        }
      `}</style>
    </div>
  );
};

export default MenuPreview;
