import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Calendar } from '../types'
import { STORAGE_KEY } from '../config'
import { coerceCalendar, newCalendar } from '../lib/json'

interface StoredState {
  calendars: Calendar[]
  currentId: string | null
}

interface StoreContextValue {
  calendars: Calendar[]
  current: Calendar | null
  currentId: string | null
  selectCalendar: (id: string) => void
  createCalendar: (name?: string) => void
  importCalendar: (cal: Calendar, opts?: { replaceCurrent?: boolean }) => void
  deleteCalendar: (id: string) => void
  duplicateCalendar: (id: string) => void
  /** Modifica el calendario actual mediante una función productora. */
  patchCurrent: (fn: (c: Calendar) => Calendar) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { calendars?: unknown[]; currentId?: string | null }
      const calendars = Array.isArray(parsed.calendars) ? parsed.calendars.map(coerceCalendar) : []
      if (calendars.length) {
        const currentId =
          parsed.currentId && calendars.some((c) => c.id === parsed.currentId)
            ? parsed.currentId
            : calendars[0].id
        return { calendars, currentId }
      }
    }
  } catch {
    /* datos corruptos: empezar de cero */
  }
  const first = newCalendar('Curso 2025-2026')
  return { calendars: [first], currentId: first.id }
}

export function CalendarStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* almacenamiento lleno o no disponible */
    }
  }, [state])

  const selectCalendar = useCallback((id: string) => {
    setState((s) => (s.calendars.some((c) => c.id === id) ? { ...s, currentId: id } : s))
  }, [])

  const createCalendar = useCallback((name?: string) => {
    const cal = newCalendar(name || 'Nuevo calendario')
    setState((s) => ({ calendars: [...s.calendars, cal], currentId: cal.id }))
  }, [])

  const importCalendar = useCallback((cal: Calendar, opts?: { replaceCurrent?: boolean }) => {
    setState((s) => {
      if (opts?.replaceCurrent && s.currentId) {
        const merged = { ...cal, id: s.currentId }
        return {
          calendars: s.calendars.map((c) => (c.id === s.currentId ? merged : c)),
          currentId: s.currentId,
        }
      }
      return { calendars: [...s.calendars, cal], currentId: cal.id }
    })
  }, [])

  const deleteCalendar = useCallback((id: string) => {
    setState((s) => {
      const remaining = s.calendars.filter((c) => c.id !== id)
      if (!remaining.length) {
        const fresh = newCalendar('Curso 2025-2026')
        return { calendars: [fresh], currentId: fresh.id }
      }
      const currentId = s.currentId === id ? remaining[0].id : s.currentId
      return { calendars: remaining, currentId }
    })
  }, [])

  const duplicateCalendar = useCallback((id: string) => {
    setState((s) => {
      const src = s.calendars.find((c) => c.id === id)
      if (!src) return s
      const copy = coerceCalendar({ ...src, id: undefined, name: `${src.name} (copia)` })
      return { calendars: [...s.calendars, copy], currentId: copy.id }
    })
  }, [])

  const patchCurrent = useCallback((fn: (c: Calendar) => Calendar) => {
    setState((s) => {
      if (!s.currentId) return s
      return {
        ...s,
        calendars: s.calendars.map((c) =>
          c.id === s.currentId ? { ...fn(c), updatedAt: new Date().toISOString() } : c,
        ),
      }
    })
  }, [])

  const current = useMemo(
    () => state.calendars.find((c) => c.id === state.currentId) ?? null,
    [state.calendars, state.currentId],
  )

  const value: StoreContextValue = {
    calendars: state.calendars,
    current,
    currentId: state.currentId,
    selectCalendar,
    createCalendar,
    importCalendar,
    deleteCalendar,
    duplicateCalendar,
    patchCurrent,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de CalendarStoreProvider')
  return ctx
}
