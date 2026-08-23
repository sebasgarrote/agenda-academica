import { create } from 'zustand'

const useMenuStore = create((set) => ({
  // Menu Data
  menu: {
    lunes: '',
    martes: '',
    miercoles: '',
    jueves: '',
    viernes: '',
    notas: 'No olvides que tenemos envíos gratis!'
  },
  
  // Design Preferences
  config: {
    theme: 'nude_botanico',
    format: 'square',
    textColor: null, // null means use theme's default primary color
  },

  // Actions
  setMenu: (day, value) => set((state) => ({
    menu: { ...state.menu, [day]: value }
  })),
  
  updateConfig: (updates) => set((state) => ({
    config: { ...state.config, ...updates }
  })),
  
  setFullMenu: (newMenu) => set({ menu: newMenu }),
}))

export default useMenuStore
