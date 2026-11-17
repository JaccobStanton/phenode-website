import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { APPLICATIONS, ROLES, NEEDS } from '../data/applications.js'

const Ctx = createContext(null)
const KEY = 'agrela.personalization.v1'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

export function PersonalizationProvider({ children }) {
  const [roleId, setRoleIdState] = useState(() => load().roleId ?? null)
  const [needId, setNeedIdState] = useState(() => load().needId ?? null)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ roleId, needId })) } catch { /* private mode */ }
  }, [roleId, needId])

  const setRoleId = useCallback((id) => setRoleIdState(id), [])
  const setNeedId = useCallback((id) => setNeedIdState(id), [])

  const value = useMemo(() => {
    const role = ROLES.find((r) => r.id === roleId) || null
    const need = NEEDS.find((n) => n.id === needId) || null
    const order = role ? role.order : APPLICATIONS.map((a) => a.id)
    const applications = order.map((id) => APPLICATIONS.find((a) => a.id === id)).filter(Boolean)
    return { roleId, role, setRoleId, needId, need, setNeedId, applications }
  }, [roleId, needId, setRoleId, setNeedId])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePersonalization() {
  const v = useContext(Ctx)
  if (!v) throw new Error('usePersonalization must be used inside PersonalizationProvider')
  return v
}
