import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { LoginForm } from './components/LoginForm'
import { Dashboard } from './components/Dashboard'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'

function App() {
  const { user, loading } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={() => window.location.reload()} />
  }

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard currentUser={user} />
      case 'clients':
        return <div className="main-content">Gestion des clients (à implémenter)</div>
      case 'users':
        return <div className="main-content">Gestion des utilisateurs (à implémenter)</div>
      case 'movements':
        return <div className="main-content">Mouvements de stock (à implémenter)</div>
      case 'stock':
        return <div className="main-content">État du stock (à implémenter)</div>
      default:
        return <Dashboard currentUser={user} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar 
        currentUser={user}
        activeView={activeView}
        onViewChange={setActiveView}
        unreadComments={0}
      />
      <Header currentUser={user} activeView={activeView} />
      {renderMainContent()}
    </div>
  )
}

export default App