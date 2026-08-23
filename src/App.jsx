import React, { useState } from 'react';
import useMenuStore from './store/useMenuStore';
import PromptInput from './components/PromptInput';
import FormInput from './components/FormInput';
import MenuPreview from './components/MenuPreview';
import { LayoutDashboard, MessageSquare, Palette, Maximize, Check, Type } from 'lucide-react';
import { THEMES, FONT_COLORS } from './data/themes';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('prompt'); // prompt | form
  const { config, updateConfig } = useMenuStore();

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="serif italic">Vianda <span className="brand-accent">Studio</span></h1>
          <p className="subtitle outfit">CREA MENÚS PREMIUM EN SEGUNDOS</p>
        </div>
      </header>

      <main className="main-content">
        <div className="input-section">
          {/* Tabs */}
          <div className="tabs-container glass">
            <button 
              className={`tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
              onClick={() => setActiveTab('prompt')}
            >
              <MessageSquare size={18} />
              <span>Modo Libre</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              <LayoutDashboard size={18} />
              <span>Formulario</span>
            </button>
          </div>

          <div className="tab-content animate-in">
            {activeTab === 'prompt' ? <PromptInput /> : <FormInput />}
          </div>

          {/* SHARED CONFIGURATION */}
          <div className="shared-config glass animate-in" style={{ animationDelay: '0.1s' }}>
            {/* Background Thumbnail Swatches */}
            <div className="config-group">
                <label className="config-label"><Palette size={16} /> Fondo de la Tarjeta</label>
                <div className="bg-swatches-grid">
                    {Object.values(THEMES).map(t => {
                      const isSelected = config.theme === t.id;
                      return (
                        <button 
                            key={t.id}
                            title={t.name}
                            className={`bg-swatch-btn ${isSelected ? 'active' : ''}`}
                            style={
                              t.backgroundImage 
                                ? { backgroundImage: `url(${t.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                : { backgroundColor: '#ffffff', border: '1px solid #ddd' }
                            }
                            onClick={() => updateConfig({ theme: t.id, textColor: null })}
                        >
                            {isSelected && <Check size={16} className="swatch-check" />}
                        </button>
                      );
                    })}
                </div>
            </div>

            {/* Font Color Swatches */}
            <div className="config-group">
                <label className="config-label"><Type size={16} /> Color de Letra / Títulos</label>
                <div className="font-colors-grid">
                    {FONT_COLORS.map(c => {
                      const activeColor = config.textColor || (THEMES[config.theme] ? THEMES[config.theme].colors.primary : '#1a1a1a');
                      const isSelected = activeColor.toLowerCase() === c.color.toLowerCase();
                      return (
                        <button 
                            key={c.id}
                            title={c.color}
                            className={`font-color-btn ${isSelected ? 'active' : ''}`}
                            style={{ backgroundColor: c.color }}
                            onClick={() => updateConfig({ textColor: c.color })}
                        >
                            {isSelected && <Check size={14} style={{ color: '#ffffff' }} />}
                        </button>
                      );
                    })}
                </div>
            </div>
            
            <div className="config-group">
                <label className="config-label"><Maximize size={16} /> Formato de Salida</label>
                <div className="format-toggle">
                  <button 
                    className={`format-btn ${config.format === 'square' ? 'active' : ''}`}
                    onClick={() => updateConfig({ format: 'square' })}
                  >1:1 (Cuadrado)</button>
                  <button 
                    className={`format-btn ${config.format === 'story' ? 'active' : ''}`}
                    onClick={() => updateConfig({ format: 'story' })}
                  >9:16 (Historia)</button>
                </div>
            </div>

          </div>
        </div>

        <div id="preview-section" className="preview-section">
          <h2 className="section-title serif">Vista Previa</h2>
          <MenuPreview />
        </div>
      </main>

      <footer className="app-footer">
        <p className="outfit">© 2026 Vianda Studio · Hecho para Mamá ❤️</p>
      </footer>
    </div>
  );
}

export default App;
