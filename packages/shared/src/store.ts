import { create } from 'zustand'

export interface AppState {
  user: {
    id: string | null
    name: string | null
    email: string | null
  }
  theme: 'light' | 'dark'
  isLoading: boolean
}

export interface AppActions {
  setUser: (user: AppState['user']) => void
  setTheme: (theme: AppState['theme']) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>((set) => ({
  user: {
    id: null,
    name: null,
    email: null,
  },
  theme: 'light',
  isLoading: false,
  
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ 
    user: { id: null, name: null, email: null } 
  }),
}))