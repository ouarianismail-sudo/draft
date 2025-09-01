import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

type Client = Database['public']['Tables']['clients']['Row']
type StockMovement = Database['public']['Tables']['stock_movements']['Row']
type User = Database['public']['Tables']['users']['Row']

interface DashboardProps {
  currentUser: User
}

export function Dashboard({ currentUser }: DashboardProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [currentUser])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load clients based on user role
      let clientsQuery = supabase.from('clients').select('*')
      if (currentUser.role === 'Agriculteur' && currentUser.client_id) {
        clientsQuery = clientsQuery.eq('id', currentUser.client_id)
      }
      
      const { data: clientsData } = await clientsQuery
      setClients(clientsData || [])

      // Load movements based on user role
      let movementsQuery = supabase
        .from('stock_movements')
        .select(`
          *,
          clients(name),
          users(name)
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (currentUser.role === 'Agriculteur' && currentUser.client_id) {
        movementsQuery = movementsQuery.eq('client_id', currentUser.client_id)
      }

      const { data: movementsData } = await movementsQuery
      setMovements(movementsData || [])
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const totalIn = movements
      .filter(m => m.type === 'in')
      .reduce((sum, m) => sum + m.total_weight, 0)
    
    const totalOut = movements
      .filter(m => m.type === 'out')
      .reduce((sum, m) => sum + m.total_weight, 0)
    
    const currentStock = totalIn - totalOut
    
    const unreadComments = movements.filter(m => 
      m.farmer_comment && !m.is_comment_read
    ).length

    return { totalIn, totalOut, currentStock, unreadComments }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="main-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-title">Stock Total</div>
          <div className="stat-card-value">{stats.currentStock.toFixed(2)} kg</div>
          <div className="stat-card-subtitle">Stock actuel</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">Entrées</div>
          <div className="stat-card-value in">{stats.totalIn.toFixed(2)} kg</div>
          <div className="stat-card-subtitle">Total des entrées</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">Sorties</div>
          <div className="stat-card-value out">{stats.totalOut.toFixed(2)} kg</div>
          <div className="stat-card-subtitle">Total des sorties</div>
        </div>
        
        {currentUser.role === 'Admin' && (
          <div className="stat-card">
            <div className="stat-card-title">Clients</div>
            <div className="stat-card-value">{clients.length}</div>
            <div className="stat-card-subtitle">Clients actifs</div>
          </div>
        )}
      </div>

      <div className="content-panel">
        <div className="panel-header">
          <h2>Mouvements de Stock Récents</h2>
        </div>
        
        {movements.length === 0 ? (
          <div className="empty-state">
            <p>Aucun mouvement de stock enregistré</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Type</th>
                <th>Produit</th>
                <th>Poids Total</th>
                <th>Poids Produit</th>
                {currentUser.role === 'Admin' && <th>Enregistré par</th>}
              </tr>
            </thead>
            <tbody>
              {movements.slice(0, 10).map((movement: any) => (
                <tr key={movement.id}>
                  <td>{new Date(movement.date).toLocaleDateString('fr-FR')}</td>
                  <td>{movement.clients?.name}</td>
                  <td>
                    <span className={`status-badge ${movement.type === 'in' ? 'status-active' : 'status-suspended'}`}>
                      {movement.type === 'in' ? 'Entrée' : 'Sortie'}
                    </span>
                  </td>
                  <td>{movement.product}</td>
                  <td>{movement.total_weight} kg</td>
                  <td>{movement.product_weight} kg</td>
                  {currentUser.role === 'Admin' && (
                    <td>{movement.users?.name}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}