import React from 'react'
import { signOut } from '../lib/supabase'

interface HeaderProps {
  currentUser: any
  activeView: string
}

const viewTitles: Record<string, string> = {
  dashboard: 'Tableau de Bord',
  clients: 'Gestion des Clients',
  users: 'Gestion des Utilisateurs',
  movements: 'Mouvements de Stock',
  stock: 'État du Stock'
}

export function Header({ currentUser, activeView }: HeaderProps) {
  const handleLogout = async () => {
    try {
      await signOut()
      window.location.reload()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="header">
      <h1>{viewTitles[activeView] || 'Gestion d\'Entrepôt'}</h1>
      <div className="user-display">
        <span>{currentUser?.name}</span>
        <span>({currentUser?.role})</span>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}