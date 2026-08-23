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
    bgOpacity: 20, // percentage 0% to 80% (lower = background image is sharper and more visible)
    bgBlur: 0, // blur in px (0px = crisp sharp image)
    customBgImage: null, // base64 data URL for uploaded background
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
