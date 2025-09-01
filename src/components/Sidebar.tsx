import React from 'react'

interface SidebarProps {
  currentUser: any
  activeView: string
  onViewChange: (view: string) => void
  unreadComments: number
}

export function Sidebar({ currentUser, activeView, onViewChange, unreadComments }: SidebarProps) {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', badge: null },
    { id: 'clients', label: 'Clients', badge: null },
    { id: 'users', label: 'Utilisateurs', badge: null },
    { id: 'movements', label: 'Mouvements', badge: unreadComments > 0 ? unreadComments : null },
    { id: 'stock', label: 'Stock', badge: null }
  ]

  const farmerMenuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', badge: null },
    { id: 'movements', label: 'Mes Mouvements', badge: null }
  ]

  const menuItems = currentUser?.role === 'Admin' ? adminMenuItems : farmerMenuItems

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        WMS
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <a
                href="#"
                className={activeView === item.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  onViewChange(item.id)
                }}
              >
                {item.label}
                {item.badge && (
                  <span className="notification-badge">{item.badge}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}